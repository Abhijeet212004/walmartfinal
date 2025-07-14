from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, Text
from sqlalchemy.sql import func
from app.database import Base, engine

class Product(Base):
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False)
    sku = Column(String(50), unique=True, nullable=False)
    price = Column(Float, nullable=False)
    current_stock = Column(Integer, default=0)
    min_stock_threshold = Column(Integer, default=10)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class SalesData(Base):
    __tablename__ = "sales_data"
    
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, nullable=False)
    date = Column(DateTime(timezone=True), nullable=False)
    quantity_sold = Column(Integer, nullable=False)
    revenue = Column(Float, nullable=False)
    store_id = Column(String(50), nullable=False)

class ShelfImage(Base):
    __tablename__ = "shelf_images"
    
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, nullable=False)
    image_path = Column(String(500), nullable=False)
    detected_count = Column(Integer, nullable=True)
    confidence_score = Column(Float, nullable=True)
    processed_at = Column(DateTime(timezone=True), server_default=func.now())

class Alert(Base):
    __tablename__ = "alerts"
    
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, nullable=False)
    alert_type = Column(String(50), nullable=False)  # 'low_stock', 'anomaly', 'forecast'
    message = Column(Text, nullable=False)
    severity = Column(String(20), default='medium')  # 'low', 'medium', 'high'
    is_resolved = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Forecast(Base):
    __tablename__ = "forecasts"
    
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, nullable=False)
    forecast_date = Column(DateTime(timezone=True), nullable=False)
    predicted_demand = Column(Float, nullable=False)
    confidence_interval_lower = Column(Float, nullable=True)
    confidence_interval_upper = Column(Float, nullable=True)
    model_version = Column(String(50), default='prophet_v1')
    created_at = Column(DateTime(timezone=True), server_default=func.now())

async def create_tables():
    """Create all database tables"""
    Base.metadata.create_all(bind=engine)
