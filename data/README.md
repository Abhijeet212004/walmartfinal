# Walmart IQ Sample Data

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
