import React, { useState, useRef } from 'react';
import { Camera, Upload, Loader, CheckCircle, AlertCircle } from 'lucide-react';

const ComputerVision = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setError(null);
      setResults(null);
    } else {
      setError('Please select a valid image file.');
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const processImageWithBackendAI = async (imageFile) => {
    const formData = new FormData();
    formData.append('file', imageFile);

    try {
      console.log('🚀 Sending image to backend AI service...');
      const response = await fetch('http://localhost:8000/api/v1/vision/detect', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Backend AI Response:', result);
        
        // Transform backend response to frontend format
        return {
          filename: imageFile.name,
          total_products_detected: result.detected_products?.length || result.total_products_detected || 0,
          processing_time: result.processing_time || 0,
          detected_products: result.detected_products?.map((product, index) => ({
            product_id: product.product_id || index + 1,
            detected_count: product.detected_count || 1,
            confidence_score: product.confidence_score || 0.5,
            message: product.message || `Detected product ${index + 1}`,
            category: product.category || 'General Merchandise',
            bbox: product.bbox
          })) || [],
          api_source: result.api_source || "Backend AI Service",
          real_ai: true,
          success: true
        };
      } else {
        const errorText = await response.text();
        console.error('❌ Backend API Error:', errorText);
        throw new Error(`Backend API Error: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Backend connection failed:', error);
      
      // Show a clear error message instead of fallback
      return {
        filename: imageFile.name,
        total_products_detected: 0,
        processing_time: 0,
        detected_products: [],
        api_source: "Error",
        real_ai: false,
        success: false,
        error: `Unable to connect to AI backend: ${error.message}. Please ensure the backend server is running on port 8000.`
      };
    }
  };

  const simulateProcessing = async () => {
    setUploading(true);
    setError(null);
    
    try {
      // Use backend AI processing
      const analysisResults = await processImageWithBackendAI(selectedFile);
      
      if (analysisResults.success) {
        setResults(analysisResults);
      } else {
        setError(analysisResults.error);
      }
    } catch (err) {
      console.error('Image processing error:', err);
      setError('Failed to process image with AI services. Please check your backend connection or try again.');
    } finally {
      setUploading(false);
    }
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setResults(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 via-blue-600/20 to-purple-600/20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="relative z-10 px-6 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2 rounded-full font-bold text-sm mb-4">
                <Camera className="h-4 w-4 mr-2" />
                Real AI Computer Vision
                <Camera className="h-4 w-4 ml-2" />
              </div>
              <h1 className="text-5xl font-black text-white mb-4 bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
                COMPUTER VISION
              </h1>
              <p className="text-xl text-cyan-200 font-semibold">
                YOLOv8 + OpenAI Vision • No Simulation • Real AI Detection
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 pb-12">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Upload Section */}
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl blur opacity-75"></div>
            <div className="relative bg-gray-900 rounded-2xl p-8 border border-cyan-500/20">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-3 rounded-xl">
                  <Upload className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Upload Product Image</h2>
                <div className="bg-green-500/20 border border-green-500/30 px-3 py-1 rounded-full">
                  <span className="text-green-400 text-sm font-bold">REAL AI</span>
                </div>
              </div>
        
        {!selectedFile && (
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              dragActive 
                ? 'border-cyan-400 bg-cyan-500/10' 
                : 'border-gray-600 hover:border-gray-500'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Camera className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium text-white mb-2">
              Drop your product image here, or click to browse
            </p>
            <p className="text-sm text-gray-400 mb-4">
              Upload ANY product image • YOLOv8 + OpenAI Vision will detect it
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 flex items-center mx-auto"
            >
              <Upload className="h-4 w-4 mr-2" />
              Select Image
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
            />
          </div>
        )}

        {selectedFile && !results && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-800 rounded-xl border border-gray-700">
              <div className="flex items-center">
                <Camera className="h-5 w-5 text-cyan-400 mr-3" />
                <div>
                  <p className="font-medium text-white">{selectedFile.name}</p>
                  <p className="text-sm text-gray-400">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={resetUpload}
                className="text-gray-400 hover:text-white transition-colors"
              >
                Remove
              </button>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={simulateProcessing}
                disabled={uploading}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center flex-1"
              >
                {uploading ? (
                  <>
                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                    AI Processing...
                  </>
                ) : (
                  'Detect with Real AI'
                )}
              </button>
              <button
                onClick={resetUpload}
                className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}
            </div>
          </div>

      {/* Results Section */}
      {results && (
        <div className="relative">
          <div className={`absolute -inset-0.5 bg-gradient-to-r ${results.total_products_detected > 0 ? 'from-green-600 to-emerald-600' : 'from-orange-600 to-red-600'} rounded-2xl blur opacity-75`}></div>
          <div className={`relative bg-gray-900 rounded-2xl p-8 border ${results.total_products_detected > 0 ? 'border-green-500/20' : 'border-orange-500/20'}`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">AI Detection Results</h2>
              <div className="flex items-center space-x-4">
                <div className="bg-green-500/20 border border-green-500/30 px-3 py-1 rounded-full">
                  <span className="text-green-400 text-sm font-bold">{results.api_source}</span>
                </div>
                <div className={`flex items-center ${results.total_products_detected > 0 ? 'text-green-400' : 'text-orange-400'}`}>
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span className="font-medium">Processing Complete</span>
                </div>
              </div>
            </div>

            {/* No Products Detected Message */}
            {results.total_products_detected === 0 && (
              <div className="text-center py-8">
                <AlertCircle className="mx-auto h-16 w-16 text-orange-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-4">No Objects Detected</h3>
                <p className="text-gray-300 mb-6">The AI couldn't detect any recognizable objects in this image.</p>
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                  <p className="text-sm text-blue-400 font-medium">Tips for better detection:</p>
                  <ul className="text-sm text-gray-300 mt-2 space-y-1">
                    <li>• Upload clear images with recognizable objects</li>
                    <li>• Ensure good lighting and focus</li>
                    <li>• Try retail products, household items, or common objects</li>
                    <li>• The AI can detect 80+ object categories</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Summary Stats - Only show if products detected */}
            {results.total_products_detected > 0 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                    <p className="text-sm font-medium text-blue-400">Total Objects</p>
                    <p className="text-2xl font-bold text-white">{results.total_products_detected}</p>
                  </div>
                  <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                    <p className="text-sm font-medium text-green-400">Processing Time</p>
                    <p className="text-2xl font-bold text-white">{results.processing_time.toFixed(1)}s</p>
                  </div>
                  <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
                    <p className="text-sm font-medium text-purple-400">Object Types</p>
                    <p className="text-2xl font-bold text-white">{results.detected_products.length}</p>
                  </div>
                </div>

                {/* Detailed Results */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Detected Objects</h3>
                  {results.detected_products.map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl hover:border-gray-600/50 transition-colors">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center mr-4">
                          <span className="text-white font-bold">{product.detected_count}</span>
                        </div>
                        <div>
                          <p className="font-medium text-white">{product.message}</p>
                          <p className="text-sm text-gray-400">Category: {product.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-white">
                          Confidence: {(product.confidence_score * 100).toFixed(1)}%
                        </p>
                        <div className="w-16 bg-gray-700 rounded-full h-2 mt-1">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${product.confidence_score * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Actions */}
            <div className="flex space-x-3 mt-6">
              <button
                onClick={resetUpload}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200"
              >
                {results.total_products_detected > 0 ? 'Detect Another Image' : 'Try Another Image'}
              </button>
              {results.total_products_detected > 0 && (
                <button className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200">
                  Export Results
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* AI Info Section */}
      <div className="relative">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-75"></div>
        <div className="relative bg-gray-900 rounded-2xl p-8 border border-blue-500/20">
          <h3 className="text-2xl font-bold text-white mb-6">Real AI Technology</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold text-cyan-400 mb-3">🎯 YOLOv8 Model</h4>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Real-time object detection with 80+ categories
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  State-of-the-art accuracy and speed
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Bounding box coordinates and confidence scores
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-green-400 mb-3">🤖 OpenAI Vision</h4>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  GPT-4 Vision API for advanced analysis
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Natural language descriptions
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Context-aware product classification
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

        </div>
      </div>
    </div>
  );
};

export default ComputerVision;
