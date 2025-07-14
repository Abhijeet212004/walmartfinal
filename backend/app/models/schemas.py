from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List
from enum import Enum

class AlertType(str, Enum):
    LOW_STOCK = "low_stock"
    ANOMALY = "anomaly"
    FORECAST = "forecast"

class Severity(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"

# Product schemas
class ProductBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    category: str = Field(..., min_length=1, max_length=100)
    sku: str = Field(..., min_length=1, max_length=50)
    price: float = Field(..., gt=0)
    current_stock: int = Field(default=0, ge=0)
    min_stock_threshold: int = Field(default=10, ge=0)

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Computer Vision schemas
class ShelfImageResponse(BaseModel):
    product_id: int
    detected_count: int
    confidence_score: float = Field(..., ge=0, le=1)
    message: str

class ImageUploadResponse(BaseModel):
    filename: str
    detected_products: List[ShelfImageResponse]
    total_products_detected: int
    processing_time: float

# Forecasting schemas
class ForecastRequest(BaseModel):
    product_id: int
    days_ahead: int = Field(default=7, ge=1, le=30)

class ForecastPoint(BaseModel):
    date: datetime
    predicted_demand: float
    confidence_interval_lower: Optional[float] = None
    confidence_interval_upper: Optional[float] = None

class ForecastResponse(BaseModel):
    product_id: int
    product_name: str
    model_version: str
    forecast_points: List[ForecastPoint]
    total_predicted_demand: float
    confidence_score: float

# Alert schemas
class AlertCreate(BaseModel):
    product_id: int
    alert_type: AlertType
    message: str
    severity: Severity = Severity.MEDIUM

class Alert(BaseModel):
    id: int
    product_id: int
    alert_type: AlertType
    message: str
    severity: Severity
    is_resolved: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# Anomaly Detection schemas
class AnomalyDetectionRequest(BaseModel):
    product_id: Optional[int] = None
    days_to_analyze: int = Field(default=30, ge=7, le=90)

class AnomalyPoint(BaseModel):
    date: datetime
    value: float
    is_anomaly: bool
    anomaly_score: float

class AnomalyDetectionResponse(BaseModel):
    product_id: int
    product_name: str
    anomalies_detected: int
    anomaly_points: List[AnomalyPoint]
    analysis_period: str

# Inventory schemas
class InventoryStatus(BaseModel):
    product_id: int
    product_name: str
    current_stock: int
    min_threshold: int
    stock_status: str  # 'healthy', 'low', 'critical'
    days_until_stockout: Optional[int] = None
    recommended_reorder_quantity: Optional[int] = None

class InventoryOverview(BaseModel):
    total_products: int
    healthy_stock: int
    low_stock: int
    critical_stock: int
    total_value: float
    products: List[InventoryStatus]

# Sales data schema
class SalesDataPoint(BaseModel):
    date: datetime
    quantity_sold: int
    revenue: float
    store_id: str

class HealthCheck(BaseModel):
    status: str
    message: str
    timestamp: datetime = Field(default_factory=datetime.now)
