<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Walmart IQ Project Instructions

This is a full-stack AI-powered inventory management system for Walmart hackathon with the following architecture:

## Project Context
- **Backend**: FastAPI with modular architecture (routers, services, models)
- **Frontend**: React + Tailwind CSS + Chart.js for dashboard
- **ML Models**: YOLOv8 for computer vision, Prophet for forecasting, Isolation Forest for anomaly detection
- **Database**: SQLite for demo, PostgreSQL-ready
- **Deployment**: Docker containerized

## Code Style Guidelines
- Use FastAPI best practices with dependency injection
- Follow REST API conventions
- Use TypeScript for React components
- Implement proper error handling and logging
- Write modular, testable code

## ML/AI Specific Instructions
- Use Ultralytics YOLOv8 for object detection
- Implement Facebook Prophet for time series forecasting
- Use scikit-learn's IsolationForest for anomaly detection
- Handle model loading efficiently with caching
- Provide confidence scores and error margins

## API Design Patterns
- Use Pydantic models for request/response validation
- Implement proper HTTP status codes
- Add rate limiting and authentication where needed
- Document all endpoints with OpenAPI/Swagger

## Frontend Patterns
- Use React hooks and functional components
- Implement responsive design with Tailwind
- Create reusable chart components
- Handle loading states and error boundaries

## Testing Strategy
- Write unit tests for ML models
- Create integration tests for API endpoints
- Implement frontend component testing
- Mock external dependencies

When generating code, prioritize:
1. Scalability and maintainability
2. Proper separation of concerns
3. Error handling and validation
4. Performance optimization
5. Clear documentation and comments
