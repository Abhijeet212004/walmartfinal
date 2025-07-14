from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List
from datetime import datetime, timedelta

from app.models.schemas import (
    ForecastRequest, 
    ForecastResponse, 
    ForecastPoint
)
from app.services.forecasting import forecasting_service

router = APIRouter()

@router.post("/generate", response_model=ForecastResponse)
async def generate_forecast(request: ForecastRequest):
    """
    Generate demand forecast for a specific product
    
    - Uses Facebook Prophet for time series forecasting
    - Requires at least 14 days of historical data for best results
    - Falls back to simple moving average for limited data
    """
    try:
        # In a real app, fetch sales data from database
        # For demo, generate mock historical data
        sales_data = generate_mock_sales_data(
            request.product_id, 
            days_back=30
        )
        
        # Generate forecast
        forecast_result = await forecasting_service.generate_forecast(
            product_id=request.product_id,
            sales_data=sales_data,
            days_ahead=request.days_ahead
        )
        
        if forecast_result.get('error'):
            raise HTTPException(
                status_code=500, 
                detail=f"Forecasting failed: {forecast_result['error']}"
            )
        
        # Convert to response format
        forecast_points = [
            ForecastPoint(**point) for point in forecast_result['forecast_points']
        ]
        
        return ForecastResponse(
            product_id=request.product_id,
            product_name=f"Product {request.product_id}",  # In real app, fetch from DB
            model_version=forecast_result['model_version'],
            forecast_points=forecast_points,
            total_predicted_demand=forecast_result['total_predicted_demand'],
            confidence_score=forecast_result['confidence_score']
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/product/{product_id}", response_model=ForecastResponse)
async def get_product_forecast(
    product_id: int,
    days_ahead: int = Query(default=7, ge=1, le=30, description="Days to forecast ahead")
):
    """Get forecast for a specific product"""
    request = ForecastRequest(product_id=product_id, days_ahead=days_ahead)
    return await generate_forecast(request)

@router.get("/multiple-products")
async def get_multiple_forecasts(
    product_ids: str = Query(..., description="Comma-separated list of product IDs"),
    days_ahead: int = Query(default=7, ge=1, le=30)
):
    """Get forecasts for multiple products"""
    try:
        # Parse product IDs
        product_id_list = [int(pid.strip()) for pid in product_ids.split(',')]
        
        if len(product_id_list) > 10:
            raise HTTPException(
                status_code=400, 
                detail="Maximum 10 products allowed per request"
            )
        
        forecasts = []
        for product_id in product_id_list:
            try:
                forecast = await get_product_forecast(product_id, days_ahead)
                forecasts.append(forecast)
            except Exception as e:
                # Continue with other products if one fails
                forecasts.append({
                    "product_id": product_id,
                    "error": str(e),
                    "status": "failed"
                })
        
        return {
            "forecasts": forecasts,
            "total_products": len(product_id_list),
            "successful_forecasts": len([f for f in forecasts if not isinstance(f, dict) or 'error' not in f])
        }
        
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid product IDs format")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/restock-recommendations/{product_id}")
async def get_restock_recommendations(
    product_id: int,
    current_stock: int = Query(..., ge=0, description="Current stock level"),
    safety_stock_days: int = Query(default=3, ge=1, le=14, description="Safety stock in days")
):
    """Get restock recommendations based on forecast"""
    try:
        # Get forecast first
        forecast = await get_product_forecast(product_id, days_ahead=7)
        
        # Generate restock recommendations
        recommendations = await forecasting_service.get_restock_recommendations(
            current_stock=current_stock,
            forecast_data=forecast.dict(),
            safety_stock_days=safety_stock_days
        )
        
        return {
            "product_id": product_id,
            "current_stock": current_stock,
            "forecast_summary": {
                "total_predicted_demand": forecast.total_predicted_demand,
                "confidence_score": forecast.confidence_score
            },
            "recommendations": recommendations
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/accuracy-metrics/{product_id}")
async def get_forecast_accuracy(product_id: int):
    """Get historical forecast accuracy metrics"""
    try:
        # In a real app, calculate actual vs predicted from database
        # For demo, return mock metrics
        metrics = {
            "product_id": product_id,
            "last_30_days": {
                "mean_absolute_error": 2.3,
                "mean_absolute_percentage_error": 15.8,
                "accuracy_score": 84.2
            },
            "last_7_days": {
                "mean_absolute_error": 1.8,
                "mean_absolute_percentage_error": 12.4,
                "accuracy_score": 87.6
            },
            "model_performance": "good",
            "recommendations": [
                "Model performing well for short-term forecasts",
                "Consider retraining with more recent data for better accuracy"
            ]
        }
        
        return metrics
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def generate_mock_sales_data(product_id: int, days_back: int = 30) -> List[dict]:
    """Generate mock sales data for demo purposes"""
    import random
    
    sales_data = []
    base_demand = 20 + (product_id % 10)  # Different base demand per product
    
    for i in range(days_back):
        date = datetime.now() - timedelta(days=days_back - i)
        
        # Add some patterns
        weekday_factor = 1.2 if date.weekday() < 5 else 0.8  # Higher on weekdays
        trend_factor = 1 + (i / days_back) * 0.1  # Slight upward trend
        random_factor = random.uniform(0.7, 1.3)  # Random variation
        
        quantity = max(0, int(base_demand * weekday_factor * trend_factor * random_factor))
        revenue = quantity * (15.99 + (product_id % 5))  # Different prices
        
        sales_data.append({
            "date": date.isoformat(),
            "quantity_sold": quantity,
            "revenue": round(revenue, 2),
            "store_id": f"store_{(i % 5) + 1}"
        })
    
    return sales_data
