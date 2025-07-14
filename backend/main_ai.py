from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Create FastAPI app
app = FastAPI(
    title="Walmart IQ - AI Services",
    description="Real AI-powered inventory management with computer vision",
    version="2.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import and include routers
try:
    from app.routers.computer_vision import router as cv_router
    app.include_router(cv_router, prefix="/api/computer-vision", tags=["computer-vision"])
    print("✅ Computer Vision API loaded")
except Exception as e:
    print(f"❌ Failed to load Computer Vision API: {e}")

try:
    from app.routers.forecasting import router as forecasting_router
    app.include_router(forecasting_router, prefix="/api/forecasting", tags=["forecasting"])
    print("✅ Forecasting API loaded")
except Exception as e:
    print(f"⚠️  Forecasting API not available: {e}")

try:
    from app.routers.anomaly_detection import router as anomaly_router
    app.include_router(anomaly_router, prefix="/api/anomaly-detection", tags=["anomaly-detection"])
    print("✅ Anomaly Detection API loaded")
except Exception as e:
    print(f"⚠️  Anomaly Detection API not available: {e}")

try:
    from app.routers.inventory import router as inventory_router
    app.include_router(inventory_router, prefix="/api/inventory", tags=["inventory"])
    print("✅ Inventory API loaded")
except Exception as e:
    print(f"⚠️  Inventory API not available: {e}")

@app.get("/")
async def root():
    """API Status"""
    return {
        "message": "Walmart IQ - AI Services API",
        "version": "2.0.0",
        "status": "running",
        "features": [
            "Real AI Computer Vision",
            "Google Vision API Integration", 
            "OpenAI Vision API Integration",
            "YOLOv8 Local Model",
            "Advanced OpenCV Analysis"
        ]
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        from app.services.computer_vision_real import cv_service
        ai_services = cv_service.get_available_services()
    except Exception as e:
        ai_services = {"error": str(e)}
    
    return {
        "status": "healthy",
        "ai_services": ai_services,
        "apis_loaded": [
            "computer-vision" if "/api/computer-vision" in [route.path for route in app.routes] else None,
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
