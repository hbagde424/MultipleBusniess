import React, { useState, useEffect } from 'react';
import { apiService } from '../services/enhancedApiService';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { 
  Plus, Edit, Trash2, Search, Filter, Eye, 
  Star, Clock, MapPin, Users, TrendingUp, DollarSign
} from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  totalBusinesses: number;
  totalOrders: number;
  totalRevenue: number;
  monthlyGrowth: {
    users: number;
    orders: number;
    revenue: number;
  };
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  action: () => void;
  color: string;
}

const DemoAdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [topBusinesses, setTopBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [analyticsResponse, ordersResponse, businessesResponse] = await Promise.all([
        apiService.getAnalytics(),
        apiService.getOrders(),
        apiService.getBusinesses()
      ]);

      if (analyticsResponse.success) {
        setStats({
          totalUsers: analyticsResponse.totalUsers,
          totalBusinesses: analyticsResponse.totalBusinesses,
          totalOrders: analyticsResponse.totalOrders,
          totalRevenue: analyticsResponse.totalRevenue,
          monthlyGrowth: analyticsResponse.monthlyGrowth
        });
        setTopBusinesses(analyticsResponse.topBusinesses);
      }

      if (ordersResponse.success) {
        setRecentOrders(ordersResponse.orders.slice(0, 5));
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions: QuickAction[] = [
    {
      id: 'add-business',
      title: 'Add New Business',
      description: 'Register a new restaurant or food business',
      icon: Plus,
      action: () => window.open('/crud/businesses', '_blank'),
      color: 'bg-blue-500'
    },
    {
      id: 'manage-products',
      title: 'Manage Products',
      description: 'View and edit all products across businesses',
      icon: Edit,
      action: () => window.open('/crud/products', '_blank'),
      color: 'bg-green-500'
    },
    {
      id: 'view-analytics',
      title: 'Advanced Analytics',
      description: 'Detailed business intelligence and reports',
      icon: TrendingUp,
      action: () => window.open('/advanced/analytics', '_blank'),
      color: 'bg-purple-500'
    },
    {
      id: 'admin-tools',
      title: 'Admin CRUD Tools',
      description: 'Complete admin management dashboard',
      icon: Users,
      action: () => window.open('/crud/admin', '_blank'),
      color: 'bg-orange-500'
    },
    {
      id: 'multimedia-hub',
      title: 'Multimedia Hub',
      description: 'Manage media content and voice features',
      icon: Eye,
      action: () => window.open('/multimedia/hub', '_blank'),
      color: 'bg-pink-500'
    },
    {
      id: 'social-features',
      title: 'Social Platform',
      description: 'User-generated content and community features',
      icon: Star,
      action: () => window.open('/advanced/social', '_blank'),
      color: 'bg-indigo-500'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Demo Admin Dashboard</h1>
              <p className="text-gray-600 mt-2">
                Manage your multi-business platform with comprehensive tools
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                Demo Mode
              </div>
              <Button onClick={() => window.open('/demo', '_blank')}>
                View Customer App
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.totalUsers.toLocaleString()}
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-green-600 text-sm font-medium">
                  +{stats.monthlyGrowth.users}%
                </span>
                <span className="text-gray-500 text-sm ml-2">from last month</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Businesses</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.totalBusinesses.toLocaleString()}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <MapPin className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-blue-600 text-sm">Active businesses</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.totalOrders.toLocaleString()}
                  </p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-green-600 text-sm font-medium">
                  +{stats.monthlyGrowth.orders}%
                </span>
                <span className="text-gray-500 text-sm ml-2">growth</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-3xl font-bold text-gray-900">
                    ₹{(stats.totalRevenue / 100000).toFixed(1)}L
                  </p>
                </div>
                <div className="bg-orange-100 p-3 rounded-full">
                  <DollarSign className="h-6 w-6 text-orange-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-green-600 text-sm font-medium">
                  +{stats.monthlyGrowth.revenue}%
                </span>
                <span className="text-gray-500 text-sm ml-2">from last month</span>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action) => {
              const IconComponent = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={action.action}
                  className="text-left p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start space-x-3">
                    <div className={`${action.color} p-2 rounded-lg`}>
                      <IconComponent className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{action.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Activity Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
              <Button variant="secondary" size="sm">
                View All
              </Button>
            </div>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Order #{order.id}</p>
                    <p className="text-sm text-gray-600">
                      {order.items.length} items • ₹{order.totalAmount}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === 'delivered' 
                        ? 'bg-green-100 text-green-800'
                        : order.status === 'preparing'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Businesses */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Top Performing Businesses</h2>
              <Button variant="secondary" size="sm">
                View All
              </Button>
            </div>
            <div className="space-y-4">
              {topBusinesses.map((business, index) => (
                <div key={business.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="bg-purple-100 text-purple-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{business.name}</p>
                      <p className="text-sm text-gray-600">{business.orders} orders</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">₹{business.revenue.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">revenue</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Demo Features Footer */}
        <div className="mt-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg p-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Explore All Demo Features</h3>
            <p className="text-lg mb-6 opacity-90">
              This platform includes comprehensive CRUD operations, AI features, voice commands, 
              real-time tracking, social features, and advanced analytics.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                onClick={() => window.open('/advanced/ai-recommendations', '_blank')}
                className="bg-white text-purple-600 hover:bg-gray-100"
              >
                AI Recommendations
              </Button>
              <Button 
                onClick={() => window.open('/advanced/chat', '_blank')}
                className="bg-white text-purple-600 hover:bg-gray-100"
              >
                Live Chat
              </Button>
              <Button 
                onClick={() => window.open('/advanced/tracking', '_blank')}
                className="bg-white text-purple-600 hover:bg-gray-100"
              >
                Real-time Tracking
              </Button>
              <Button 
                onClick={() => window.open('/multimedia/hub', '_blank')}
                className="bg-white text-purple-600 hover:bg-gray-100"
              >
                Voice & Media Hub
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoAdminDashboard;
