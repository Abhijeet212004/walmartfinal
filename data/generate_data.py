#!/usr/bin/env python3
"""
Generate sample data for Walmart IQ demo
"""

import csv
import json
import random
from datetime import datetime, timedelta
from pathlib import Path

def generate_sales_data(num_products=10, days_back=90):
    """Generate sample sales data"""
    categories = ["Beverages", "Snacks", "Electronics", "Clothing", "Home & Garden"]
    
    sales_data = []
    
    for product_id in range(1, num_products + 1):
        category = categories[(product_id - 1) % len(categories)]
        base_demand = random.randint(15, 45)
        base_price = round(random.uniform(8.99, 79.99), 2)
        
        for i in range(days_back):
            date = datetime.now() - timedelta(days=days_back - i)
            
            # Add realistic patterns
            weekday_factor = 1.3 if date.weekday() < 5 else 0.8
            weekend_boost = 1.4 if date.weekday() >= 5 and category in ["Beverages", "Snacks"] else 1.0
            seasonal_factor = 1.2 if date.month in [11, 12] else 1.0
            trend_factor = 1 + (i / days_back) * 0.1
            random_factor = random.uniform(0.7, 1.4)
            
            # Special events
            promotion_factor = 2.0 if random.random() < 0.05 else 1.0
            
            quantity = max(0, int(base_demand * weekday_factor * weekend_boost * 
                                  seasonal_factor * trend_factor * random_factor * promotion_factor))
            
            revenue = quantity * base_price * random.uniform(0.9, 1.1)
            
            sales_data.append({
                "product_id": product_id,
                "product_name": f"Product {product_id}",
                "category": category,
                "date": date.isoformat(),
                "quantity_sold": quantity,
                "revenue": round(revenue, 2),
                "unit_price": base_price,
                "store_id": f"store_{random.randint(1, 5)}"
            })
    
    return sales_data

def generate_product_catalog(num_products=20):
    """Generate product catalog"""
    categories = ["Beverages", "Snacks", "Electronics", "Clothing", "Home & Garden"]
    
    products = []
    
    for i in range(1, num_products + 1):
        category = categories[(i - 1) % len(categories)]
        
        product = {
            "id": i,
            "name": f"Product {i} - {category.split()[0]} Item",
            "sku": f"SKU{i:04d}",
            "category": category,
            "price": round(random.uniform(8.99, 199.99), 2),
            "cost": round(random.uniform(4.99, 99.99), 2),
            "supplier": f"Supplier {((i - 1) % 5) + 1}",
            "description": f"High-quality {category.lower()} product",
            "weight": round(random.uniform(0.1, 5.0), 2),
            "dimensions": {
                "length": round(random.uniform(5, 30), 1),
                "width": round(random.uniform(5, 20), 1),
                "height": round(random.uniform(2, 15), 1)
            },
            "min_stock_threshold": random.randint(10, 30),
            "max_stock_capacity": random.randint(100, 500),
            "current_stock": random.randint(5, 200)
        }
        
        products.append(product)
    
    return products

def create_sample_images_info():
    """Create info about sample shelf images"""
    images_info = [
        {
            "filename": "shelf_beverages_01.jpg",
            "description": "Beverage shelf with Coca Cola, Pepsi, and water bottles",
            "expected_products": ["Coca Cola", "Pepsi", "Water Bottle"],
            "expected_count": 24,
            "download_url": "https://example.com/shelf_beverages_01.jpg"
        },
        {
            "filename": "shelf_snacks_01.jpg", 
            "description": "Snack shelf with chips, cookies, and candy",
            "expected_products": ["Chips", "Cookies", "Candy"],
            "expected_count": 18,
            "download_url": "https://example.com/shelf_snacks_01.jpg"
        },
        {
            "filename": "shelf_mixed_01.jpg",
            "description": "Mixed shelf with various products",
            "expected_products": ["Energy Drink", "Juice", "Protein Bar"],
            "expected_count": 15,
            "download_url": "https://example.com/shelf_mixed_01.jpg"
        }
    ]
    
    return images_info

def main():
    # Create data directory
    data_dir = Path("../data")
    data_dir.mkdir(exist_ok=True)
    
    print("Generating sample data for Walmart IQ...")
    
    # Generate sales data
    print("📊 Generating sales data...")
    sales_data = generate_sales_data(num_products=15, days_back=90)
    
    with open(data_dir / "sales_data.csv", "w", newline="") as f:
        fieldnames = ["product_id", "product_name", "category", "date", 
                     "quantity_sold", "revenue", "unit_price", "store_id"]
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(sales_data)
    
    with open(data_dir / "sales_data.json", "w") as f:
        json.dump(sales_data, f, indent=2)
    
    print(f"   ✅ Generated {len(sales_data)} sales records")
    
    # Generate product catalog
    print("📦 Generating product catalog...")
    products = generate_product_catalog(num_products=20)
    
    with open(data_dir / "products.json", "w") as f:
        json.dump(products, f, indent=2)
    
    print(f"   ✅ Generated {len(products)} products")
    
    # Generate sample images info
    print("📷 Creating sample images info...")
    images_info = create_sample_images_info()
    
    with open(data_dir / "sample_images.json", "w") as f:
        json.dump(images_info, f, indent=2)
    
    print(f"   ✅ Created info for {len(images_info)} sample images")
    
    # Create README
    readme_content = """# Walmart IQ Sample Data

This directory contains generated sample data for the Walmart IQ demo.

## Files

- `sales_data.csv` / `sales_data.json` - 90 days of sales data for 15 products
- `products.json` - Product catalog with 20 products across 5 categories
- `sample_images.json` - Information about sample shelf images for testing

## Data Schema

### Sales Data
- product_id: Integer ID of the product
- product_name: Display name of the product
- category: Product category (Beverages, Snacks, etc.)
- date: Sale date in ISO format
- quantity_sold: Number of units sold
- revenue: Total revenue from sales
- unit_price: Price per unit
- store_id: Store identifier

### Products
- id: Unique product identifier
- name: Product display name
- sku: Stock keeping unit
- category: Product category
- price: Retail price
- cost: Cost price
- supplier: Supplier name
- current_stock: Current inventory level
- min_stock_threshold: Minimum stock before reorder alert

## Usage

This data is automatically loaded by the backend services for demo purposes.
In a production environment, this would be replaced with real data from 
Walmart's systems.
"""
    
    with open(data_dir / "README.md", "w") as f:
        f.write(readme_content)
    
    print("\n🎉 Sample data generation complete!")
    print(f"📁 Data saved to: {data_dir.absolute()}")
    print("\nNext steps:")
    print("1. Start the backend server: cd backend && python main.py")
    print("2. Start the frontend: cd frontend && npm run dev")
    print("3. Visit http://localhost:3000 to see the dashboard")

if __name__ == "__main__":
    main()
