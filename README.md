# 🧠 Walmart IQ: AI-Powered Inventory & Demand Prediction Engine

An end-to-end software-only system that mimics how Walmart could track inventory, predict demand, auto-generate restocking actions, and alert anomalies in product movement.

## 🔥 Core Features

- **Computer Vision Module**: Shelf detection simulation using YOLOv8
- **ML Demand Forecasting**: Facebook Prophet for 7-day prediction
- **Anomaly Detection**: Isolation Forest for theft/error detection
- **RESTful Backend**: FastAPI with modular architecture
- **Interactive Dashboard**: React + Tailwind + Chart.js

## 🧱 Tech Stack

| Layer | Technology |
|-------|------------|
| 📦 Backend | FastAPI + Python |
| 🤖 ML Models | YOLOv8, Prophet, IsolationForest |
| 📊 Frontend | React.js + Tailwind + Chart.js |
| 🗃️ Database | SQLite (demo) / PostgreSQL |
| 🐳 Deployment | Docker + Railway/Render |

## 🚀 Quick Start

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Docker Setup
```bash
docker-compose up --build
```

## 📁 Project Structure

```
walmart-iq/
├── backend/                 # FastAPI application
│   ├── app/
│   │   ├── models/         # ML models (YOLO, Prophet, etc.)
│   │   ├── routers/        # API routes
│   │   ├── services/       # Business logic
│   │   └── utils/          # Helper functions
│   ├── main.py             # FastAPI entry point
│   └── requirements.txt    # Python dependencies
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Dashboard pages
│   │   └── services/       # API calls
│   └── package.json        # Node dependencies
├── data/                   # Dummy data
│   ├── shelf_images/       # Simulated shelf images
│   └── sales_data.csv      # Generated sales data
├── models/                 # Trained ML models
└── docker/                 # Docker configuration
```

## 🎯 API Endpoints

- `POST /upload-shelf-image` - Process shelf image and return counts
- `GET /forecast/{product_id}` - Return 7-day demand prediction
- `GET /alerts` - Show anomaly detection results
- `GET /inventory/status` - Current stock levels

## 🧠 ML Models

1. **Shelf Detection**: YOLOv8 for counting products in images
2. **Demand Forecasting**: Prophet for time series prediction
3. **Anomaly Detection**: Isolation Forest for unusual patterns

## 📊 Demo Flow

1. Upload shelf image → detect product count
2. View forecast chart for next 7 days
3. Check alerts for low demand or suspicious activity
4. Auto-generate restocking recommendations

## 🎥 Hackathon Demo

Perfect for Walmart hackathon judges:
- ✅ Retail-relevant and Walmart-specific
- ✅ End-to-end system architecture
- ✅ Multiple AI/ML concepts
- ✅ Visual dashboard with real-time data
- ✅ Scalable for future enhancements

## 🛠️ Development

### Running Tests
```bash
# Backend tests
cd backend && python -m pytest

# Frontend tests
cd frontend && npm test
```

### Adding New Features
1. Add ML model in `backend/app/models/`
2. Create API route in `backend/app/routers/`
3. Add frontend component in `frontend/src/components/`

## 📝 License

MIT License - Built for Walmart Hackathon 2025
