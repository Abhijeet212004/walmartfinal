from typing import List, Dict, Any
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random
import json

def generate_sample_sales_data(
    num_products: int = 10,
    days_back: int = 90,
    output_file: str = None
) -> List[Dict[str, Any]]:
    """
    Generate sample sales data for demo purposes
    
    Args:
        num_products: Number of different products
        days_back: Number of days of historical data
        output_file: Optional file path to save data
    
    Returns:
        List of sales records
    """
    
    sales_data = []
    product_categories = [
        "Beverages", "Snacks", "Electronics", "Clothing", "Home & Garden",
        "Health & Beauty", "Sports", "Books", "Toys", "Automotive"
    ]
    
    for product_id in range(1, num_products + 1):
        category = product_categories[(product_id - 1) % len(product_categories)]
        base_demand = random.randint(10, 50)
        base_price = round(random.uniform(5.99, 89.99), 2)
        
        for i in range(days_back):
            date = datetime.now() - timedelta(days=days_back - i)
            
            # Add realistic patterns
            weekday_factor = 1.3 if date.weekday() < 5 else 0.8
            weekend_boost = 1.5 if date.weekday() >= 5 and category in ["Beverages", "Snacks"] else 1.0
            seasonal_factor = 1.2 if date.month in [11, 12] else 1.0  # Holiday boost
            trend_factor = 1 + (i / days_back) * 0.1  # Slight growth trend
            random_factor = random.uniform(0.7, 1.4)
            
            # Special events (random promotions)
            promotion_factor = 2.0 if random.random() < 0.05 else 1.0  # 5% chance of promotion
            
            quantity = max(
                0, 
                int(base_demand * weekday_factor * weekend_boost * seasonal_factor * 
                    trend_factor * random_factor * promotion_factor)
            )
            
            revenue = quantity * base_price * random.uniform(0.9, 1.1)  # Price variation
            
            store_id = f"store_{random.randint(1, 5)}"
            
            sales_data.append({
                "product_id": product_id,
                "product_name": f"Product {product_id}",
                "category": category,
                "date": date.isoformat(),
                "quantity_sold": quantity,
                "revenue": round(revenue, 2),
                "unit_price": base_price,
                "store_id": store_id
            })
    
    # Save to file if specified
    if output_file:
        if output_file.endswith('.json'):
            with open(output_file, 'w') as f:
                json.dump(sales_data, f, indent=2)
        elif output_file.endswith('.csv'):
            df = pd.DataFrame(sales_data)
            df.to_csv(output_file, index=False)
    
    return sales_data

def create_sample_product_catalog(num_products: int = 20) -> List[Dict[str, Any]]:
    """Create sample product catalog"""
    
    categories = [
        "Beverages", "Snacks", "Electronics", "Clothing", "Home & Garden",
        "Health & Beauty", "Sports", "Books", "Toys", "Automotive"
    ]
    
    products = []
    
    for i in range(1, num_products + 1):
        category = categories[(i - 1) % len(categories)]
        
        product = {
            "id": i,
            "name": f"Product {i} - {category.split()[0]} Item",
            "sku": f"SKU{i:04d}",
            "category": category,
            "price": round(random.uniform(5.99, 199.99), 2),
            "cost": round(random.uniform(2.99, 99.99), 2),
            "supplier": f"Supplier {((i - 1) % 5) + 1}",
            "description": f"High-quality {category.lower()} product",
            "weight": round(random.uniform(0.1, 5.0), 2),
            "dimensions": {
                "length": round(random.uniform(5, 30), 1),
                "width": round(random.uniform(5, 20), 1),
                "height": round(random.uniform(2, 15), 1)
            },
            "min_stock_threshold": random.randint(10, 30),
            "max_stock_capacity": random.randint(100, 500)
        }
        
        products.append(product)
    
    return products

def calculate_moving_average(data: List[float], window: int = 7) -> List[float]:
    """Calculate moving average of a list of values"""
    if len(data) < window:
        return data
    
    averages = []
    for i in range(len(data)):
        if i < window - 1:
            # For early values, use available data
            avg = sum(data[:i+1]) / (i + 1)
        else:
            # Calculate window average
            avg = sum(data[i-window+1:i+1]) / window
        averages.append(avg)
    
    return averages

def detect_outliers_iqr(data: List[float], multiplier: float = 1.5) -> List[bool]:
    """Detect outliers using Interquartile Range method"""
    if len(data) < 4:
        return [False] * len(data)
    
    sorted_data = sorted(data)
    q1_idx = len(sorted_data) // 4
    q3_idx = 3 * len(sorted_data) // 4
    
    q1 = sorted_data[q1_idx]
    q3 = sorted_data[q3_idx]
    iqr = q3 - q1
    
    lower_bound = q1 - multiplier * iqr
    upper_bound = q3 + multiplier * iqr
    
    return [value < lower_bound or value > upper_bound for value in data]

def format_currency(amount: float) -> str:
    """Format amount as currency"""
    return f"${amount:,.2f}"

def format_percentage(value: float, decimal_places: int = 1) -> str:
    """Format value as percentage"""
    return f"{value:.{decimal_places}f}%"

class DataValidator:
    """Utility class for data validation"""
    
    @staticmethod
    def validate_sales_data(data: Dict[str, Any]) -> List[str]:
        """Validate sales data record"""
        errors = []
        
        required_fields = ['product_id', 'date', 'quantity_sold', 'revenue']
        for field in required_fields:
            if field not in data:
                errors.append(f"Missing required field: {field}")
        
        if 'quantity_sold' in data and data['quantity_sold'] < 0:
            errors.append("Quantity sold cannot be negative")
        
        if 'revenue' in data and data['revenue'] < 0:
            errors.append("Revenue cannot be negative")
        
        if 'date' in data:
            try:
                datetime.fromisoformat(data['date'].replace('Z', '+00:00'))
            except ValueError:
                errors.append("Invalid date format")
        
        return errors
    
    @staticmethod
    def validate_product_data(data: Dict[str, Any]) -> List[str]:
        """Validate product data"""
        errors = []
        
        required_fields = ['name', 'sku', 'price']
        for field in required_fields:
            if field not in data:
                errors.append(f"Missing required field: {field}")
        
        if 'price' in data and data['price'] <= 0:
            errors.append("Price must be positive")
        
        if 'sku' in data and not data['sku'].strip():
            errors.append("SKU cannot be empty")
        
        return errors
