import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Home, 
  Camera, 
  TrendingUp, 
  AlertTriangle, 
  Package,
  Brain,
  ShoppingCart,
  Sparkles,
  Zap
} from 'lucide-react';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home, color: 'text-blue-500' },
    { name: 'Computer Vision', href: '/vision', icon: Camera, color: 'text-cyan-500' },
    { name: 'Demand Forecasting', href: '/forecast', icon: TrendingUp, color: 'text-green-500' },
    { name: 'Anomaly Detection', href: '/anomaly', icon: AlertTriangle, color: 'text-orange-500' },
    { name: 'Inventory Management', href: '/inventory', icon: Package, color: 'text-purple-500' },
  ];

  const isCurrentPath = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm"></div>
        </div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 border-r border-gray-100`}>
        
        {/* Sidebar header */}
        <div className="relative h-20 px-6 bg-gradient-to-r from-walmart-blue to-blue-700 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-black bg-opacity-10"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full transform translate-x-16 -translate-y-16"></div>
          
          <div className="relative z-10 flex items-center justify-between h-full">
            <div className="flex items-center">
              <div className="relative">
                <Brain className="h-10 w-10 text-walmart-yellow" />
                <Sparkles className="h-4 w-4 text-yellow-300 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-white">Walmart IQ</h1>
                <p className="text-xs text-blue-100 font-medium">AI-Powered System</p>
              </div>
            </div>
            <button
              className="lg:hidden text-white hover:text-blue-200 transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-8 px-4">
          <div className="space-y-3">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = isCurrentPath(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 relative overflow-hidden ${
                    isActive
                      ? 'bg-gradient-to-r from-walmart-blue to-blue-600 text-white shadow-lg shadow-blue-500/25'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"></div>
                  )}
                  
                  <div className={`flex items-center justify-center w-8 h-8 rounded-lg mr-3 transition-all duration-200 ${
                    isActive 
                      ? 'bg-white/20 text-white' 
                      : `bg-gray-100 ${item.color} group-hover:bg-white group-hover:shadow-md`
                  }`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  
                  <span className="relative z-10 flex-1">{item.name}</span>
                  
                  {isActive && (
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-walmart-yellow rounded-full animate-pulse"></div>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* AI Status Card */}
        <div className="mx-4 mt-8">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-8 h-8 bg-green-500 rounded-lg">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-semibold text-green-900">AI Engine</p>
                <p className="text-xs text-green-700">Online & Processing</p>
              </div>
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-200">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 bg-walmart-blue rounded-xl">
                <ShoppingCart className="h-5 w-5 text-white" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-semibold text-gray-900">Walmart Hackathon</p>
                <p className="text-xs text-gray-600">2025 AI Challenge</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-72">
        {/* Top bar */}
        <div className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200">
          <button
            className="lg:hidden text-gray-600 hover:text-gray-900 transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex items-center ml-auto">
            <div className="flex items-center space-x-6">
              <div className="hidden md:flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-green-50 border border-green-200 px-3 py-1 rounded-full">
                  <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-green-700">System Online</span>
                </div>
                
                <div className="flex items-center space-x-2 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
                  <Activity className="h-3 w-3 text-blue-500" />
                  <span className="text-sm font-medium text-blue-700">Real-time</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 bg-gradient-to-r from-walmart-blue to-blue-600 px-4 py-2 rounded-xl text-white shadow-lg">
                <div className="flex items-center justify-center w-8 h-8 bg-white/20 rounded-lg">
                  <Brain className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold">AI Admin</p>
                  <p className="text-xs text-blue-100">Super User</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
          </div>
          <button
            className="lg:hidden text-white hover:text-gray-300"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-8">
          <div className="px-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isCurrentPath(item.href)
                      ? 'bg-walmart-blue text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center">
              <ShoppingCart className="h-5 w-5 text-walmart-blue mr-2" />
              <div>
                <p className="text-xs font-medium text-gray-900">Walmart Hackathon 2025</p>
                <p className="text-xs text-gray-600">AI-Powered Inventory System</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top bar */}
        <div className="flex items-center justify-between h-16 px-6 bg-white shadow-sm border-b border-gray-200">
          <button
            className="lg:hidden text-gray-600 hover:text-gray-900"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex items-center ml-auto">
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">System Online</span>
              </div>
              
              <div className="flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-full">
                <div className="h-6 w-6 bg-walmart-blue rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">AI</span>
                </div>
                <span className="text-sm font-medium text-gray-700">Admin</span>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
