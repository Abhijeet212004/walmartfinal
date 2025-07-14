import pandas as pd
import numpy as np
from prophet import Prophet
from sklearn.metrics import mean_absolute_error, mean_squared_error
from datetime import datetime, timedelta
from typing import List, Dict, Tuple
import logging
import warnings

# Suppress Prophet warnings
warnings.filterwarnings('ignore')
logging.getLogger('prophet').setLevel(logging.WARNING)

logger = logging.getLogger(__name__)

class ForecastingService:
    def __init__(self):
        """Initialize the forecasting service"""
        self.models = {}  # Store trained models per product
        
    async def generate_forecast(self, 
                              product_id: int, 
                              sales_data: List[Dict], 
                              days_ahead: int = 7) -> Dict:
        """
        Generate demand forecast using Facebook Prophet
        
        Args:
            product_id: ID of the product
            sales_data: Historical sales data
            days_ahead: Number of days to forecast
            
        Returns:
            Dictionary with forecast results
        """
        try:
            # Prepare data for Prophet
            df = self._prepare_data(sales_data)
            
            if len(df) < 14:  # Need at least 2 weeks of data
                return await self._simple_forecast(product_id, sales_data, days_ahead)
            
            # Create and train Prophet model
            model = Prophet(
                daily_seasonality=True,
                weekly_seasonality=True,
                yearly_seasonality=False,  # Not enough historical data typically
                interval_width=0.8  # 80% confidence interval
            )
            
            model.fit(df)
            
            # Store model for future use
            self.models[product_id] = {
                'model': model,
                'trained_at': datetime.now(),
                'data_points': len(df)
            }
            
            # Create future dataframe
            future = model.make_future_dataframe(periods=days_ahead)
            
            # Generate forecast
            forecast = model.predict(future)
            
            # Extract forecast points
            forecast_points = []
            for i in range(-days_ahead, 0):
                point = {
                    'date': forecast.iloc[i]['ds'],
                    'predicted_demand': max(0, round(forecast.iloc[i]['yhat'], 2)),
                    'confidence_interval_lower': max(0, round(forecast.iloc[i]['yhat_lower'], 2)),
                    'confidence_interval_upper': max(0, round(forecast.iloc[i]['yhat_upper'], 2))
                }
                forecast_points.append(point)
            
            # Calculate total predicted demand
            total_demand = sum(point['predicted_demand'] for point in forecast_points)
            
            # Calculate confidence score based on model performance
            confidence_score = await self._calculate_confidence(model, df)
            
            return {
                'product_id': product_id,
                'model_version': 'prophet_v1',
                'forecast_points': forecast_points,
                'total_predicted_demand': round(total_demand, 2),
                'confidence_score': confidence_score,
                'method': 'prophet',
                'data_points_used': len(df)
            }
            
        except Exception as e:
            logger.error(f"Prophet forecasting failed for product {product_id}: {e}")
            return await self._simple_forecast(product_id, sales_data, days_ahead)
    
    def _prepare_data(self, sales_data: List[Dict]) -> pd.DataFrame:
        """Prepare sales data for Prophet model"""
        df = pd.DataFrame(sales_data)
        
        # Convert to Prophet format (ds, y)
        df['ds'] = pd.to_datetime(df['date'])
        df['y'] = df['quantity_sold']
        
        # Aggregate by date if multiple entries per day
        df = df.groupby('ds')['y'].sum().reset_index()
        
        # Sort by date
        df = df.sort_values('ds').reset_index(drop=True)
        
        return df[['ds', 'y']]
    
    async def _simple_forecast(self, 
                             product_id: int, 
                             sales_data: List[Dict], 
                             days_ahead: int) -> Dict:
        """Simple moving average forecast for limited data"""
        try:
            df = pd.DataFrame(sales_data)
            
            if len(df) == 0:
                # No data available
                avg_demand = 5  # Default assumption
            else:
                # Calculate moving average
                recent_days = min(7, len(df))
                avg_demand = df.tail(recent_days)['quantity_sold'].mean()
            
            # Generate simple forecast
            forecast_points = []
            base_date = datetime.now().date()
            
            for i in range(1, days_ahead + 1):
                # Add some randomness to make it more realistic
                variation = np.random.normal(1, 0.1)  # 10% variation
                predicted = max(0, avg_demand * variation)
                
                point = {
                    'date': base_date + timedelta(days=i),
                    'predicted_demand': round(predicted, 2),
                    'confidence_interval_lower': round(predicted * 0.8, 2),
                    'confidence_interval_upper': round(predicted * 1.2, 2)
                }
                forecast_points.append(point)
            
            total_demand = sum(point['predicted_demand'] for point in forecast_points)
            
            return {
                'product_id': product_id,
                'model_version': 'simple_average_v1',
                'forecast_points': forecast_points,
                'total_predicted_demand': round(total_demand, 2),
                'confidence_score': 0.6,  # Lower confidence for simple method
                'method': 'moving_average',
                'data_points_used': len(df),
                'note': 'Simple forecast due to limited historical data'
            }
            
        except Exception as e:
            logger.error(f"Simple forecasting failed: {e}")
            return {
                'product_id': product_id,
                'error': str(e),
                'forecast_points': [],
                'total_predicted_demand': 0,
                'confidence_score': 0
            }
    
    async def _calculate_confidence(self, model: Prophet, df: pd.DataFrame) -> float:
        """Calculate confidence score based on model performance"""
        try:
            if len(df) < 7:
                return 0.6
            
            # Use last 20% of data for validation
            train_size = int(len(df) * 0.8)
            train_df = df.iloc[:train_size]
            test_df = df.iloc[train_size:]
            
            # Train on subset
            model_test = Prophet(daily_seasonality=True, weekly_seasonality=True)
            model_test.fit(train_df)
            
            # Predict on test set
            future_test = model_test.make_future_dataframe(periods=len(test_df))
            forecast_test = model_test.predict(future_test)
            
            # Calculate error metrics
            actual = test_df['y'].values
            predicted = forecast_test.iloc[-len(test_df):]['yhat'].values
            
            mae = mean_absolute_error(actual, predicted)
            mape = np.mean(np.abs((actual - predicted) / (actual + 1e-8))) * 100
            
            # Convert to confidence score (0-1)
            confidence = max(0.3, min(0.95, 1 - (mape / 100)))
            
            return round(confidence, 2)
            
        except Exception as e:
            logger.error(f"Confidence calculation failed: {e}")
            return 0.7  # Default confidence
    
    async def get_restock_recommendations(self, 
                                        current_stock: int, 
                                        forecast_data: Dict, 
                                        safety_stock_days: int = 3) -> Dict:
        """Generate restock recommendations based on forecast"""
        try:
            total_predicted_demand = forecast_data.get('total_predicted_demand', 0)
            
            # Add safety stock
            safety_stock = total_predicted_demand * (safety_stock_days / 7)
            
            # Calculate recommended order quantity
            required_stock = total_predicted_demand + safety_stock
            reorder_quantity = max(0, required_stock - current_stock)
            
            # Determine urgency
            days_of_stock = current_stock / max(1, total_predicted_demand / 7)
            
            if days_of_stock < 2:
                urgency = "critical"
            elif days_of_stock < 5:
                urgency = "high"
            elif days_of_stock < 10:
                urgency = "medium"
            else:
                urgency = "low"
            
            return {
                'recommended_quantity': round(reorder_quantity),
                'urgency': urgency,
                'days_of_stock_remaining': round(days_of_stock, 1),
                'safety_stock_recommendation': round(safety_stock),
                'total_required': round(required_stock)
            }
            
        except Exception as e:
            logger.error(f"Restock recommendation failed: {e}")
            return {
                'recommended_quantity': 0,
                'urgency': 'unknown',
                'error': str(e)
            }

# Singleton instance
forecasting_service = ForecastingService()
