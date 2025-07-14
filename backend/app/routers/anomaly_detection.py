from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List
from datetime import datetime, timedelta

from app.models.schemas import (
    AnomalyDetectionRequest,
    AnomalyDetectionResponse,
    AnomalyPoint,
    Alert,
    AlertCreate
)
from app.services.anomaly_detection import anomaly_service

router = APIRouter()

@router.post("/detect", response_model=AnomalyDetectionResponse)
async def detect_anomalies(request: AnomalyDetectionRequest):
    """
    Detect anomalies in sales data for a specific product
    
    - Uses Isolation Forest for anomaly detection
    - Analyzes patterns in sales data to identify unusual behavior
    - Can detect theft, data errors, or unusual demand patterns
    """
    try:
        # Get product ID, default to analyzing all products if not specified
        if request.product_id:
            product_ids = [request.product_id]
        else:
            # In a real app, fetch all product IDs from database
            product_ids = [1, 2, 3, 4, 5]  # Demo products
        
        results = []
        
        for product_id in product_ids:
            # Generate mock sales data for demo
            sales_data = generate_mock_sales_data_with_anomalies(
                product_id, 
                request.days_to_analyze
            )
            
            # Detect anomalies
            anomaly_result = await anomaly_service.detect_anomalies(
                product_id=product_id,
                sales_data=sales_data,
                contamination=0.1  # Expect 10% anomalies
            )
            
            if anomaly_result.get('error'):
                continue  # Skip products with errors
            
            # Convert to response format
            anomaly_points = [
                AnomalyPoint(**point) for point in anomaly_result.get('anomaly_points', [])
            ]
            
            response = AnomalyDetectionResponse(
                product_id=product_id,
                product_name=f"Product {product_id}",
                anomalies_detected=anomaly_result.get('anomalies_detected', 0),
                anomaly_points=anomaly_points,
                analysis_period=anomaly_result.get('analysis_period', '')
            )
            
            results.append(response)
        
        # Return single result if specific product requested
        if request.product_id and results:
            return results[0]
        
        # Return all results
        return {
            "results": results,
            "total_products_analyzed": len(results),
            "total_anomalies": sum(r.anomalies_detected for r in results)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/product/{product_id}")
async def get_product_anomalies(
    product_id: int,
    days_to_analyze: int = Query(default=30, ge=7, le=90)
):
    """Get anomaly detection results for a specific product"""
    request = AnomalyDetectionRequest(
        product_id=product_id,
        days_to_analyze=days_to_analyze
    )
    return await detect_anomalies(request)

@router.get("/alerts")
async def get_anomaly_alerts(
    severity: Optional[str] = Query(None, regex="^(low|medium|high)$"),
    limit: int = Query(default=20, ge=1, le=100)
):
    """Get recent anomaly-based alerts"""
    try:
        # In a real app, fetch from database
        # For demo, generate mock alerts based on recent anomaly detection
        
        alerts = []
        
        # Generate sample alerts
        for i in range(min(limit, 10)):
            product_id = (i % 5) + 1
            
            # Generate different types of alerts
            alert_types = [
                {
                    "type": "theft_suspected",
                    "message": f"Sudden inventory drop detected for Product {product_id} - possible theft",
                    "severity": "high"
                },
                {
                    "type": "data_anomaly",
                    "message": f"Unusual sales pattern detected for Product {product_id}",
                    "severity": "medium"
                },
                {
                    "type": "demand_spike",
                    "message": f"Unexpected demand increase for Product {product_id}",
                    "severity": "low"
                }
            ]
            
            alert_data = alert_types[i % len(alert_types)]
            
            if severity and alert_data["severity"] != severity:
                continue
            
            alert = {
                "id": i + 1,
                "product_id": product_id,
                "alert_type": "anomaly",
                "message": alert_data["message"],
                "severity": alert_data["severity"],
                "is_resolved": i % 4 == 0,  # 25% resolved
                "created_at": (datetime.now() - timedelta(hours=i * 2)).isoformat(),
                "anomaly_score": round(0.5 + (i % 5) * 0.1, 2),
                "affected_period": f"Last {7 + (i % 7)} days"
            }
            
            alerts.append(alert)
        
        return {
            "alerts": alerts,
            "total": len(alerts),
            "unresolved": len([a for a in alerts if not a["is_resolved"]]),
            "high_severity": len([a for a in alerts if a["severity"] == "high"])
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/alerts/{alert_id}/resolve")
async def resolve_alert(alert_id: int):
    """Mark an anomaly alert as resolved"""
    try:
        # In a real app, update database
        return {
            "alert_id": alert_id,
            "status": "resolved",
            "resolved_at": datetime.now().isoformat(),
            "message": "Alert marked as resolved"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/patterns/{product_id}")
async def get_anomaly_patterns(
    product_id: int,
    pattern_type: str = Query("all", regex="^(all|theft|demand_spike|data_error)$")
):
    """Analyze anomaly patterns for a specific product"""
    try:
        # Mock pattern analysis
        patterns = {
            "product_id": product_id,
            "analysis_period": "Last 90 days",
            "patterns_detected": []
        }
        
        if pattern_type in ["all", "theft"]:
            patterns["patterns_detected"].append({
                "type": "theft",
                "frequency": "2-3 times per month",
                "typical_loss": "15-25 units",
                "time_pattern": "Usually weekends, late hours",
                "confidence": 0.78
            })
        
        if pattern_type in ["all", "demand_spike"]:
            patterns["patterns_detected"].append({
                "type": "demand_spike",
                "frequency": "Weekly",
                "trigger": "Weekend promotions",
                "magnitude": "200-300% increase",
                "confidence": 0.92
            })
        
        if pattern_type in ["all", "data_error"]:
            patterns["patterns_detected"].append({
                "type": "data_error",
                "frequency": "Rare",
                "description": "Occasional negative inventory reports",
                "suggested_action": "Validate data entry processes",
                "confidence": 0.65
            })
        
        return patterns
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def generate_mock_sales_data_with_anomalies(product_id: int, days_back: int) -> List[dict]:
    """Generate mock sales data with intentional anomalies for demo"""
    import random
    
    sales_data = []
    base_demand = 15 + (product_id % 8)
    
    for i in range(days_back):
        date = datetime.now() - timedelta(days=days_back - i)
        
        # Normal pattern
        weekday_factor = 1.3 if date.weekday() < 5 else 0.7
        random_factor = random.uniform(0.8, 1.2)
        
        quantity = base_demand * weekday_factor * random_factor
        
        # Inject anomalies
        if i % 15 == 0:  # Theft simulation - sudden drop
            quantity *= 0.3
        elif i % 20 == 0:  # Demand spike
            quantity *= 2.5
        elif i % 25 == 0:  # Data error - unrealistic high value
            quantity *= 5
        
        quantity = max(0, int(quantity))
        revenue = quantity * (12.99 + (product_id % 4))
        
        sales_data.append({
            "date": date.isoformat(),
            "quantity_sold": quantity,
            "revenue": round(revenue, 2),
            "store_id": f"store_{(i % 3) + 1}"
        })
    
    return sales_data
