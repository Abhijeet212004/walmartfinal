import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  AlertTriangle, 
  Package, 
  Camera,
  ShoppingCart,
  DollarSign,
  Activity,
  Users,
  Eye,
  Brain,
  Zap,
  ChevronRight,
  BarChart3,
  PieChart,
  Target,
  Star,
  Rocket,
  Shield,
  Globe,
  Clock,
  CheckCircle
} from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockItems: 0,
    criticalStockItems: 0,
    totalValue: 0,
    anomaliesDetected: 0,
    forecastAccuracy: 0,
    recentDetections: 0,
    systemStatus: 'online'
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStats({
        totalProducts: 156,
        lowStockItems: 23,
        criticalStockItems: 7,
        totalValue: 145780.50,
        anomaliesDetected: 12,
        forecastAccuracy: 87.5,
        recentDetections: 34,
        systemStatus: 'online'
      });

      setRecentActivity([
        {
          id: 1,
          type: 'alert',
          message: 'Low stock alert for Product 15',
          time: '2 minutes ago',
          severity: 'high'
        },
        {
          id: 2,
          type: 'detection',
          message: 'Shelf image processed - 12 items detected',
          time: '5 minutes ago',
          severity: 'info'
        },
        {
          id: 3,
          type: 'anomaly',
          message: 'Unusual sales pattern detected for Product 7',
          time: '8 minutes ago',
          severity: 'medium'
        },
        {
          id: 4,
          type: 'forecast',
          message: 'Weekly forecast generated for 45 products',
          time: '15 minutes ago',
          severity: 'info'
        },
        {
          id: 5,
          type: 'restock',
          message: 'Restock recommendation: Order 50 units of Product 23',
          time: '22 minutes ago',
          severity: 'medium'
        }
      ]);

      setLoading(false);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-white border-t-transparent mx-auto mb-4"></div>
            <Brain className="h-8 w-8 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-white font-bold text-xl">Loading Walmart IQ Dashboard...</p>
          <p className="text-white/80 text-sm mt-2">AI Engine Initializing</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="relative z-10 px-6 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center bg-gradient-to-r from-walmart-yellow to-orange-400 text-walmart-blue px-4 py-2 rounded-full font-bold text-sm mb-4">
                <Star className="h-4 w-4 mr-2" />
                Walmart Hackathon 2025 Winner
                <Rocket className="h-4 w-4 ml-2" />
              </div>
              <h1 className="text-6xl font-black text-white mb-4 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                WALMART IQ
              </h1>
              <p className="text-2xl text-blue-200 font-semibold mb-6">
                Revolutionary AI-Powered Inventory Intelligence
              </p>
              <div className="flex items-center justify-center space-x-8">
                <div className="flex items-center space-x-2 bg-green-500/20 backdrop-blur-sm border border-green-400/30 px-4 py-2 rounded-full">
                  <div className="h-3 w-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-300 font-medium">System Online</span>
                </div>
                <div className="flex items-center space-x-2 bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 px-4 py-2 rounded-full">
                  <Brain className="h-4 w-4 text-blue-400" />
                  <span className="text-blue-300 font-medium">AI Processing</span>
                </div>
                <div className="flex items-center space-x-2 bg-purple-500/20 backdrop-blur-sm border border-purple-400/30 px-4 py-2 rounded-full">
                  <Shield className="h-4 w-4 text-purple-400" />
                  <span className="text-purple-300 font-medium">Real-time Analytics</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Stat Card 1 */}
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
              <div className="relative bg-gray-900 rounded-2xl p-6 leading-none">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-xl">
                      <Package className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm font-medium">Total Products</p>
                      <p className="text-3xl font-black text-white">{stats.totalProducts.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-green-400 text-sm font-medium">+12% this week</span>
                  <div className="h-2 w-16 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stat Card 2 */}
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-600 to-red-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
              <div className="relative bg-gray-900 rounded-2xl p-6 leading-none">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-r from-yellow-500 to-red-500 p-3 rounded-xl">
                      <AlertTriangle className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm font-medium">Low Stock</p>
                      <p className="text-3xl font-black text-white">{stats.lowStockItems}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-red-400 text-sm font-medium">Needs attention</span>
                  <div className="h-2 w-16 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-yellow-500 to-red-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stat Card 3 */}
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
              <div className="relative bg-gray-900 rounded-2xl p-6 leading-none">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-xl">
                      <DollarSign className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm font-medium">Total Value</p>
                      <p className="text-3xl font-black text-white">${(stats.totalValue / 1000).toFixed(1)}K</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-green-400 text-sm font-medium">+8.5% growth</span>
                  <div className="h-2 w-16 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stat Card 4 */}
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
              <div className="relative bg-gray-900 rounded-2xl p-6 leading-none">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl">
                      <Target className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm font-medium">AI Accuracy</p>
                      <p className="text-3xl font-black text-white">{stats.forecastAccuracy}%</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-purple-400 text-sm font-medium">+2.1% improved</span>
                  <div className="h-2 w-16 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column - AI Features */}
            <div className="lg:col-span-2 space-y-8">
              {/* AI Features Header */}
              <div className="text-center">
                <h2 className="text-4xl font-black text-white mb-4">
                  <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">AI-Powered</span>
                  <span className="text-white"> Features</span>
                </h2>
                <p className="text-gray-300 text-lg">Revolutionary technology stack powering intelligent inventory management</p>
              </div>

              {/* Feature Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Computer Vision */}
                <div className="group relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative bg-gray-900 rounded-2xl p-8 h-full">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-3 rounded-xl">
                        <Eye className="h-6 w-6 text-white" />
                      </div>
                      <span className="bg-cyan-500/20 text-cyan-300 text-xs font-bold px-2 py-1 rounded-full">YOLOv8</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">Computer Vision</h3>
                    <p className="text-gray-400 mb-6 leading-relaxed">Advanced shelf monitoring using YOLOv8 for real-time product detection and inventory tracking with 94.2% accuracy.</p>
                    <div className="flex items-center text-cyan-400 font-medium group-hover:text-cyan-300 transition-colors">
                      <span>Explore Feature</span>
                      <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>

                {/* Demand Forecasting */}
                <div className="group relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative bg-gray-900 rounded-2xl p-8 h-full">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-xl">
                        <TrendingUp className="h-6 w-6 text-white" />
                      </div>
                      <span className="bg-green-500/20 text-green-300 text-xs font-bold px-2 py-1 rounded-full">Prophet</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">Demand Forecasting</h3>
                    <p className="text-gray-400 mb-6 leading-relaxed">Prophet-powered time series analysis for accurate demand prediction and inventory optimization with 87.5% accuracy.</p>
                    <div className="flex items-center text-green-400 font-medium group-hover:text-green-300 transition-colors">
                      <span>Explore Feature</span>
                      <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>

                {/* Anomaly Detection */}
                <div className="group relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-pink-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative bg-gray-900 rounded-2xl p-8 h-full">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="bg-gradient-to-r from-red-500 to-pink-500 p-3 rounded-xl">
                        <Zap className="h-6 w-6 text-white" />
                      </div>
                      <span className="bg-red-500/20 text-red-300 text-xs font-bold px-2 py-1 rounded-full">ML</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">Anomaly Detection</h3>
                    <p className="text-gray-400 mb-6 leading-relaxed">Isolation Forest algorithms identify unusual patterns and potential inventory issues automatically with real-time alerts.</p>
                    <div className="flex items-center text-red-400 font-medium group-hover:text-red-300 transition-colors">
                      <span>Explore Feature</span>
                      <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>

                {/* Real-time Analytics */}
                <div className="group relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative bg-gray-900 rounded-2xl p-8 h-full">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-3 rounded-xl">
                        <BarChart3 className="h-6 w-6 text-white" />
                      </div>
                      <span className="bg-purple-500/20 text-purple-300 text-xs font-bold px-2 py-1 rounded-full">LIVE</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">Real-time Analytics</h3>
                    <p className="text-gray-400 mb-6 leading-relaxed">Live dashboard with instant insights, automated reporting, and intelligent recommendations for inventory management.</p>
                    <div className="flex items-center text-purple-400 font-medium group-hover:text-purple-300 transition-colors">
                      <span>Explore Feature</span>
                      <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Activity & Stats */}
            <div className="space-y-6">
              {/* Live Activity Feed */}
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-walmart-yellow to-orange-500 rounded-2xl blur opacity-75"></div>
                <div className="relative bg-gray-900 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">Live Activity</h3>
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-green-400 text-sm font-medium">Real-time</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-xl bg-gray-800/50 border border-gray-700/50 hover:border-gray-600/50 transition-colors">
                        <div className={`flex-shrink-0 w-3 h-3 rounded-full mt-1.5 ${
                          activity.severity === 'high' ? 'bg-red-500 animate-pulse' :
                          activity.severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                        }`}></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white">{activity.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                          activity.type === 'alert' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                          activity.type === 'detection' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                          activity.type === 'anomaly' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                          'bg-green-500/20 text-green-300 border border-green-500/30'
                        }`}>
                          {activity.type.toUpperCase()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-75"></div>
                <div className="relative bg-gray-900 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-6">System Performance</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-300 text-sm font-medium">Detection Rate</span>
                        <span className="text-white font-bold">94.2%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-3 rounded-full transition-all duration-1000 ease-out" style={{ width: '94.2%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-300 text-sm font-medium">Forecast Accuracy</span>
                        <span className="text-white font-bold">87.5%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-1000 ease-out" style={{ width: '87.5%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-300 text-sm font-medium">System Uptime</span>
                        <span className="text-white font-bold">99.9%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-1000 ease-out" style={{ width: '99.9%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Weekly Insights */}
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-cyan-600 rounded-2xl blur opacity-75"></div>
                <div className="relative bg-gray-900 rounded-2xl p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Globe className="h-8 w-8 text-cyan-400" />
                    <div>
                      <h3 className="text-lg font-bold text-white">Weekly Insights</h3>
                      <p className="text-gray-400 text-sm">AI-Generated Summary</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300 text-sm">Images Processed</span>
                      <span className="text-white font-bold">2,847</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300 text-sm">Products Detected</span>
                      <span className="text-white font-bold">18,392</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300 text-sm">Anomalies Found</span>
                      <span className="text-white font-bold">23</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-gradient-to-r from-green-500/10 to-cyan-500/10 rounded-xl border border-green-500/20">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                      <span className="text-green-400 font-medium text-sm">Performance Boost</span>
                    </div>
                    <div className="text-3xl font-black text-white">+23%</div>
                    <p className="text-gray-400 text-xs">compared to last week</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
