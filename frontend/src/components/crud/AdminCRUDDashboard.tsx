import React, { useState } from 'react';
import { useProducts, useBusinesses, useOrders } from '../../hooks/useCRUD';
import Button from '../ui/Button';

interface DashboardStats {
  totalProducts: number;
  totalBusinesses: number;
  totalOrders: number;
  totalRevenue: number;
  activeBusinesses: number;
  pendingOrders: number;
}

export const AdminCRUDDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'businesses' | 'orders'>('overview');
  
  const { 
    data: products, 
    loading: productsLoading, 
    remove: removeProduct,
    refresh: refreshProducts 
  } = useProducts();
  
  const { 
    data: businesses, 
    loading: businessesLoading, 
    remove: removeBusiness,
    refresh: refreshBusinesses 
  } = useBusinesses();
  
  const { 
    data: orders, 
    loading: ordersLoading, 
    remove: removeOrder,
    refresh: refreshOrders 
  } = useOrders();

  // Calculate dashboard stats
  const stats: DashboardStats = {
    totalProducts: products.length,
    totalBusinesses: businesses.length,
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum: number, order: any) => sum + (order.totalAmount || 0), 0),
    activeBusinesses: businesses.filter((b: any) => b.isActive).length,
    pendingOrders: orders.filter((o: any) => o.status === 'pending').length,
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    const result = await removeProduct(productId);
    if (result.success) {
      alert('Product deleted successfully!');
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  const handleDeleteBusiness = async (businessId: string) => {
    if (!confirm('Are you sure you want to delete this business?')) return;
    
    const result = await removeBusiness(businessId);
    if (result.success) {
      alert('Business deleted successfully!');
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to delete this order?')) return;
    
    const result = await removeOrder(orderId);
    if (result.success) {
      alert('Order deleted successfully!');
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  const refreshAll = () => {
    refreshProducts();
    refreshBusinesses();
    refreshOrders();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard - CRUD Management</h1>
            <Button 
              onClick={refreshAll}
              className="bg-blue-500 hover:bg-blue-600"
            >
              Refresh All Data
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8" aria-label="Tabs">
            {[
              { id: 'overview', name: 'Overview' },
              { id: 'products', name: 'Products' },
              { id: 'businesses', name: 'Businesses' },
              { id: 'orders', name: 'Orders' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            <h2 className="text-xl font-semibold mb-6">Dashboard Overview</h2>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900">Total Products</h3>
                <p className="text-3xl font-bold text-blue-600">{stats.totalProducts}</p>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900">Total Businesses</h3>
                <p className="text-3xl font-bold text-green-600">{stats.totalBusinesses}</p>
                <p className="text-sm text-gray-500">{stats.activeBusinesses} active</p>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900">Total Orders</h3>
                <p className="text-3xl font-bold text-purple-600">{stats.totalOrders}</p>
                <p className="text-sm text-gray-500">{stats.pendingOrders} pending</p>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900">Total Revenue</h3>
                <p className="text-3xl font-bold text-yellow-600">₹{stats.totalRevenue.toLocaleString()}</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button 
                  onClick={() => setActiveTab('products')}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  Manage Products
                </Button>
                <Button 
                  onClick={() => setActiveTab('businesses')}
                  className="bg-green-500 hover:bg-green-600"
                >
                  Manage Businesses
                </Button>
                <Button 
                  onClick={() => setActiveTab('orders')}
                  className="bg-purple-500 hover:bg-purple-600"
                >
                  Manage Orders
                </Button>
                <Button 
                  onClick={refreshAll}
                  className="bg-gray-500 hover:bg-gray-600"
                >
                  Refresh Data
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Products Management</h2>
              <Button 
                onClick={refreshProducts}
                disabled={productsLoading}
                className="bg-blue-500 hover:bg-blue-600"
              >
                {productsLoading ? 'Loading...' : 'Refresh'}
              </Button>
            </div>
            
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Business</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product: any) => (
                    <tr key={product._id}>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">{product.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">₹{product.price}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{product.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{product.business?.name || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Button
                          onClick={() => handleDeleteProduct(product._id)}
                          className="bg-red-500 hover:bg-red-600 text-xs px-3 py-1"
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {products.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No products found.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Businesses Tab */}
        {activeTab === 'businesses' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Businesses Management</h2>
              <Button 
                onClick={refreshBusinesses}
                disabled={businessesLoading}
                className="bg-green-500 hover:bg-green-600"
              >
                {businessesLoading ? 'Loading...' : 'Refresh'}
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {businesses.map((business: any) => (
                <div key={business._id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold">{business.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      business.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {business.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3">{business.description}</p>
                  
                  <div className="space-y-1 text-sm text-gray-500 mb-4">
                    <p><strong>Address:</strong> {business.address}</p>
                    <p><strong>Phone:</strong> {business.phone}</p>
                    <p><strong>Email:</strong> {business.email}</p>
                  </div>
                  
                  <Button
                    onClick={() => handleDeleteBusiness(business._id)}
                    className="w-full bg-red-500 hover:bg-red-600 text-sm"
                  >
                    Delete Business
                  </Button>
                </div>
              ))}
            </div>
            
            {businesses.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No businesses found.
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Orders Management</h2>
              <Button 
                onClick={refreshOrders}
                disabled={ordersLoading}
                className="bg-purple-500 hover:bg-purple-600"
              >
                {ordersLoading ? 'Loading...' : 'Refresh'}
              </Button>
            </div>
            
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order: any) => (
                    <tr key={order._id}>
                      <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">{order.orderNumber || order._id?.slice(-8)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{order.user?.name || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">₹{order.totalAmount}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          order.status === 'completed' ? 'bg-green-100 text-green-800' :
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Button
                          onClick={() => handleDeleteOrder(order._id)}
                          className="bg-red-500 hover:bg-red-600 text-xs px-3 py-1"
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {orders.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No orders found.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCRUDDashboard;
