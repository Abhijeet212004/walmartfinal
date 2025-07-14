from fastapi import FastAPI, File, UploadFile, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import uvicorn
import os
from dotenv import load_dotenv

# Import routers - with fallback if some don't exist
try:
    from app.routers import computer_vision, forecasting, anomaly_detection, inventory
    forecasting_available = True
    anomaly_available = True
    inventory_available = True
except ImportError as e:
    print(f"Warning: Could not import all routers: {e}")
    try:
        from app.routers import computer_vision
        forecasting_available = False
        anomaly_available = False
        inventory_available = False
    except ImportError as e2:
        print(f"Error: Could not import computer_vision router: {e2}")
        raise

try:
    from app.database import database, engine, metadata
    from app.models.database import create_tables
except ImportError as e:
    print(f"Warning: Database imports failed: {e}")
    # Continue without database for testing

# Load environment variables
load_dotenv()

# Create FastAPI app
app = FastAPI(
    title="Walmart IQ: AI-Powered Inventory & Demand Prediction Engine",
    description="An end-to-end system for inventory management using AI/ML",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware for frontend integration
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,  # Read from environment
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files for serving uploaded images
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Database startup/shutdown events - only if database is available
try:
    @app.on_event("startup")
    async def startup():
        await database.connect()
        await create_tables()

    @app.on_event("shutdown")
    async def shutdown():
        await database.disconnect()
except NameError:
    # Database not available, skip database events
    print("Database not available, running without database")
    pass

# Include routers
app.include_router(computer_vision.router, prefix="/api/v1/vision", tags=["Computer Vision"])
app.include_router(computer_vision.router, prefix="/api/computer-vision", tags=["Computer Vision Alt"])  # Alternative route

if forecasting_available:
    app.include_router(forecasting.router, prefix="/api/v1/forecast", tags=["Demand Forecasting"])
    
if anomaly_available:
    app.include_router(anomaly_detection.router, prefix="/api/v1/anomaly", tags=["Anomaly Detection"])
    
if inventory_available:
    app.include_router(inventory.router, prefix="/api/v1/inventory", tags=["Inventory Management"])

# Health check endpoint
@app.get("/health")
async def health_check():
    try:
        from app.services.computer_vision_real import cv_service
        ai_services = cv_service.get_available_services()
        return {
            "status": "healthy",
            "ai_services": ai_services,
            "message": "Walmart IQ API is running"
        }
    except Exception as e:
        return {
            "status": "degraded", 
            "error": str(e),
            "message": "Some services may be unavailable"
        }

@app.get("/")
async def root():
    return {
        "message": "Welcome to Walmart IQ API",
        "docs": "/docs",
        "redoc": "/redoc",
        "health": "/health"
    }

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
