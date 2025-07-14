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
  Target
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
      // Simulate API calls - in real app, these would be actual API calls
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

  const StatCard = ({ title, value, icon: Icon, change, changeType, color = "blue", gradient = false }) => {
    const colorClasses = {
      blue: gradient ? "bg-gradient-to-br from-blue-500 to-blue-600" : "bg-blue-500",
      green: gradient ? "bg-gradient-to-br from-green-500 to-green-600" : "bg-green-500",
      yellow: gradient ? "bg-gradient-to-br from-yellow-500 to-orange-500" : "bg-yellow-500",
      red: gradient ? "bg-gradient-to-br from-red-500 to-red-600" : "bg-red-500",
      purple: gradient ? "bg-gradient-to-br from-purple-500 to-purple-600" : "bg-purple-500",
      indigo: gradient ? "bg-gradient-to-br from-indigo-500 to-indigo-600" : "bg-indigo-500",
      walmart: gradient ? "bg-gradient-to-br from-walmart-blue to-blue-700" : "bg-walmart-blue"
    };

    return (
      <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-gray-200 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
          <div className={`w-full h-full rounded-full ${colorClasses[color]} transform translate-x-8 -translate-y-8`}></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
              <div className="flex items-baseline">
                <p className="text-3xl font-bold text-gray-900">{value}</p>
                {change && (
                  <span className={`ml-2 text-sm font-medium ${
                    changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {changeType === 'positive' ? '+' : ''}{change}
                  </span>
                )}
              </div>
            </div>
            <div className={`${colorClasses[color]} p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const FeatureCard = ({ title, description, icon: Icon, color, href, badge }) => {
    return (
      <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-gray-200 cursor-pointer relative overflow-hidden">
        {/* Background Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className={`bg-gradient-to-br ${color} p-3 rounded-xl`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
            {badge && (
              <span className="bg-walmart-yellow text-walmart-blue text-xs font-bold px-2 py-1 rounded-full">
                {badge}
              </span>
            )}
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
            {title}
          </h3>
          <p className="text-gray-600 text-sm mb-4 leading-relaxed">
            {description}
          </p>
          
          <div className="flex items-center text-walmart-blue text-sm font-medium group-hover:text-blue-700 transition-colors">
            Explore Feature
            <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-walmart-blue border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="relative">
        <div className="bg-gradient-to-r from-walmart-blue via-blue-600 to-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-black bg-opacity-10"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white bg-opacity-10 rounded-full transform translate-x-32 -translate-y-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white bg-opacity-5 rounded-full transform -translate-x-24 translate-y-24"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">Welcome to Walmart IQ</h1>
                <p className="text-blue-100 text-lg font-medium">AI-Powered Inventory & Demand Prediction Engine</p>
                <div className="flex items-center mt-4 space-x-6">
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm">System Online</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Activity className="h-4 w-4" />
                    <span className="text-sm">Real-time Processing</span>
                  </div>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-6">
                  <Brain className="h-16 w-16 text-walmart-yellow mb-2" />
                  <p className="text-sm font-medium">AI Engine</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Products"
          value={stats.totalProducts.toLocaleString()}
          icon={Package}
          change="12%"
          changeType="positive"
          color="walmart"
          gradient={true}
        />
        <StatCard
          title="Low Stock Items"
          value={stats.lowStockItems}
          icon={AlertTriangle}
          change="3"
          changeType="negative"
          color="yellow"
          gradient={true}
        />
        <StatCard
          title="Total Value"
          value={`$${(stats.totalValue / 1000).toFixed(1)}K`}
          icon={DollarSign}
          change="8.5%"
          changeType="positive"
          color="green"
          gradient={true}
        />
        <StatCard
          title="Forecast Accuracy"
          value={`${stats.forecastAccuracy}%`}
          icon={Target}
          change="2.1%"
          changeType="positive"
          color="purple"
          gradient={true}
        />
      </div>

      {/* Feature Cards */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">AI-Powered Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            title="Computer Vision"
            description="Advanced shelf monitoring using YOLOv8 for real-time product detection and inventory tracking."
            icon={Eye}
            color="from-blue-500 to-cyan-500"
            badge="YOLOv8"
          />
          <FeatureCard
            title="Demand Forecasting"
            description="Prophet-powered time series analysis for accurate demand prediction and inventory optimization."
            icon={TrendingUp}
            color="from-green-500 to-emerald-500"
            badge="Prophet"
          />
          <FeatureCard
            title="Anomaly Detection"
            description="Isolation Forest algorithms identify unusual patterns and potential inventory issues automatically."
            icon={Zap}
            color="from-red-500 to-pink-500"
            badge="ML"
          />
        </div>
      </div>

      {/* Recent Activity & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">Live</span>
              </div>
            </div>
            
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                    activity.severity === 'high' ? 'bg-red-500' :
                    activity.severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    activity.type === 'alert' ? 'bg-red-100 text-red-800' :
                    activity.type === 'detection' ? 'bg-blue-100 text-blue-800' :
                    activity.type === 'anomaly' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {activity.type}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Detection Rate</span>
                <span className="text-sm font-semibold text-gray-900">94.2%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-walmart-blue h-2 rounded-full" style={{ width: '94.2%' }}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Forecast Accuracy</span>
                <span className="text-sm font-semibold text-gray-900">87.5%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '87.5%' }}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">System Uptime</span>
                <span className="text-sm font-semibold text-gray-900">99.9%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '99.9%' }}></div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-walmart-yellow to-orange-400 rounded-2xl p-6 text-white">
            <BarChart3 className="h-8 w-8 mb-3" />
            <h3 className="text-lg font-semibold mb-2">Weekly Insights</h3>
            <p className="text-sm opacity-90 mb-3">
              Processed 2,847 images and detected 18,392 products this week.
            </p>
            <div className="text-2xl font-bold">+23%</div>
            <p className="text-xs opacity-75">vs last week</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
    };

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
            {change && (
              <p className={`text-sm mt-1 ${
                changeType === 'positive' ? 'text-green-600' : 
                changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {change}
              </p>
            )}
          </div>
          <div className={`${colorClasses[color]} p-3 rounded-lg`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>
    );
  };

  const ActivityItem = ({ activity }) => {
    const severityColors = {
      high: 'bg-red-100 text-red-800 border-red-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-blue-100 text-blue-800 border-blue-200',
      info: 'bg-gray-100 text-gray-800 border-gray-200'
    };

    const typeIcons = {
      alert: AlertTriangle,
      detection: Camera,
      anomaly: Activity,
      forecast: TrendingUp,
      restock: Package
    };

    const Icon = typeIcons[activity.type] || Activity;

    return (
      <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
        <div className={`p-2 rounded-lg ${severityColors[activity.severity]}`}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">{activity.message}</p>
          <p className="text-xs text-gray-500">{activity.time}</p>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-walmart-blue"></div>
        <span className="ml-2 text-gray-600">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Walmart IQ Dashboard</h1>
          <p className="text-gray-600">AI-Powered Inventory & Demand Prediction System</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600">Real-time monitoring active</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Products"
          value={stats.totalProducts.toLocaleString()}
          icon={Package}
          change="+12 this week"
          changeType="positive"
          color="blue"
        />
        <StatCard
          title="Low Stock Items"
          value={stats.lowStockItems}
          icon={AlertTriangle}
          change="-3 from yesterday"
          changeType="positive"
          color="yellow"
        />
        <StatCard
          title="Critical Stock"
          value={stats.criticalStockItems}
          icon={AlertTriangle}
          change="+2 urgent"
          changeType="negative"
          color="red"
        />
        <StatCard
          title="Inventory Value"
          value={`$${stats.totalValue.toLocaleString()}`}
          icon={DollarSign}
          change="+5.2% from last month"
          changeType="positive"
          color="green"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Anomalies Detected"
          value={stats.anomaliesDetected}
          icon={Activity}
          change="Last 24 hours"
          color="purple"
        />
        <StatCard
          title="Forecast Accuracy"
          value={`${stats.forecastAccuracy}%`}
          icon={TrendingUp}
          change="7-day average"
          changeType="positive"
          color="indigo"
        />
        <StatCard
          title="Recent Detections"
          value={stats.recentDetections}
          icon={Camera}
          change="Images processed today"
          color="blue"
        />
        <StatCard
          title="System Health"
          value="Optimal"
          icon={Activity}
          change="All systems operational"
          changeType="positive"
          color="green"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <p className="text-sm text-gray-600">Latest system events and alerts</p>
          </div>
          <div className="p-6 space-y-2 max-h-96 overflow-y-auto">
            {recentActivity.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6 space-y-4">
            <button className="w-full flex items-center justify-between p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
              <div className="flex items-center">
                <Camera className="h-5 w-5 text-blue-600 mr-3" />
                <span className="font-medium text-blue-900">Upload Shelf Image</span>
              </div>
              <span className="text-blue-600">→</span>
            </button>
            
            <button className="w-full flex items-center justify-between p-3 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
              <div className="flex items-center">
                <TrendingUp className="h-5 w-5 text-green-600 mr-3" />
                <span className="font-medium text-green-900">Generate Forecast</span>
              </div>
              <span className="text-green-600">→</span>
            </button>
            
            <button className="w-full flex items-center justify-between p-3 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-purple-600 mr-3" />
                <span className="font-medium text-purple-900">Check Anomalies</span>
              </div>
              <span className="text-purple-600">→</span>
            </button>
            
            <button className="w-full flex items-center justify-between p-3 text-left bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
              <div className="flex items-center">
                <Package className="h-5 w-5 text-orange-600 mr-3" />
                <span className="font-medium text-orange-900">Manage Inventory</span>
              </div>
              <span className="text-orange-600">→</span>
            </button>
          </div>
        </div>
      </div>

      {/* System Status Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">ML Models: Online</span>
            </div>
            <div className="flex items-center">
              <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Database: Connected</span>
            </div>
            <div className="flex items-center">
              <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">API: Responsive</span>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
