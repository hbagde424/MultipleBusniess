import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface Analytics {
  totalViews: number;
  uniqueVisitors: number;
  conversionRate: number;
  avgOrderValue: number;
  topProducts: any[];
  revenueData: any[];
  customerInsights: any;
}

export const AdvancedAnalytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/analytics/dashboard', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const generateReport = async () => {
    try {
      const response = await fetch('/api/analytics/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(dateRange)
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'analytics-report.pdf';
        a.click();
      }
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Advanced Analytics Dashboard</h1>
        <div className="flex gap-4">
          <Input
            type="date"
            value={dateRange.startDate}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
              setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
          />
          <Input
            type="date"
            value={dateRange.endDate}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
              setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
          />
          <Button onClick={generateReport} className="bg-blue-500 hover:bg-blue-600">
            Generate Report
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="text-lg text-gray-500">Loading analytics...</div>
        </div>
      ) : analytics ? (
        <div className="space-y-8">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">Total Views</h3>
              <p className="text-3xl font-bold text-blue-600">{analytics.totalViews.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">Unique Visitors</h3>
              <p className="text-3xl font-bold text-green-600">{analytics.uniqueVisitors.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">Conversion Rate</h3>
              <p className="text-3xl font-bold text-purple-600">{analytics.conversionRate.toFixed(2)}%</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">Avg Order Value</h3>
              <p className="text-3xl font-bold text-yellow-600">₹{analytics.avgOrderValue.toFixed(0)}</p>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Revenue Chart */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Revenue Trends</h3>
              <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
                <span className="text-gray-500">Chart Component (Chart.js/Recharts integration)</span>
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Top Performing Products</h3>
              <div className="space-y-3">
                {analytics.topProducts.slice(0, 5).map((product: any, index: number) => (
                  <div key={product.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.sales} sales</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{product.revenue.toLocaleString()}</p>
                      <p className="text-sm text-green-600">#{index + 1}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Detailed Analytics */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Customer Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium text-gray-700">Customer Retention</h4>
                <p className="text-2xl font-bold text-blue-600">
                  {analytics.customerInsights?.retentionRate || 0}%
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">Average Session Duration</h4>
                <p className="text-2xl font-bold text-green-600">
                  {analytics.customerInsights?.avgSessionDuration || 0} min
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">Bounce Rate</h4>
                <p className="text-2xl font-bold text-red-600">
                  {analytics.customerInsights?.bounceRate || 0}%
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-lg text-gray-500">No analytics data available</div>
        </div>
      )}
    </div>
  );
};

export default AdvancedAnalytics;
