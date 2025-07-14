import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Computer Vision API
export const visionAPI = {
  uploadShelfImage: async (file, onProgress) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return api.post('/vision/upload-shelf-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });
  },
  
  getDetectionHistory: async (limit = 10) => {
    return api.get(`/vision/detection-history?limit=${limit}`);
  },
  
  getSupportedFormats: async () => {
    return api.get('/vision/supported-formats');
  },
  
  cleanupUploads: async () => {
    return api.delete('/vision/cleanup-uploads');
  },
};

// Forecasting API
export const forecastAPI = {
  generateForecast: async (productId, daysAhead = 7) => {
    return api.post('/forecast/generate', {
      product_id: productId,
      days_ahead: daysAhead,
    });
  },
  
  getProductForecast: async (productId, daysAhead = 7) => {
    return api.get(`/forecast/product/${productId}?days_ahead=${daysAhead}`);
  },
  
  getMultipleForecasts: async (productIds, daysAhead = 7) => {
    const productIdsStr = Array.isArray(productIds) ? productIds.join(',') : productIds;
    return api.get(`/forecast/multiple-products?product_ids=${productIdsStr}&days_ahead=${daysAhead}`);
  },
  
  getRestockRecommendations: async (productId, currentStock, safetyStockDays = 3) => {
    return api.get(`/forecast/restock-recommendations/${productId}?current_stock=${currentStock}&safety_stock_days=${safetyStockDays}`);
  },
  
  getForecastAccuracy: async (productId) => {
    return api.get(`/forecast/accuracy-metrics/${productId}`);
  },
};

// Anomaly Detection API
export const anomalyAPI = {
  detectAnomalies: async (productId, daysToAnalyze = 30) => {
    return api.post('/anomaly/detect', {
      product_id: productId,
      days_to_analyze: daysToAnalyze,
    });
  },
  
  getProductAnomalies: async (productId, daysToAnalyze = 30) => {
    return api.get(`/anomaly/product/${productId}?days_to_analyze=${daysToAnalyze}`);
  },
  
  getAnomalyAlerts: async (severity, limit = 20) => {
    const params = new URLSearchParams();
    if (severity) params.append('severity', severity);
    params.append('limit', limit);
    
    return api.get(`/anomaly/alerts?${params.toString()}`);
  },
  
  resolveAlert: async (alertId) => {
    return api.post(`/anomaly/alerts/${alertId}/resolve`);
  },
  
  getAnomalyPatterns: async (productId, patternType = 'all') => {
    return api.get(`/anomaly/patterns/${productId}?pattern_type=${patternType}`);
  },
};

// Inventory API
export const inventoryAPI = {
  getInventoryOverview: async (category, lowStockOnly = false) => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (lowStockOnly) params.append('low_stock_only', 'true');
    
    return api.get(`/inventory/status?${params.toString()}`);
  },
  
  getProductInventory: async (productId) => {
    return api.get(`/inventory/product/${productId}`);
  },
  
  updateStockLevel: async (productId, newStock, reason = 'manual_update') => {
    return api.post(`/inventory/update-stock/${productId}?new_stock=${newStock}&reason=${reason}`);
  },
  
  getLowStockAlerts: async (thresholdDays = 7) => {
    return api.get(`/inventory/low-stock-alerts?threshold_days=${thresholdDays}`);
  },
  
  getReorderSuggestions: async (category, minQuantity = 10) => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    params.append('min_quantity', minQuantity);
    
    return api.get(`/inventory/reorder-suggestions?${params.toString()}`);
  },
  
  getInventoryByCategory: async () => {
    return api.get('/inventory/categories');
  },
};

// Health check
export const healthAPI = {
  checkHealth: async () => {
    return axios.get('http://localhost:8000/health');
  },
};

// Utility functions
export const handleAPIError = (error) => {
  if (error.response) {
    // Server responded with error status
    return {
      message: error.response.data.detail || 'Server error occurred',
      status: error.response.status,
      data: error.response.data,
    };
  } else if (error.request) {
    // Network error
    return {
      message: 'Network error - please check your connection',
      status: 0,
      data: null,
    };
  } else {
    // Other error
    return {
      message: error.message || 'An unexpected error occurred',
      status: -1,
      data: null,
    };
  }
};

export const formatApiResponse = (response) => {
  return {
    data: response.data,
    status: response.status,
    headers: response.headers,
  };
};

export default api;
