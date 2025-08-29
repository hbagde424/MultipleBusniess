import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Store,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  BarChart3,
  PieChart,
  Calendar,
  Filter
} from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  totalBusinesses: number;
  totalOrders: number;
  totalRevenue: number;
  pendingApprovals: number;
  activeSubscriptions: number;
}

interface RecentActivity {
  id: string;
  type: 'user_registration' | 'business_application' | 'order_placed' | 'payment_received';
  message: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error';
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalBusinesses: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingApprovals: 0,
    activeSubscriptions: 0
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('7d');

  useEffect(() => {
    fetchDashboardData();
  }, [selectedPeriod]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Fetch dashboard statistics
      const statsResponse = await fetch('/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      // Fetch recent activity
      const activityResponse = await fetch('/api/admin/recent-activity', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (activityResponse.ok) {
        const activityData = await activityResponse.json();
        setRecentActivity(activityData);
      }
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
  }> = ({ icon, title, value, change, changeType, onClick }) => (
    <div 
      className={`bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-xs mt-1 ${
              changeType === 'positive' ? 'text-green-600' : 
              changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
            }`}>
              {change}
            </p>
          )}
        </div>
        <div className="text-blue-600">
          {icon}
        </div>
      </div>
    </div>
  );

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_registration':
        return <Users className="w-4 h-4" />;
      case 'business_application':
        return <Store className="w-4 h-4" />;
      case 'order_placed':
        return <ShoppingBag className="w-4 h-4" />;
      case 'payment_received':
        return <DollarSign className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
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
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome back! Here's what's happening on your platform.</p>
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
                onClick={() => navigate('/admin/reports')}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
              >
                View Reports
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <StatCard
            icon={<Users className="w-6 h-6" />}
            title="Total Users"
            value={stats.totalUsers.toLocaleString()}
            change="+12% from last month"
            changeType="positive"
            onClick={() => navigate('/admin/users')}
          />
          <StatCard
            icon={<Store className="w-6 h-6" />}
            title="Total Businesses"
            value={stats.totalBusinesses.toLocaleString()}
            change="+8% from last month"
            changeType="positive"
            onClick={() => navigate('/admin/businesses')}
          />
          <StatCard
            icon={<ShoppingBag className="w-6 h-6" />}
            title="Total Orders"
            value={stats.totalOrders.toLocaleString()}
            change="+15% from last month"
            changeType="positive"
            onClick={() => navigate('/admin/orders')}
          />
          <StatCard
            icon={<DollarSign className="w-6 h-6" />}
            title="Total Revenue"
            value={`₹${stats.totalRevenue.toLocaleString()}`}
            change="+18% from last month"
            changeType="positive"
            onClick={() => navigate('/admin/revenue')}
          />
          <StatCard
            icon={<AlertCircle className="w-6 h-6" />}
            title="Pending Approvals"
            value={stats.pendingApprovals}
            onClick={() => navigate('/admin/approvals')}
          />
          <StatCard
            icon={<TrendingUp className="w-6 h-6" />}
            title="Active Subscriptions"
            value={stats.activeSubscriptions.toLocaleString()}
            change="+5% from last month"
            changeType="positive"
            onClick={() => navigate('/admin/subscriptions')}
          />
        </div>

        {/* Charts and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Charts Section */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Platform Analytics</h2>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <BarChart3 className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <PieChart className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              {/* Placeholder for charts */}
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Analytics charts will be displayed here</p>
                  <p className="text-sm text-gray-500">Revenue, Orders, User Growth</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
              <button 
                onClick={() => navigate('/admin/activity')}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                View All
              </button>
            </div>
            
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.slice(0, 6).map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.timestamp}</p>
                    </div>
                    <div className="flex-shrink-0">
                      {getStatusIcon(activity.status)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">No recent activity</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => navigate('/admin/businesses/approvals')}
              className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow text-left"
            >
              <Store className="w-8 h-8 text-blue-600 mb-2" />
              <h3 className="font-medium text-gray-900">Business Approvals</h3>
              <p className="text-sm text-gray-600">{stats.pendingApprovals} pending</p>
            </button>

            <button
              onClick={() => navigate('/admin/reviews/moderation')}
              className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow text-left"
            >
              <AlertCircle className="w-8 h-8 text-yellow-600 mb-2" />
              <h3 className="font-medium text-gray-900">Review Moderation</h3>
              <p className="text-sm text-gray-600">Review reported content</p>
            </button>

            <button
              onClick={() => navigate('/admin/promo-codes')}
              className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow text-left"
            >
              <DollarSign className="w-8 h-8 text-green-600 mb-2" />
              <h3 className="font-medium text-gray-900">Promo Codes</h3>
              <p className="text-sm text-gray-600">Manage promotions</p>
            </button>

            <button
              onClick={() => navigate('/admin/settings')}
              className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow text-left"
            >
              <Filter className="w-8 h-8 text-purple-600 mb-2" />
              <h3 className="font-medium text-gray-900">Platform Settings</h3>
              <p className="text-sm text-gray-600">Configure system</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
