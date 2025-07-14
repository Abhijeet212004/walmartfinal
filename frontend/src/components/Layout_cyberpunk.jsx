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
  Zap,
  Activity,
  Rocket,
  Star,
  Shield
} from 'lucide-react';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home, gradient: 'from-blue-500 to-cyan-500' },
    { name: 'Computer Vision', href: '/vision', icon: Camera, gradient: 'from-cyan-500 to-blue-500' },
    { name: 'Demand Forecasting', href: '/forecast', icon: TrendingUp, gradient: 'from-green-500 to-emerald-500' },
    { name: 'Anomaly Detection', href: '/anomaly', icon: AlertTriangle, gradient: 'from-red-500 to-pink-500' },
    { name: 'Inventory Management', href: '/inventory', icon: Package, gradient: 'from-purple-500 to-indigo-500' },
  ];

  const isCurrentPath = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm"></div>
        </div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-80 transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        
        {/* Sidebar Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>
        
        {/* Animated Background Patterns */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
          <div className="absolute top-20 right-0 w-32 h-32 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-10 w-32 h-32 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="relative z-10 h-full flex flex-col">
          {/* Sidebar header */}
          <div className="relative h-24 px-6 flex items-center justify-between border-b border-gray-700/50">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="bg-gradient-to-r from-walmart-blue to-blue-600 p-3 rounded-2xl">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 bg-gradient-to-r from-walmart-yellow to-orange-400 p-1 rounded-full">
                  <Sparkles className="h-3 w-3 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-black text-white">Walmart IQ</h1>
                <p className="text-xs text-gray-400 font-medium">AI-Powered Intelligence</p>
              </div>
            </div>
            <button
              className="lg:hidden text-gray-400 hover:text-white transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* AI Status Banner */}
          <div className="mx-6 mt-6 mb-4">
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl blur opacity-75"></div>
              <div className="relative bg-gray-900 rounded-xl p-4 border border-green-500/20">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 rounded-lg">
                    <Zap className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white">AI Engine Status</p>
                    <p className="text-xs text-green-400">Online & Processing</p>
                  </div>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse animation-delay-200"></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse animation-delay-400"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-6">
            <div className="space-y-3">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = isCurrentPath(item.href);
                return (
                  <div key={item.name} className="relative group">
                    {isActive && (
                      <div className={`absolute -inset-0.5 bg-gradient-to-r ${item.gradient} rounded-xl blur opacity-75 animate-tilt`}></div>
                    )}
                    <Link
                      to={item.href}
                      className={`relative flex items-center px-4 py-4 text-sm font-bold rounded-xl transition-all duration-300 ${
                        isActive
                          ? 'bg-gray-900 text-white border border-gray-700/50'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <div className={`flex items-center justify-center w-10 h-10 rounded-xl mr-4 transition-all duration-300 ${
                        isActive 
                          ? `bg-gradient-to-r ${item.gradient}` 
                          : 'bg-gray-800 group-hover:bg-gray-700'
                      }`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <span className="block">{item.name}</span>
                        {isActive && (
                          <span className="text-xs text-gray-400 mt-1 block">Currently Active</span>
                        )}
                      </div>
                      
                      {isActive && (
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 text-walmart-yellow" />
                          <div className="w-2 h-2 bg-walmart-yellow rounded-full animate-pulse"></div>
                        </div>
                      )}
                    </Link>
                  </div>
                );
              })}
            </div>
          </nav>

          {/* Performance Stats */}
          <div className="mx-6 mb-6">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
              <h3 className="text-sm font-bold text-white mb-3">Live Performance</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">System Load</span>
                    <span className="text-green-400 font-medium">23%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-1000" style={{ width: '23%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">AI Processing</span>
                    <span className="text-blue-400 font-medium">87%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-1000" style={{ width: '87%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mx-6 mb-6">
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-walmart-yellow to-orange-500 rounded-xl blur opacity-50"></div>
              <div className="relative bg-gray-900 rounded-xl p-4 border border-orange-500/20">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-r from-walmart-blue to-blue-600 p-2 rounded-lg">
                    <ShoppingCart className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white">Walmart Hackathon</p>
                    <p className="text-xs text-gray-400">2025 AI Challenge</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Rocket className="h-4 w-4 text-walmart-yellow" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-80">
        {/* Top bar */}
        <div className="sticky top-0 z-30 h-16 bg-black/50 backdrop-blur-xl border-b border-gray-700/50">
          <div className="flex items-center justify-between h-full px-6">
            <button
              className="lg:hidden text-gray-400 hover:text-white transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            
            <div className="flex items-center ml-auto space-x-6">
              {/* Status Indicators */}
              <div className="hidden md:flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-full">
                  <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-xs font-bold">ONLINE</span>
                </div>
                
                <div className="flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-full">
                  <Activity className="h-3 w-3 text-blue-400" />
                  <span className="text-blue-400 text-xs font-bold">REAL-TIME</span>
                </div>
                
                <div className="flex items-center space-x-2 bg-purple-500/10 border border-purple-500/20 px-3 py-1.5 rounded-full">
                  <Shield className="h-3 w-3 text-purple-400" />
                  <span className="text-purple-400 text-xs font-bold">SECURE</span>
                </div>
              </div>
              
              {/* User Profile */}
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-walmart-blue to-blue-600 rounded-xl blur opacity-75"></div>
                <div className="relative bg-gray-900 rounded-xl px-4 py-2 border border-blue-500/20">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-r from-walmart-blue to-blue-600 p-2 rounded-lg">
                      <Brain className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">AI Admin</p>
                      <p className="text-xs text-blue-400">Super User</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
