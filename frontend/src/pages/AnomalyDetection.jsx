import React from 'react';
import { AlertTriangle, Shield, Eye, Zap } from 'lucide-react';

const AnomalyDetection = () => {
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
              <div className="inline-flex items-center bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-full font-bold text-sm mb-4">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Isolation Forest AI
                <AlertTriangle className="h-4 w-4 ml-2" />
              </div>
              <h1 className="text-5xl font-black text-white mb-4 bg-gradient-to-r from-white to-red-200 bg-clip-text text-transparent">
                ANOMALY DETECTION
              </h1>
              <p className="text-xl text-red-200 font-semibold">
                Advanced AI-Powered Theft Detection & Pattern Analysis
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 pb-12">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Main Anomaly Detection Module */}
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl blur opacity-75"></div>
            <div className="relative bg-gray-900 rounded-2xl p-8 border border-red-500/20">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-gradient-to-r from-red-500 to-orange-500 p-3 rounded-xl">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Anomaly Detection Module</h2>
              </div>

              <div className="text-center py-12">
                <AlertTriangle className="mx-auto h-16 w-16 text-red-400 mb-6" />
                <h3 className="text-xl font-semibold text-white mb-4">Intelligent Threat Detection System</h3>
                <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                  This advanced module will contain anomaly detection results and alert management powered by Isolation Forest machine learning algorithms.
                </p>
                
                {/* Feature Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                    <Zap className="h-8 w-8 text-red-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-red-400">Isolation Forest</p>
                  </div>
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4">
                    <Shield className="h-8 w-8 text-orange-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-orange-400">Theft Detection</p>
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                    <Eye className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-yellow-400">Pattern Analysis</p>
                  </div>
                  <div className="bg-pink-500/10 border border-pink-500/20 rounded-xl p-4">
                    <AlertTriangle className="h-8 w-8 text-pink-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-pink-400">Alert Management</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Coming Soon Features */}
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-75"></div>
            <div className="relative bg-gray-900 rounded-2xl p-8 border border-purple-500/20">
              <h3 className="text-2xl font-bold text-white mb-6">Advanced Security Features Coming Soon</h3>
              <ul className="space-y-4 text-gray-300">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Real-time anomaly detection with instant alerts and notifications
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Behavioral pattern analysis for identifying suspicious activities
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Automated incident reporting and case management system
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Integration with security cameras and monitoring systems
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnomalyDetection;
