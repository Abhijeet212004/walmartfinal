from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Create FastAPI app
app = FastAPI(
    title="Walmart IQ: AI-Powered Inventory & Demand Prediction Engine",
    description="An end-to-end system for inventory management using AI/ML",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "Walmart IQ API is running"}

@app.get("/")
async def root():
    return {
        "message": "Welcome to Walmart IQ API",
        "docs": "/docs",
        "redoc": "/redoc",
        "health": "/health"
    }

# Simple demo endpoints
@app.get("/api/v1/vision/supported-formats")
async def get_supported_formats():
    return {
        "supported_formats": ["jpg", "jpeg", "png", "bmp"],
        "max_file_size": "10MB",
        "recommended_resolution": "1024x768 or higher"
    }

@app.get("/api/v1/inventory/status")
async def get_inventory_overview():
    return {
        "total_products": 156,
        "healthy_stock": 120,
        "low_stock": 23,
        "critical_stock": 7,
        "total_value": 145780.50
    }

@app.get("/api/v1/forecast/product/{product_id}")
async def get_product_forecast(product_id: int):
    return {
        "product_id": product_id,
        "product_name": f"Product {product_id}",
        "total_predicted_demand": 45.2,
        "confidence_score": 0.87,
        "forecast_points": [
            {"date": "2025-07-14", "predicted_demand": 6.5},
            {"date": "2025-07-15", "predicted_demand": 7.2},
            {"date": "2025-07-16", "predicted_demand": 5.8}
        ]
    }

@app.get("/api/v1/anomaly/alerts")
async def get_anomaly_alerts():
    return {
        "alerts": [
            {
                "id": 1,
                "product_id": 15,
                "message": "Unusual sales drop detected",
                "severity": "high",
                "created_at": "2025-07-13T23:30:00"
            }
        ],
        "total": 1
    }

if __name__ == "__main__":
    print("🚀 Starting Walmart IQ Backend...")
    print("📍 API Documentation: http://localhost:8000/docs")
    print("🔍 Health Check: http://localhost:8000/health")
    
    uvicorn.run(
        "main_simple:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
