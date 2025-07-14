import cv2
import numpy as np
from ultralytics import YOLO
from PIL import Image
import os
from typing import List, Tuple, Dict
import logging

logger = logging.getLogger(__name__)

class ComputerVisionService:
    def __init__(self):
        """Initialize the computer vision service with YOLOv8 model"""
        self.model = None
        self.load_model()
    
    def load_model(self):
        """Load YOLOv8 model for object detection"""
        try:
            # Use YOLOv8 nano model for faster inference
            # In production, you might want to use a custom trained model
            self.model = YOLO('yolov8n.pt')
            logger.info("YOLOv8 model loaded successfully")
        except Exception as e:
            logger.error(f"Failed to load YOLOv8 model: {e}")
            # Fallback to OpenCV-based detection
            self.model = None
    
    async def detect_products_in_shelf(self, image_path: str) -> Dict:
        """
        Detect and count products in a shelf image
        
        Args:
            image_path: Path to the shelf image
            
        Returns:
            Dictionary with detection results
        """
        try:
            if self.model:
                return await self._yolo_detection(image_path)
            else:
                return await self._opencv_detection(image_path)
        except Exception as e:
            logger.error(f"Error in product detection: {e}")
            return {
                "detected_count": 0,
                "confidence_score": 0.0,
                "error": str(e)
            }
    
    async def _yolo_detection(self, image_path: str) -> Dict:
        """Use YOLOv8 for product detection"""
        try:
            # Run inference
            results = self.model(image_path)
            
            # Process results
            detected_objects = []
            for result in results:
                boxes = result.boxes
                if boxes is not None:
                    for box in boxes:
                        confidence = float(box.conf[0])
                        class_id = int(box.cls[0])
                        class_name = self.model.names[class_id]
                        
                        # Consider objects as "products" if they're common retail items
                        if self._is_retail_product(class_name) and confidence > 0.5:
                            detected_objects.append({
                                "class": class_name,
                                "confidence": confidence,
                                "bbox": box.xyxy[0].tolist()
                            })
            
            total_count = len(detected_objects)
            avg_confidence = sum(obj["confidence"] for obj in detected_objects) / max(1, total_count)
            
            return {
                "detected_count": total_count,
                "confidence_score": round(avg_confidence, 2),
                "objects": detected_objects,
                "method": "yolo"
            }
            
        except Exception as e:
            logger.error(f"YOLO detection failed: {e}")
            return await self._opencv_detection(image_path)
    
    async def _opencv_detection(self, image_path: str) -> Dict:
        """Fallback OpenCV-based detection using contour analysis"""
        try:
            # Read image
            image = cv2.imread(image_path)
            if image is None:
                raise ValueError("Could not load image")
            
            # Convert to grayscale
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            
            # Apply Gaussian blur
            blurred = cv2.GaussianBlur(gray, (5, 5), 0)
            
            # Edge detection
            edges = cv2.Canny(blurred, 50, 150)
            
            # Find contours
            contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            
            # Filter contours by area (assuming products have certain size range)
            min_area = 1000  # Minimum area for a product
            max_area = 50000  # Maximum area for a product
            
            valid_contours = []
            for contour in contours:
                area = cv2.contourArea(contour)
                if min_area < area < max_area:
                    valid_contours.append(contour)
            
            # Estimate confidence based on contour quality
            confidence = min(0.8, len(valid_contours) * 0.1)
            
            return {
                "detected_count": len(valid_contours),
                "confidence_score": round(confidence, 2),
                "method": "opencv",
                "note": "Fallback detection method - consider training custom YOLO model"
            }
            
        except Exception as e:
            logger.error(f"OpenCV detection failed: {e}")
            return {
                "detected_count": 0,
                "confidence_score": 0.0,
                "error": str(e),
                "method": "opencv_failed"
            }
    
    def _is_retail_product(self, class_name: str) -> bool:
        """Determine if detected class represents a retail product"""
        retail_classes = {
            'bottle', 'cup', 'bowl', 'banana', 'apple', 'orange', 'carrot',
            'hot dog', 'pizza', 'donut', 'cake', 'chair', 'book', 'clock',
            'vase', 'scissors', 'teddy bear', 'hair drier', 'toothbrush',
            'wine glass', 'fork', 'knife', 'spoon'
        }
        return class_name.lower() in retail_classes
    
    async def save_detection_result(self, image_path: str, detection_result: Dict) -> str:
        """Save annotated image with detection results"""
        try:
            if not detection_result.get("objects"):
                return image_path
            
            image = cv2.imread(image_path)
            
            # Draw bounding boxes
            for obj in detection_result["objects"]:
                bbox = obj["bbox"]
                x1, y1, x2, y2 = map(int, bbox)
                
                # Draw rectangle
                cv2.rectangle(image, (x1, y1), (x2, y2), (0, 255, 0), 2)
                
                # Add label
                label = f"{obj['class']}: {obj['confidence']:.2f}"
                cv2.putText(image, label, (x1, y1 - 10), 
                           cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
            
            # Save annotated image
            output_path = image_path.replace('.', '_annotated.')
            cv2.imwrite(output_path, image)
            
            return output_path
            
        except Exception as e:
            logger.error(f"Failed to save annotated image: {e}")
            return image_path

# Singleton instance
cv_service = ComputerVisionService()
