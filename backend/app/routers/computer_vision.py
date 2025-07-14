from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks
from fastapi.responses import JSONResponse
import shutil
import os
import uuid
from datetime import datetime
import aiofiles
from typing import List

from app.models.schemas import ImageUploadResponse, ShelfImageResponse
from app.services.computer_vision_real import cv_service

router = APIRouter()

# Create uploads directory
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/detect")
async def detect_objects_real(file: UploadFile = File(...)):
    """
    Real AI-powered object detection endpoint
    """
    try:
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Read file content
        image_content = await file.read()
        
        # Process with real computer vision
        results = await cv_service.detect_products_real(image_content, file.filename)
        
        return results
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Detection failed: {str(e)}")

@router.post("/analyze")
async def analyze_inventory_real(file: UploadFile = File(...)):
    """
    Comprehensive inventory analysis with real AI
    """
    try:
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        image_content = await file.read()
        results = await cv_service.analyze_inventory_real(image_content, file.filename)
        
        return results
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@router.get("/health")
async def health_check():
    """Check if computer vision service is ready"""
    return {"status": "ready", "ai_services": cv_service.get_available_services()}

# Create uploads directory
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload-shelf-image", response_model=ImageUploadResponse)
async def upload_shelf_image(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(..., description="Shelf image for product detection")
):
    """
    Upload and process shelf image for product detection
    
    - Accepts image files (jpg, jpeg, png)
    - Uses YOLOv8 or OpenCV for object detection
    - Returns detected product count and confidence scores
    """
    try:
        # Validate file type
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Generate unique filename
        file_extension = file.filename.split('.')[-1] if '.' in file.filename else 'jpg'
        unique_filename = f"{uuid.uuid4()}.{file_extension}"
        file_path = os.path.join(UPLOAD_DIR, unique_filename)
        
        # Save uploaded file
        async with aiofiles.open(file_path, 'wb') as f:
            content = await file.read()
            await f.write(content)
        
        # Start processing time
        start_time = datetime.now()
        
        # Process image for product detection
        detection_result = await cv_service.detect_products_in_shelf(file_path)
        
        # Calculate processing time
        processing_time = (datetime.now() - start_time).total_seconds()
        
        # Create response data
        if detection_result.get('error'):
            raise HTTPException(
                status_code=500, 
                detail=f"Detection failed: {detection_result['error']}"
            )
        
        # For demo purposes, simulate different products detected
        # In real implementation, this would come from the ML model
        detected_products = []
        total_count = detection_result.get('detected_count', 0)
        
        if total_count > 0:
            # Simulate product detection results
            products_detected = min(3, total_count)  # Max 3 different products
            
            product_names = ['Coca Cola', 'Pepsi', 'Water Bottle', 'Energy Drink', 'Juice Box']
            
            for i in range(products_detected):
                product_count = max(1, total_count // products_detected)
                if i == products_detected - 1:  # Last product gets remaining count
                    product_count = total_count - sum(p.detected_count for p in detected_products)
                
                detected_products.append(
                    ShelfImageResponse(
                        product_id=i + 1,
                        detected_count=product_count,
                        confidence_score=detection_result.get('confidence_score', 0.8),
                        message=f"Detected {product_count} units of {product_names[i % len(product_names)]}"
                    )
                )
        
        # Schedule background task to save annotated image
        background_tasks.add_task(
            cv_service.save_detection_result, 
            file_path, 
            detection_result
        )
        
        return ImageUploadResponse(
            filename=unique_filename,
            detected_products=detected_products,
            total_products_detected=total_count,
            processing_time=round(processing_time, 2)
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")

@router.get("/detection-history")
async def get_detection_history(limit: int = 10):
    """Get recent shelf image detection history"""
    try:
        # In a real app, this would query the database
        # For demo, return mock data
        history = [
            {
                "id": i,
                "filename": f"shelf_image_{i}.jpg",
                "detected_count": 5 + (i % 3),
                "confidence_score": 0.85 + (i % 10) * 0.01,
                "processed_at": datetime.now().isoformat(),
                "products_detected": ["Coca Cola", "Pepsi", "Water"]
            }
            for i in range(1, limit + 1)
        ]
        
        return {"history": history, "total": len(history)}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/supported-formats")
async def get_supported_formats():
    """Get list of supported image formats"""
    return {
        "supported_formats": ["jpg", "jpeg", "png", "bmp"],
        "max_file_size": "10MB",
        "recommended_resolution": "1024x768 or higher",
        "notes": [
            "Clear, well-lit images work best",
            "Avoid blurry or tilted images",
            "Ensure products are clearly visible"
        ]
    }

@router.delete("/cleanup-uploads")
async def cleanup_old_uploads():
    """Clean up old uploaded files (admin endpoint)"""
    try:
        cleaned_count = 0
        
        for filename in os.listdir(UPLOAD_DIR):
            file_path = os.path.join(UPLOAD_DIR, filename)
            
            # Get file age
            file_stat = os.stat(file_path)
            file_age_hours = (datetime.now().timestamp() - file_stat.st_mtime) / 3600
            
            # Delete files older than 24 hours
            if file_age_hours > 24:
                os.remove(file_path)
                cleaned_count += 1
        
        return {
            "message": f"Cleaned up {cleaned_count} old files",
            "cleaned_count": cleaned_count
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
