import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Store,
  Package,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Star,
  Users,
  Calendar,
  BarChart3,
  Settings,
  Plus,
  Eye,
  Edit,
  AlertCircle,
  Clock,
  Target,
  Award,
  Bell,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';

interface BusinessStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  averageRating: number;
  totalReviews: number;
  activeSubscriptions: number;
  pendingOrders: number;
  monthlyRevenue: number;
  growthRate: number;
  topSellingProduct: string;
  conversionRate: number;
  customerSatisfaction: number;
}

interface RecentOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: number;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  paymentStatus: 'paid' | 'pending' | 'failed';
  createdAt: string;
  deliveryAddress: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  sold: number;
  rating: number;
  image: string;
  isActive: boolean;
  category: string;
}

interface Analytics {
  salesData: Array<{ date: string; revenue: number; orders: number }>;
  topProducts: Array<{ name: string; sales: number; revenue: number }>;
  customerSegments: Array<{ segment: string; count: number; revenue: number }>;
  trafficSources: Array<{ source: string; visitors: number; conversions: number }>;
}

const EnhancedBusinessDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [business, setBusiness] = useState<any>(null);
  const [stats, setStats] = useState<BusinessStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    averageRating: 0,
    totalReviews: 0,
    activeSubscriptions: 0,
    pendingOrders: 0,
    monthlyRevenue: 0,
    growthRate: 0,
    topSellingProduct: '',
    conversionRate: 0,
    customerSatisfaction: 0
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [topProducts, setTopProducts] = useState<Product[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchDashboardData();
  }, [selectedPeriod, isAuthenticated, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Mock data for demonstration
      setStats({
        totalProducts: 45,
        totalOrders: 156,
        totalRevenue: 45600,
        averageRating: 4.6,
        totalReviews: 89,
        activeSubscriptions: 12,
        pendingOrders: 8,
        monthlyRevenue: 15600,
        growthRate: 18.5,
        topSellingProduct: 'Chicken Biryani',
        conversionRate: 3.2,
        customerSatisfaction: 92
      });

      setRecentOrders([
        {
          id: '1',
          orderNumber: 'ORD-001',
          customerName: 'Rajesh Kumar',
          customerEmail: 'rajesh@email.com',
          items: 3,
          total: 450,
          status: 'confirmed',
          paymentStatus: 'paid',
          createdAt: '2025-08-29T10:30:00Z',
          deliveryAddress: 'Sector 15, Noida'
        },
        {
          id: '2',
          orderNumber: 'ORD-002',
          customerName: 'Priya Sharma',
          customerEmail: 'priya@email.com',
          items: 2,
          total: 320,
          status: 'pending',
          paymentStatus: 'pending',
          createdAt: '2025-08-29T11:15:00Z',
          deliveryAddress: 'CP, New Delhi'
        }
      ]);

      setTopProducts([
        {
          id: '1',
          name: 'Chicken Biryani',
          price: 250,
          stock: 20,
          sold: 45,
          rating: 4.8,
          image: '/images/biryani.jpg',
          isActive: true,
          category: 'Main Course'
        },
        {
          id: '2',
          name: 'Paneer Butter Masala',
          price: 180,
          stock: 15,
          sold: 32,
          rating: 4.5,
          image: '/images/paneer.jpg',
          isActive: true,
          category: 'Main Course'
        }
      ]);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    value: string | number;
    change?: string;
    changeType?: 'positive' | 'negative' | 'neutral';
    onClick?: () => void;
    trend?: Array<number>;
  }> = ({ icon, title, value, change, changeType, onClick, trend }) => (
    <div 
      className={`bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all duration-200 ${onClick ? 'cursor-pointer transform hover:scale-105' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="text-blue-600">
          {icon}
        </div>
        {trend && (
          <div className="flex items-center space-x-1">
            {trend.map((value, index) => (
              <div
                key={index}
                className={`w-1 bg-blue-400 rounded-full ${
                  value > 50 ? 'h-6' : value > 25 ? 'h-4' : 'h-2'
                }`}
              />
            ))}
          </div>
        )}
      </div>
      
      <div>
        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mb-2">{value}</p>
        {change && (
          <p className={`text-xs flex items-center ${
            changeType === 'positive' ? 'text-green-600' : 
            changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
          }`}>
            {changeType === 'positive' ? <TrendingUp className="w-3 h-3 mr-1" /> : 
             changeType === 'negative' ? <TrendingUp className="w-3 h-3 mr-1 rotate-180" /> : null}
            {change}
          </p>
        )}
      </div>
    </div>
  );

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'preparing':
        return 'bg-orange-100 text-orange-800';
      case 'ready':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <Store className="w-6 h-6 mr-3 text-blue-600" />
                Business Dashboard
              </h1>
              <p className="text-sm text-gray-600">
                Welcome back, {user?.name}! Here's your business overview
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>
              <button
                onClick={() => navigate('/business/products/add')}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
              <button
                onClick={fetchDashboardData}
                className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'orders', label: 'Orders', icon: ShoppingBag },
              { id: 'products', label: 'Products', icon: Package },
              { id: 'customers', label: 'Customers', icon: Users },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={<DollarSign className="w-6 h-6" />}
                title="Total Revenue"
                value={`₹${stats.totalRevenue.toLocaleString()}`}
                change="+18% from last month"
                changeType="positive"
                trend={[25, 45, 35, 55, 40, 65, 50]}
              />
              <StatCard
                icon={<ShoppingBag className="w-6 h-6" />}
                title="Total Orders"
                value={stats.totalOrders}
                change="+15% from last month"
                changeType="positive"
                onClick={() => setActiveTab('orders')}
                trend={[30, 50, 40, 60, 45, 70, 55]}
              />
              <StatCard
                icon={<Package className="w-6 h-6" />}
                title="Products"
                value={stats.totalProducts}
                onClick={() => setActiveTab('products')}
                trend={[20, 30, 25, 35, 30, 40, 35]}
              />
              <StatCard
                icon={<Star className="w-6 h-6" />}
                title="Average Rating"
                value={stats.averageRating.toFixed(1)}
                change={`${stats.totalReviews} reviews`}
                trend={[40, 45, 50, 48, 52, 55, 58]}
              />
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                icon={<Target className="w-6 h-6" />}
                title="Conversion Rate"
                value={`${stats.conversionRate}%`}
                change="+0.5% this month"
                changeType="positive"
              />
              <StatCard
                icon={<Award className="w-6 h-6" />}
                title="Customer Satisfaction"
                value={`${stats.customerSatisfaction}%`}
                change="+2% improvement"
                changeType="positive"
              />
              <StatCard
                icon={<AlertCircle className="w-6 h-6" />}
                title="Pending Orders"
                value={stats.pendingOrders}
                onClick={() => navigate('/business/orders?status=pending')}
                changeType="neutral"
              />
            </div>

            {/* Charts and Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Revenue Chart */}
              <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Revenue Analytics</h2>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Filter className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {/* Placeholder for chart */}
                <div className="h-64 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 text-blue-400 mx-auto mb-2" />
                    <p className="text-gray-600">Revenue trend chart</p>
                    <p className="text-sm text-gray-500">₹{stats.monthlyRevenue.toLocaleString()} this month</p>
                  </div>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
                  <Link 
                    to="/business/orders"
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    View All
                  </Link>
                </div>
                
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="text-sm font-medium text-gray-900">#{order.orderNumber}</p>
                          <p className="text-xs text-gray-600">{order.customerName}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">₹{order.total}</p>
                          <div className="flex space-x-1 mt-1">
                            <span className={`text-xs px-2 py-1 rounded-full ${getOrderStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={`text-xs px-2 py-1 rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}>
                          {order.paymentStatus}
                        </span>
                        <p className="text-xs text-gray-500">{order.items} items</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Products and Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Top Products */}
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Top Products</h2>
                  <Link 
                    to="/business/products"
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    View All
                  </Link>
                </div>
                
                <div className="space-y-4">
                  {topProducts.map((product, index) => (
                    <div key={product.id} className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <img
                        src={product.image || '/placeholder-product.jpg'}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover bg-gray-100"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-600">₹{product.price} • Sold: {product.sold}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600">{product.rating}</span>
                        </div>
                        <p className="text-xs text-gray-500">Stock: {product.stock}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => navigate('/business/products/add')}
                    className="p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all text-left group"
                  >
                    <Plus className="w-8 h-8 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
                    <h3 className="font-medium text-gray-900">Add Product</h3>
                    <p className="text-sm text-gray-600">Create new product</p>
                  </button>

                  <button
                    onClick={() => navigate('/business/orders')}
                    className="p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all text-left group"
                  >
                    <Eye className="w-8 h-8 text-green-600 mb-2 group-hover:scale-110 transition-transform" />
                    <h3 className="font-medium text-gray-900">View Orders</h3>
                    <p className="text-sm text-gray-600">Manage orders</p>
                  </button>

                  <button
                    onClick={() => navigate('/business/inventory')}
                    className="p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all text-left group"
                  >
                    <Package className="w-8 h-8 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
                    <h3 className="font-medium text-gray-900">Inventory</h3>
                    <p className="text-sm text-gray-600">Manage stock</p>
                  </button>

                  <button
                    onClick={() => navigate('/business/settings')}
                    className="p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all text-left group"
                  >
                    <Settings className="w-8 h-8 text-gray-600 mb-2 group-hover:scale-110 transition-transform" />
                    <h3 className="font-medium text-gray-900">Settings</h3>
                    <p className="text-sm text-gray-600">Configure options</p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other tab content placeholders */}
        {activeTab !== 'overview' && (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 text-center">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Panel
            </h3>
            <p className="text-gray-500 mb-4">
              Complete {activeTab} management system will be implemented here
            </p>
            <button
              onClick={() => navigate(`/business/${activeTab}`)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Go to {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedBusinessDashboard;
