import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Users,
  ShoppingBag,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Eye,
  Star,
  Clock,
  MapPin,
  Zap,
  Target,
  Award,
  Percent
} from 'lucide-react';

interface SalesData {
  date: string;
  revenue: number;
  orders: number;
  customers: number;
}

interface TopProduct {
  id: string;
  name: string;
  category: string;
  sales: number;
  revenue: number;
  image: string;
}

interface TopCustomer {
  id: string;
  name: string;
  email: string;
  totalOrders: number;
  totalSpent: number;
  avatar?: string;
}

interface AnalyticsData {
  overview: {
    totalRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    averageOrderValue: number;
    revenueGrowth: number;
    orderGrowth: number;
    customerGrowth: number;
    aovGrowth: number;
  };
  salesData: SalesData[];
  topProducts: TopProduct[];
  topCustomers: TopCustomer[];
  categoryPerformance: Array<{
    category: string;
    revenue: number;
    orders: number;
    percentage: number;
  }>;
  timeBasedAnalytics: {
    peakHours: Array<{ hour: number; orders: number }>;
    peakDays: Array<{ day: string; orders: number }>;
  };
  geographicData: Array<{
    city: string;
    orders: number;
    revenue: number;
  }>;
}

const AnalyticsReportsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7d');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchAnalyticsData();
  }, [isAuthenticated, navigate, dateRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Mock data for demonstration
      const mockData: AnalyticsData = {
        overview: {
          totalRevenue: 125600,
          totalOrders: 342,
          totalCustomers: 156,
          averageOrderValue: 367,
          revenueGrowth: 15.3,
          orderGrowth: 8.7,
          customerGrowth: 12.1,
          aovGrowth: 5.4
        },
        salesData: [
          { date: '2025-08-23', revenue: 15600, orders: 42, customers: 38 },
          { date: '2025-08-24', revenue: 18200, orders: 48, customers: 41 },
          { date: '2025-08-25', revenue: 16800, orders: 45, customers: 39 },
          { date: '2025-08-26', revenue: 19500, orders: 52, customers: 47 },
          { date: '2025-08-27', revenue: 22100, orders: 58, customers: 52 },
          { date: '2025-08-28', revenue: 17900, orders: 49, customers: 44 },
          { date: '2025-08-29', revenue: 15500, orders: 38, customers: 35 }
        ],
        topProducts: [
          {
            id: '1',
            name: 'Chicken Biryani',
            category: 'Biryani',
            sales: 89,
            revenue: 22250,
            image: '/images/biryani.jpg'
          },
          {
            id: '2',
            name: 'Paneer Butter Masala',
            category: 'North Indian',
            sales: 76,
            revenue: 13680,
            image: '/images/paneer.jpg'
          },
          {
            id: '3',
            name: 'Chicken Tikka',
            category: 'Starters',
            sales: 65,
            revenue: 11700,
            image: '/images/tikka.jpg'
          },
          {
            id: '4',
            name: 'Veg Fried Rice',
            category: 'Chinese',
            sales: 58,
            revenue: 8700,
            image: '/images/friedrice.jpg'
          },
          {
            id: '5',
            name: 'Gulab Jamun',
            category: 'Desserts',
            sales: 52,
            revenue: 5200,
            image: '/images/gulabjamun.jpg'
          }
        ],
        topCustomers: [
          {
            id: '1',
            name: 'Rajesh Kumar',
            email: 'rajesh@email.com',
            totalOrders: 24,
            totalSpent: 15600
          },
          {
            id: '2',
            name: 'Amit Patel',
            email: 'amit@email.com',
            totalOrders: 18,
            totalSpent: 12800
          },
          {
            id: '3',
            name: 'Priya Sharma',
            email: 'priya@email.com',
            totalOrders: 15,
            totalSpent: 9500
          }
        ],
        categoryPerformance: [
          { category: 'Biryani', revenue: 35600, orders: 142, percentage: 28.4 },
          { category: 'North Indian', revenue: 28900, orders: 118, percentage: 23.0 },
          { category: 'Chinese', revenue: 22100, orders: 95, percentage: 17.6 },
          { category: 'South Indian', revenue: 18400, orders: 78, percentage: 14.6 },
          { category: 'Starters', revenue: 15200, orders: 64, percentage: 12.1 },
          { category: 'Desserts', revenue: 5400, orders: 32, percentage: 4.3 }
        ],
        timeBasedAnalytics: {
          peakHours: [
            { hour: 12, orders: 45 },
            { hour: 13, orders: 52 },
            { hour: 19, orders: 38 },
            { hour: 20, orders: 42 },
            { hour: 21, orders: 35 }
          ],
          peakDays: [
            { day: 'Sunday', orders: 68 },
            { day: 'Saturday', orders: 65 },
            { day: 'Friday', orders: 58 },
            { day: 'Monday', orders: 45 },
            { day: 'Tuesday', orders: 42 },
            { day: 'Wednesday', orders: 38 },
            { day: 'Thursday', orders: 36 }
          ]
        },
        geographicData: [
          { city: 'Mumbai', orders: 125, revenue: 45600 },
          { city: 'Delhi', orders: 98, revenue: 38200 },
          { city: 'Bangalore', orders: 87, revenue: 32100 },
          { city: 'Chennai', orders: 76, revenue: 28900 },
          { city: 'Hyderabad', orders: 65, revenue: 24500 }
        ]
      };

      setAnalyticsData(mockData);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    change?: number;
    icon: React.ReactNode;
    color: string;
  }> = ({ title, value, change, icon, color }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change !== undefined && (
            <div className={`flex items-center mt-1 text-sm ${
              change >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {change >= 0 ? (
                <ArrowUp className="w-4 h-4 mr-1" />
              ) : (
                <ArrowDown className="w-4 h-4 mr-1" />
              )}
              <span>{Math.abs(change)}%</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full bg-${color}-100`}>
          <div className={`text-${color}-600`}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Failed to load analytics data</p>
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
                <BarChart3 className="w-6 h-6 mr-3 text-blue-600" />
                Analytics & Reports
              </h1>
              <p className="text-sm text-gray-600">
                Business insights and performance metrics
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="1d">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 3 Months</option>
                <option value="1y">Last Year</option>
              </select>
              <button
                onClick={fetchAnalyticsData}
                className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export Report</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Revenue"
            value={`₹${analyticsData.overview.totalRevenue.toLocaleString()}`}
            change={analyticsData.overview.revenueGrowth}
            icon={<DollarSign className="w-6 h-6" />}
            color="green"
          />
          <StatCard
            title="Total Orders"
            value={analyticsData.overview.totalOrders}
            change={analyticsData.overview.orderGrowth}
            icon={<ShoppingBag className="w-6 h-6" />}
            color="blue"
          />
          <StatCard
            title="Total Customers"
            value={analyticsData.overview.totalCustomers}
            change={analyticsData.overview.customerGrowth}
            icon={<Users className="w-6 h-6" />}
            color="purple"
          />
          <StatCard
            title="Avg Order Value"
            value={`₹${analyticsData.overview.averageOrderValue}`}
            change={analyticsData.overview.aovGrowth}
            icon={<TrendingUp className="w-6 h-6" />}
            color="orange"
          />
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'products', label: 'Products', icon: Award },
                { id: 'customers', label: 'Customers', icon: Users },
                { id: 'geographic', label: 'Geographic', icon: MapPin },
                { id: 'time-analysis', label: 'Time Analysis', icon: Clock }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Sales Trend Chart */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Trend</h3>
              <div className="h-64 flex items-end space-x-2">
                {analyticsData.salesData.map((data, index) => {
                  const maxRevenue = Math.max(...analyticsData.salesData.map(d => d.revenue));
                  const height = (data.revenue / maxRevenue) * 100;
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-colors cursor-pointer"
                        style={{ height: `${height}%` }}
                        title={`₹${data.revenue.toLocaleString()}`}
                      ></div>
                      <p className="text-xs text-gray-600 mt-2">
                        {new Date(data.date).toLocaleDateString('en-US', { weekday: 'short' })}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Category Performance */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Performance</h3>
              <div className="space-y-4">
                {analyticsData.categoryPerformance.map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="font-medium text-gray-900">{category.category}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">₹{category.revenue.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">{category.orders} orders</p>
                    </div>
                    <div className="w-16 text-right">
                      <span className="text-sm text-gray-600">{category.percentage.toFixed(1)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Top Performing Products</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {analyticsData.topProducts.map((product, index) => (
                  <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-bold">
                        #{index + 1}
                      </div>
                      <img
                        src={product.image || '/placeholder-product.jpg'}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <h4 className="font-medium text-gray-900">{product.name}</h4>
                        <p className="text-sm text-gray-600">{product.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">₹{product.revenue.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">{product.sales} sales</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'customers' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Top Customers</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {analyticsData.topCustomers.map((customer, index) => (
                  <div key={customer.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-8 h-8 bg-purple-100 text-purple-600 rounded-full font-bold">
                        #{index + 1}
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {customer.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{customer.name}</h4>
                        <p className="text-sm text-gray-600">{customer.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">₹{customer.totalSpent.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">{customer.totalOrders} orders</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'geographic' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Geographic Performance</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {analyticsData.geographicData.map((location, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <MapPin className="w-6 h-6 text-blue-600" />
                      <div>
                        <h4 className="font-medium text-gray-900">{location.city}</h4>
                        <p className="text-sm text-gray-600">{location.orders} orders</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">₹{location.revenue.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">Revenue</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'time-analysis' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Peak Hours */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Peak Hours</h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {analyticsData.timeBasedAnalytics.peakHours.map((hour, index) => {
                    const maxOrders = Math.max(...analyticsData.timeBasedAnalytics.peakHours.map(h => h.orders));
                    const width = (hour.orders / maxOrders) * 100;
                    return (
                      <div key={index} className="flex items-center space-x-3">
                        <span className="w-12 text-sm text-gray-600">
                          {hour.hour}:00
                        </span>
                        <div className="flex-1 bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-blue-500 h-3 rounded-full"
                            style={{ width: `${width}%` }}
                          ></div>
                        </div>
                        <span className="w-12 text-sm font-medium text-gray-900">
                          {hour.orders}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Peak Days */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Peak Days</h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {analyticsData.timeBasedAnalytics.peakDays.map((day, index) => {
                    const maxOrders = Math.max(...analyticsData.timeBasedAnalytics.peakDays.map(d => d.orders));
                    const width = (day.orders / maxOrders) * 100;
                    return (
                      <div key={index} className="flex items-center space-x-3">
                        <span className="w-16 text-sm text-gray-600">
                          {day.day}
                        </span>
                        <div className="flex-1 bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-purple-500 h-3 rounded-full"
                            style={{ width: `${width}%` }}
                          ></div>
                        </div>
                        <span className="w-12 text-sm font-medium text-gray-900">
                          {day.orders}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsReportsPage;
