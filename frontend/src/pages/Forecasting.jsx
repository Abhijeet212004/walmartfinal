import React from 'react';
import { TrendingUp, BarChart3, Brain, Target } from 'lucide-react';

const Forecasting = () => {
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
                <TrendingUp className="h-4 w-4 mr-2" />
                Facebook Prophet AI
                <TrendingUp className="h-4 w-4 ml-2" />
              </div>
              <h1 className="text-5xl font-black text-white mb-4 bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
                DEMAND FORECASTING
              </h1>
              <p className="text-xl text-cyan-200 font-semibold">
                Advanced AI-Powered Demand Prediction & Inventory Planning
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 pb-12">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Main Forecasting Module */}
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl blur opacity-75"></div>
            <div className="relative bg-gray-900 rounded-2xl p-8 border border-cyan-500/20">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-3 rounded-xl">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Forecasting Module</h2>
              </div>

              <div className="text-center py-12">
                <TrendingUp className="mx-auto h-16 w-16 text-cyan-400 mb-6" />
                <h3 className="text-xl font-semibold text-white mb-4">Interactive Forecasting Dashboard</h3>
                <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                  This advanced module will contain interactive forecasting charts and prediction tools powered by Facebook Prophet machine learning models.
                </p>
                
                {/* Feature Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                    <Brain className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-blue-400">Prophet Models</p>
                  </div>
                  <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                    <Target className="h-8 w-8 text-green-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-green-400">7-Day Predictions</p>
                  </div>
                  <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
                    <BarChart3 className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-purple-400">Confidence Intervals</p>
                  </div>
                  <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-4">
                    <TrendingUp className="h-8 w-8 text-cyan-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-cyan-400">Restock Alerts</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Coming Soon Features */}
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-75"></div>
            <div className="relative bg-gray-900 rounded-2xl p-8 border border-purple-500/20">
              <h3 className="text-2xl font-bold text-white mb-6">Advanced Features Coming Soon</h3>
              <ul className="space-y-4 text-gray-300">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Real-time demand forecasting with live data integration
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Seasonal pattern recognition and holiday impact analysis
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Multi-product correlation analysis and cross-selling insights
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Automated restock recommendations with supplier integration
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forecasting;
