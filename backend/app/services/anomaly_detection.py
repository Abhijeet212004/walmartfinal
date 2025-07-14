import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
from datetime import datetime, timedelta
from typing import List, Dict, Tuple
import logging

logger = logging.getLogger(__name__)

class AnomalyDetectionService:
    def __init__(self):
        """Initialize the anomaly detection service"""
        self.models = {}  # Store trained models per product
        self.scalers = {}  # Store scalers for normalization
        
    async def detect_anomalies(self, 
                             product_id: int, 
                             sales_data: List[Dict], 
                             contamination: float = 0.1) -> Dict:
        """
        Detect anomalies in sales data using Isolation Forest
        
        Args:
            product_id: ID of the product
            sales_data: Historical sales data
            contamination: Expected proportion of anomalies (0.1 = 10%)
            
        Returns:
            Dictionary with anomaly detection results
        """
        try:
            # Prepare data
            df = self._prepare_data(sales_data)
            
            if len(df) < 7:  # Need at least a week of data
                return await self._simple_anomaly_detection(product_id, sales_data)
            
            # Feature engineering
            features = self._engineer_features(df)
            
            # Handle case with insufficient features
            if features.empty or len(features.columns) == 0:
                return await self._simple_anomaly_detection(product_id, sales_data)
            
            # Scale features
            scaler = StandardScaler()
            features_scaled = scaler.fit_transform(features)
            
            # Train Isolation Forest
            model = IsolationForest(
                contamination=contamination,
                random_state=42,
                n_estimators=100
            )
            
            anomaly_labels = model.fit_predict(features_scaled)
            anomaly_scores = model.decision_function(features_scaled)
            
            # Store model and scaler
            self.models[product_id] = {
                'model': model,
                'scaler': scaler,
                'trained_at': datetime.now(),
                'data_points': len(df)
            }
            
            # Process results
            anomaly_points = []
            anomalies_count = 0
            
            for i, (idx, row) in enumerate(df.iterrows()):
                is_anomaly = anomaly_labels[i] == -1
                if is_anomaly:
                    anomalies_count += 1
                
                # Normalize anomaly score to 0-1 range
                normalized_score = self._normalize_anomaly_score(anomaly_scores[i])
                
                anomaly_points.append({
                    'date': row['date'],
                    'value': row['quantity_sold'],
                    'is_anomaly': is_anomaly,
                    'anomaly_score': normalized_score
                })
            
            return {
                'product_id': product_id,
                'anomalies_detected': anomalies_count,
                'anomaly_points': anomaly_points,
                'contamination_rate': round(anomalies_count / len(df) * 100, 2),
                'analysis_period': f"{df['date'].min()} to {df['date'].max()}",
                'method': 'isolation_forest',
                'data_points_analyzed': len(df)
            }
            
        except Exception as e:
            logger.error(f"Anomaly detection failed for product {product_id}: {e}")
            return await self._simple_anomaly_detection(product_id, sales_data)
    
    def _prepare_data(self, sales_data: List[Dict]) -> pd.DataFrame:
        """Prepare sales data for anomaly detection"""
        df = pd.DataFrame(sales_data)
        
        if df.empty:
            return df
        
        # Convert date column
        df['date'] = pd.to_datetime(df['date'])
        
        # Aggregate by date if multiple entries per day
        df = df.groupby('date').agg({
            'quantity_sold': 'sum',
            'revenue': 'sum'
        }).reset_index()
        
        # Sort by date
        df = df.sort_values('date').reset_index(drop=True)
        
        return df
    
    def _engineer_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Engineer features for anomaly detection"""
        try:
            features = pd.DataFrame()
            
            if len(df) < 3:
                return features
            
            # Basic features
            features['quantity'] = df['quantity_sold']
            features['revenue'] = df['revenue']
            
            # Rolling statistics (if enough data)
            if len(df) >= 7:
                features['quantity_7d_mean'] = df['quantity_sold'].rolling(window=7, min_periods=1).mean()
                features['quantity_7d_std'] = df['quantity_sold'].rolling(window=7, min_periods=1).std()
                features['revenue_7d_mean'] = df['revenue'].rolling(window=7, min_periods=1).mean()
            
            # Day of week effect
            df['dayofweek'] = df['date'].dt.dayofweek
            features['dayofweek'] = df['dayofweek']
            
            # Trend features
            if len(df) >= 5:
                features['quantity_trend'] = df['quantity_sold'].diff(periods=1)
                features['quantity_trend_3d'] = df['quantity_sold'].diff(periods=3)
            
            # Price per unit (if both quantity and revenue available)
            features['price_per_unit'] = df['revenue'] / (df['quantity_sold'] + 1e-8)
            
            # Remove any infinite or NaN values
            features = features.replace([np.inf, -np.inf], np.nan)
            features = features.fillna(method='ffill').fillna(0)
            
            return features
            
        except Exception as e:
            logger.error(f"Feature engineering failed: {e}")
            return pd.DataFrame()
    
    def _normalize_anomaly_score(self, score: float) -> float:
        """Normalize anomaly score to 0-1 range where 1 is most anomalous"""
        try:
            # Isolation Forest scores are typically between -0.5 and 0.5
            # Negative scores indicate anomalies
            normalized = max(0, min(1, (0.5 - score) / 1.0))
            return round(normalized, 3)
        except:
            return 0.5
    
    async def _simple_anomaly_detection(self, 
                                       product_id: int, 
                                       sales_data: List[Dict]) -> Dict:
        """Simple statistical anomaly detection for limited data"""
        try:
            df = pd.DataFrame(sales_data)
            
            if df.empty:
                return {
                    'product_id': product_id,
                    'anomalies_detected': 0,
                    'anomaly_points': [],
                    'method': 'insufficient_data',
                    'note': 'Not enough data for anomaly detection'
                }
            
            # Convert date
            df['date'] = pd.to_datetime(df['date'])
            df = df.sort_values('date')
            
            # Simple statistical approach using Z-score
            mean_quantity = df['quantity_sold'].mean()
            std_quantity = df['quantity_sold'].std()
            
            if std_quantity == 0:
                # No variation in data
                anomaly_points = [
                    {
                        'date': row['date'],
                        'value': row['quantity_sold'],
                        'is_anomaly': False,
                        'anomaly_score': 0.0
                    }
                    for _, row in df.iterrows()
                ]
                return {
                    'product_id': product_id,
                    'anomalies_detected': 0,
                    'anomaly_points': anomaly_points,
                    'method': 'z_score_no_variation'
                }
            
            # Calculate Z-scores
            df['z_score'] = np.abs((df['quantity_sold'] - mean_quantity) / std_quantity)
            
            # Consider points with Z-score > 2 as anomalies
            anomaly_threshold = 2.0
            
            anomaly_points = []
            anomalies_count = 0
            
            for _, row in df.iterrows():
                is_anomaly = row['z_score'] > anomaly_threshold
                if is_anomaly:
                    anomalies_count += 1
                
                # Normalize Z-score to 0-1 range
                anomaly_score = min(1.0, row['z_score'] / 3.0)  # Cap at 3 sigma
                
                anomaly_points.append({
                    'date': row['date'],
                    'value': row['quantity_sold'],
                    'is_anomaly': is_anomaly,
                    'anomaly_score': round(anomaly_score, 3)
                })
            
            return {
                'product_id': product_id,
                'anomalies_detected': anomalies_count,
                'anomaly_points': anomaly_points,
                'analysis_period': f"{df['date'].min()} to {df['date'].max()}",
                'method': 'z_score',
                'data_points_analyzed': len(df),
                'note': 'Simple statistical method due to limited data'
            }
            
        except Exception as e:
            logger.error(f"Simple anomaly detection failed: {e}")
            return {
                'product_id': product_id,
                'error': str(e),
                'anomalies_detected': 0,
                'anomaly_points': []
            }
    
    async def generate_anomaly_alerts(self, anomaly_data: Dict) -> List[Dict]:
        """Generate alerts based on detected anomalies"""
        try:
            alerts = []
            
            if anomaly_data.get('anomalies_detected', 0) == 0:
                return alerts
            
            # High anomaly score alerts
            high_anomaly_points = [
                point for point in anomaly_data.get('anomaly_points', [])
                if point['is_anomaly'] and point['anomaly_score'] > 0.8
            ]
            
            if high_anomaly_points:
                alerts.append({
                    'type': 'high_anomaly',
                    'severity': 'high',
                    'message': f"Critical anomaly detected: {len(high_anomaly_points)} data points with high anomaly scores",
                    'details': high_anomaly_points[-3:]  # Last 3 high anomalies
                })
            
            # Sudden drops (possible theft)
            recent_anomalies = [
                point for point in anomaly_data.get('anomaly_points', [])
                if point['is_anomaly'] and 
                   (datetime.now() - pd.to_datetime(point['date'])).days <= 7
            ]
            
            if recent_anomalies:
                avg_recent_value = sum(p['value'] for p in recent_anomalies) / len(recent_anomalies)
                overall_avg = sum(p['value'] for p in anomaly_data.get('anomaly_points', [])) / max(1, len(anomaly_data.get('anomaly_points', [])))
                
                if avg_recent_value < overall_avg * 0.5:  # 50% drop
                    alerts.append({
                        'type': 'sudden_drop',
                        'severity': 'high',
                        'message': f"Significant sales drop detected - possible theft or supply issue",
                        'recent_average': round(avg_recent_value, 2),
                        'overall_average': round(overall_avg, 2)
                    })
            
            # Clustering of anomalies
            contamination_rate = anomaly_data.get('contamination_rate', 0)
            if contamination_rate > 20:  # More than 20% anomalies
                alerts.append({
                    'type': 'high_anomaly_rate',
                    'severity': 'medium',
                    'message': f"High anomaly rate detected: {contamination_rate}% of data points are anomalous",
                    'recommendation': 'Review data quality and investigate potential systematic issues'
                })
            
            return alerts
            
        except Exception as e:
            logger.error(f"Alert generation failed: {e}")
            return []

# Singleton instance
anomaly_service = AnomalyDetectionService()
