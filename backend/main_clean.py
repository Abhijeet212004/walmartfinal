from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Create FastAPI app
app = FastAPI(
    title="Walmart IQ AI Backend",
    description="Real AI computer vision service",
    version="2.0.0"
)

# CORS configuration
origins = [
    "http://localhost:3000",
    "http://localhost:5173", 
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:5176",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174", 
    "http://127.0.0.1:5175",
    "http://127.0.0.1:5176"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Try to import computer vision router
try:
    from app.routers.computer_vision import router as cv_router
    app.include_router(cv_router, prefix="/api/computer-vision", tags=["Computer Vision"])
    print("✅ Computer Vision router loaded")
except Exception as e:
    print(f"❌ Failed to load Computer Vision router: {e}")

@app.get("/")
async def root():
    return {"message": "Walmart IQ AI Backend", "status": "running"}

@app.get("/health")
async def health():
    try:
        from app.services.computer_vision_real import cv_service
        services = cv_service.get_available_services()
        return {"status": "healthy", "ai_services": services}
    except Exception as e:
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
