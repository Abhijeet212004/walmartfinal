from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List
from datetime import datetime, timedelta

from app.models.schemas import (
    InventoryStatus,
    InventoryOverview,
    Product,
    ProductCreate
)

router = APIRouter()

@router.get("/status", response_model=InventoryOverview)
async def get_inventory_overview(
    category: Optional[str] = Query(None, description="Filter by product category"),
    low_stock_only: bool = Query(False, description="Show only low stock items")
):
    """
    Get overall inventory status and overview
    
    - Shows current stock levels for all products
    - Identifies low stock and critical stock situations
    - Calculates total inventory value
    """
    try:
        # In a real app, fetch from database
        # For demo, generate mock inventory data
        products = generate_mock_inventory_data()
        
        # Apply filters
        if category:
            products = [p for p in products if p['category'].lower() == category.lower()]
        
        if low_stock_only:
            products = [p for p in products if p['stock_status'] in ['low', 'critical']]
        
        # Calculate overview statistics
        total_products = len(products)
        healthy_stock = len([p for p in products if p['stock_status'] == 'healthy'])
        low_stock = len([p for p in products if p['stock_status'] == 'low'])
        critical_stock = len([p for p in products if p['stock_status'] == 'critical'])
        total_value = sum(p['current_stock'] * p['price'] for p in products)
        
        # Convert to InventoryStatus objects
        inventory_items = []
        for product in products:
            inventory_items.append(InventoryStatus(
                product_id=product['id'],
                product_name=product['name'],
                current_stock=product['current_stock'],
                min_threshold=product['min_threshold'],
                stock_status=product['stock_status'],
                days_until_stockout=product.get('days_until_stockout'),
                recommended_reorder_quantity=product.get('recommended_reorder_quantity')
            ))
        
        return InventoryOverview(
            total_products=total_products,
            healthy_stock=healthy_stock,
            low_stock=low_stock,
            critical_stock=critical_stock,
            total_value=round(total_value, 2),
            products=inventory_items
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/product/{product_id}", response_model=InventoryStatus)
async def get_product_inventory(product_id: int):
    """Get detailed inventory status for a specific product"""
    try:
        # Mock product data
        products = generate_mock_inventory_data()
        product = next((p for p in products if p['id'] == product_id), None)
        
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        return InventoryStatus(
            product_id=product['id'],
            product_name=product['name'],
            current_stock=product['current_stock'],
            min_threshold=product['min_threshold'],
            stock_status=product['stock_status'],
            days_until_stockout=product.get('days_until_stockout'),
            recommended_reorder_quantity=product.get('recommended_reorder_quantity')
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/update-stock/{product_id}")
async def update_stock_level(
    product_id: int,
    new_stock: int = Query(..., ge=0, description="New stock level"),
    reason: str = Query("manual_update", description="Reason for stock update")
):
    """Update stock level for a product"""
    try:
        # In a real app, update database
        return {
            "product_id": product_id,
            "previous_stock": 45,  # Mock previous value
            "new_stock": new_stock,
            "reason": reason,
            "updated_at": datetime.now().isoformat(),
            "updated_by": "admin",  # In real app, get from auth
            "message": f"Stock updated successfully from 45 to {new_stock}"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/low-stock-alerts")
async def get_low_stock_alerts(
    threshold_days: int = Query(default=7, ge=1, le=30, description="Days of stock remaining threshold")
):
    """Get alerts for products running low on stock"""
    try:
        products = generate_mock_inventory_data()
        
        # Filter products that will run out within threshold_days
        low_stock_products = [
            p for p in products 
            if p.get('days_until_stockout') and p['days_until_stockout'] <= threshold_days
        ]
        
        alerts = []
        for product in low_stock_products:
            severity = "critical" if product['days_until_stockout'] <= 2 else "high" if product['days_until_stockout'] <= 5 else "medium"
            
            alerts.append({
                "product_id": product['id'],
                "product_name": product['name'],
                "current_stock": product['current_stock'],
                "days_until_stockout": product['days_until_stockout'],
                "recommended_reorder": product.get('recommended_reorder_quantity', 0),
                "severity": severity,
                "message": f"{product['name']} will run out in {product['days_until_stockout']} days",
                "category": product['category']
            })
        
        # Sort by urgency
        alerts.sort(key=lambda x: x['days_until_stockout'])
        
        return {
            "alerts": alerts,
            "total_alerts": len(alerts),
            "critical": len([a for a in alerts if a['severity'] == 'critical']),
            "high": len([a for a in alerts if a['severity'] == 'high']),
            "medium": len([a for a in alerts if a['severity'] == 'medium'])
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/reorder-suggestions")
async def get_reorder_suggestions(
    category: Optional[str] = Query(None, description="Filter by category"),
    min_quantity: int = Query(default=10, ge=1, description="Minimum reorder quantity to include")
):
    """Get automated reorder suggestions based on forecasts and current stock"""
    try:
        products = generate_mock_inventory_data()
        
        if category:
            products = [p for p in products if p['category'].lower() == category.lower()]
        
        # Generate reorder suggestions
        suggestions = []
        for product in products:
            reorder_qty = product.get('recommended_reorder_quantity', 0)
            
            if reorder_qty >= min_quantity:
                # Calculate urgency and cost
                urgency_score = calculate_urgency_score(product)
                estimated_cost = reorder_qty * product['price']
                
                suggestions.append({
                    "product_id": product['id'],
                    "product_name": product['name'],
                    "current_stock": product['current_stock'],
                    "recommended_quantity": reorder_qty,
                    "estimated_cost": round(estimated_cost, 2),
                    "urgency_score": urgency_score,
                    "priority": get_priority_level(urgency_score),
                    "supplier": f"Supplier {(product['id'] % 3) + 1}",  # Mock supplier
                    "lead_time_days": (product['id'] % 5) + 2,  # Mock lead time
                    "category": product['category']
                })
        
        # Sort by urgency score (highest first)
        suggestions.sort(key=lambda x: x['urgency_score'], reverse=True)
        
        total_cost = sum(s['estimated_cost'] for s in suggestions)
        
        return {
            "suggestions": suggestions,
            "total_suggestions": len(suggestions),
            "total_estimated_cost": round(total_cost, 2),
            "high_priority": len([s for s in suggestions if s['priority'] == 'high']),
            "medium_priority": len([s for s in suggestions if s['priority'] == 'medium']),
            "low_priority": len([s for s in suggestions if s['priority'] == 'low'])
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/categories")
async def get_inventory_by_category():
    """Get inventory breakdown by product category"""
    try:
        products = generate_mock_inventory_data()
        
        # Group by category
        categories = {}
        for product in products:
            category = product['category']
            if category not in categories:
                categories[category] = {
                    "category": category,
                    "total_products": 0,
                    "total_stock": 0,
                    "total_value": 0,
                    "low_stock_count": 0,
                    "critical_stock_count": 0
                }
            
            cat_data = categories[category]
            cat_data["total_products"] += 1
            cat_data["total_stock"] += product['current_stock']
            cat_data["total_value"] += product['current_stock'] * product['price']
            
            if product['stock_status'] == 'low':
                cat_data["low_stock_count"] += 1
            elif product['stock_status'] == 'critical':
                cat_data["critical_stock_count"] += 1
        
        # Round values
        for cat_data in categories.values():
            cat_data["total_value"] = round(cat_data["total_value"], 2)
        
        return {
            "categories": list(categories.values()),
            "total_categories": len(categories)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def generate_mock_inventory_data() -> List[dict]:
    """Generate mock inventory data for demo"""
    import random
    
    products = []
    categories = ["Beverages", "Snacks", "Electronics", "Clothing", "Home & Garden"]
    
    for i in range(1, 21):  # 20 products
        category = categories[(i - 1) % len(categories)]
        base_stock = random.randint(10, 100)
        min_threshold = random.randint(5, 20)
        price = round(random.uniform(5.99, 49.99), 2)
        
        # Determine stock status
        if base_stock <= min_threshold * 0.5:
            stock_status = "critical"
            days_until_stockout = random.randint(1, 3)
        elif base_stock <= min_threshold:
            stock_status = "low"
            days_until_stockout = random.randint(3, 7)
        else:
            stock_status = "healthy"
            days_until_stockout = random.randint(10, 30)
        
        # Calculate recommended reorder quantity
        if stock_status in ["low", "critical"]:
            recommended_reorder = random.randint(30, 100)
        else:
            recommended_reorder = 0
        
        products.append({
            "id": i,
            "name": f"Product {i} - {category.split()[0]}",
            "category": category,
            "current_stock": base_stock,
            "min_threshold": min_threshold,
            "price": price,
            "stock_status": stock_status,
            "days_until_stockout": days_until_stockout,
            "recommended_reorder_quantity": recommended_reorder
        })
    
    return products

def calculate_urgency_score(product: dict) -> float:
    """Calculate urgency score for reordering (0-1, higher = more urgent)"""
    days_until_stockout = product.get('days_until_stockout', 30)
    current_stock = product['current_stock']
    min_threshold = product['min_threshold']
    
    # Base urgency on days until stockout
    urgency = max(0, 1 - (days_until_stockout / 30))
    
    # Adjust based on stock level vs threshold
    stock_ratio = current_stock / max(1, min_threshold)
    if stock_ratio < 0.5:
        urgency += 0.3
    elif stock_ratio < 1:
        urgency += 0.1
    
    return min(1.0, urgency)

def get_priority_level(urgency_score: float) -> str:
    """Convert urgency score to priority level"""
    if urgency_score >= 0.8:
        return "high"
    elif urgency_score >= 0.5:
        return "medium"
    else:
        return "low"
