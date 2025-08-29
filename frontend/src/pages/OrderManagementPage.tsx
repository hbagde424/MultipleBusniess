import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  ShoppingBag,
  Search,
  Filter,
  Eye,
  Download,
  Printer,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Package,
  MapPin,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  User,
  RefreshCw,
  AlertTriangle,
  Bell
} from 'lucide-react';

interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  total: number;
  specifications?: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
}

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface Order {
  _id: string;
  orderNumber: string;
  customer: Customer;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  deliveryCharge: number;
  discount: number;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: 'cash' | 'card' | 'upi' | 'wallet';
  deliveryAddress: Address;
  billingAddress?: Address;
  estimatedDeliveryTime: string;
  actualDeliveryTime?: string;
  specialInstructions?: string;
  createdAt: string;
  updatedAt: string;
  timeline: Array<{
    status: string;
    timestamp: string;
    note?: string;
  }>;
}

const OrderManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  const orderStatuses = [
    { value: 'all', label: 'All Orders', color: 'gray' },
    { value: 'pending', label: 'Pending', color: 'yellow' },
    { value: 'confirmed', label: 'Confirmed', color: 'blue' },
    { value: 'preparing', label: 'Preparing', color: 'orange' },
    { value: 'ready', label: 'Ready', color: 'purple' },
    { value: 'out_for_delivery', label: 'Out for Delivery', color: 'indigo' },
    { value: 'delivered', label: 'Delivered', color: 'green' },
    { value: 'cancelled', label: 'Cancelled', color: 'red' }
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [isAuthenticated, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Mock data for demonstration
      const mockOrders: Order[] = [
        {
          _id: '1',
          orderNumber: 'ORD-2025-001',
          customer: {
            id: 'cust1',
            name: 'Rajesh Kumar',
            email: 'rajesh@email.com',
            phone: '+91-9876543210',
            avatar: '/avatars/rajesh.jpg'
          },
          items: [
            {
              productId: 'prod1',
              productName: 'Chicken Biryani',
              productImage: '/images/biryani.jpg',
              quantity: 2,
              price: 250,
              total: 500,
              specifications: 'Extra spicy, no onions'
            },
            {
              productId: 'prod2',
              productName: 'Raita',
              productImage: '/images/raita.jpg',
              quantity: 1,
              price: 50,
              total: 50
            }
          ],
          subtotal: 550,
          tax: 55,
          deliveryCharge: 30,
          discount: 35,
          total: 600,
          status: 'confirmed',
          paymentStatus: 'paid',
          paymentMethod: 'upi',
          deliveryAddress: {
            street: '123 MG Road, Sector 15',
            city: 'Noida',
            state: 'Uttar Pradesh',
            zipCode: '201301',
            coordinates: { lat: 28.5355, lng: 77.3910 }
          },
          estimatedDeliveryTime: '2025-08-29T13:30:00Z',
          specialInstructions: 'Please call before delivery',
          createdAt: '2025-08-29T11:00:00Z',
          updatedAt: '2025-08-29T11:30:00Z',
          timeline: [
            { status: 'pending', timestamp: '2025-08-29T11:00:00Z' },
            { status: 'confirmed', timestamp: '2025-08-29T11:15:00Z', note: 'Order confirmed by restaurant' }
          ]
        },
        {
          _id: '2',
          orderNumber: 'ORD-2025-002',
          customer: {
            id: 'cust2',
            name: 'Priya Sharma',
            email: 'priya@email.com',
            phone: '+91-9876543211'
          },
          items: [
            {
              productId: 'prod3',
              productName: 'Paneer Butter Masala',
              productImage: '/images/paneer.jpg',
              quantity: 1,
              price: 180,
              total: 180
            }
          ],
          subtotal: 180,
          tax: 18,
          deliveryCharge: 25,
          discount: 0,
          total: 223,
          status: 'pending',
          paymentStatus: 'pending',
          paymentMethod: 'cash',
          deliveryAddress: {
            street: '456 CP, Central Delhi',
            city: 'New Delhi',
            state: 'Delhi',
            zipCode: '110001'
          },
          estimatedDeliveryTime: '2025-08-29T14:00:00Z',
          createdAt: '2025-08-29T11:30:00Z',
          updatedAt: '2025-08-29T11:30:00Z',
          timeline: [
            { status: 'pending', timestamp: '2025-08-29T11:30:00Z' }
          ]
        }
      ];

      setOrders(mockOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      
      // API call would go here
      setOrders(orders.map(order => 
        order._id === orderId 
          ? { 
              ...order, 
              status: newStatus as any,
              timeline: [
                ...order.timeline,
                {
                  status: newStatus,
                  timestamp: new Date().toISOString(),
                  note: `Status updated to ${newStatus}`
                }
              ]
            }
          : order
      ));
      
      console.log('Order status updated:', orderId, newStatus);
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    const statusConfig = orderStatuses.find(s => s.value === status);
    return statusConfig?.color || 'gray';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'preparing':
        return <Package className="w-4 h-4" />;
      case 'ready':
        return <Bell className="w-4 h-4" />;
      case 'out_for_delivery':
        return <Truck className="w-4 h-4" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesPayment = paymentFilter === 'all' || order.paymentStatus === paymentFilter;
    
    return matchesSearch && matchesStatus && matchesPayment;
  });

  const OrderCard: React.FC<{ order: Order }> = ({ order }) => {
    const statusColor = getStatusColor(order.status);
    
    return (
      <div className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {order.orderNumber}
              </h3>
              <p className="text-sm text-gray-600">
                {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium bg-${statusColor}-100 text-${statusColor}-800 flex items-center space-x-1`}>
                {getStatusIcon(order.status)}
                <span className="capitalize">{order.status.replace('_', ' ')}</span>
              </span>
              <input
                type="checkbox"
                checked={selectedOrders.includes(order._id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedOrders([...selectedOrders, order._id]);
                  } else {
                    setSelectedOrders(selectedOrders.filter(id => id !== order._id));
                  }
                }}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Customer Info */}
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{order.customer.name}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span className="flex items-center space-x-1">
                  <Phone className="w-3 h-3" />
                  <span>{order.customer.phone}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Mail className="w-3 h-3" />
                  <span>{order.customer.email}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Items ({order.items.length})
            </p>
            <div className="space-y-2">
              {order.items.slice(0, 2).map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    {item.quantity}x {item.productName}
                  </span>
                  <span className="font-medium">₹{item.total}</span>
                </div>
              ))}
              {order.items.length > 2 && (
                <p className="text-sm text-gray-500">
                  +{order.items.length - 2} more items
                </p>
              )}
            </div>
          </div>

          {/* Delivery Info */}
          <div className="mb-4">
            <div className="flex items-start space-x-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{order.deliveryAddress.street}, {order.deliveryAddress.city}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
              <Clock className="w-4 h-4" />
              <span>
                Expected: {new Date(order.estimatedDeliveryTime).toLocaleTimeString()}
              </span>
            </div>
          </div>

          {/* Payment Info */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="text-lg font-bold text-gray-900">₹{order.total}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                order.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {order.paymentStatus}
              </span>
              <span className="text-xs text-gray-500 capitalize">
                {order.paymentMethod}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                setSelectedOrder(order);
                setShowOrderDetails(true);
              }}
              className="px-3 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors text-sm flex items-center space-x-1"
            >
              <Eye className="w-4 h-4" />
              <span>View Details</span>
            </button>

            <div className="flex items-center space-x-2">
              {order.status === 'pending' && (
                <button
                  onClick={() => updateOrderStatus(order._id, 'confirmed')}
                  className="px-3 py-2 bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition-colors text-sm"
                >
                  Confirm
                </button>
              )}
              {order.status === 'confirmed' && (
                <button
                  onClick={() => updateOrderStatus(order._id, 'preparing')}
                  className="px-3 py-2 bg-orange-50 text-orange-600 rounded-md hover:bg-orange-100 transition-colors text-sm"
                >
                  Start Preparing
                </button>
              )}
              {order.status === 'preparing' && (
                <button
                  onClick={() => updateOrderStatus(order._id, 'ready')}
                  className="px-3 py-2 bg-purple-50 text-purple-600 rounded-md hover:bg-purple-100 transition-colors text-sm"
                >
                  Mark Ready
                </button>
              )}
              {order.status === 'ready' && (
                <button
                  onClick={() => updateOrderStatus(order._id, 'out_for_delivery')}
                  className="px-3 py-2 bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 transition-colors text-sm"
                >
                  Out for Delivery
                </button>
              )}
              {order.status === 'out_for_delivery' && (
                <button
                  onClick={() => updateOrderStatus(order._id, 'delivered')}
                  className="px-3 py-2 bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition-colors text-sm"
                >
                  Mark Delivered
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
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
                <ShoppingBag className="w-6 h-6 mr-3 text-blue-600" />
                Order Management
              </h1>
              <p className="text-sm text-gray-600">
                Track and manage all your orders
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={fetchOrders}
                className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm flex items-center space-x-2">
                <Printer className="w-4 h-4" />
                <span>Print</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
          {orderStatuses.filter(s => s.value !== 'all').map((status) => {
            const count = orders.filter(order => order.status === status.value).length;
            return (
              <div
                key={status.value}
                className={`bg-white p-4 rounded-lg border-l-4 border-${status.color}-500 hover:shadow-md transition-shadow cursor-pointer`}
                onClick={() => setStatusFilter(status.value)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600">{status.label}</p>
                    <p className="text-lg font-bold text-gray-900">{count}</p>
                  </div>
                  <div className={`text-${status.color}-600`}>
                    {getStatusIcon(status.value)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Search */}
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {orderStatuses.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>

            {/* Payment Filter */}
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Payments</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="amount-high">Amount: High to Low</option>
              <option value="amount-low">Amount: Low to High</option>
            </select>
          </div>

          {/* Bulk Actions */}
          {selectedOrders.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {selectedOrders.length} orders selected
                </span>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200">
                    Bulk Update Status
                  </button>
                  <button className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200">
                    Print Labels
                  </button>
                  <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200">
                    Export Selected
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Orders Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredOrders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>

        {/* Empty State */}
        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No orders found</h3>
            <p className="text-gray-500">
              {orders.length === 0 
                ? "You don't have any orders yet."
                : "No orders match your current filters."
              }
            </p>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Order Details - {selectedOrder.orderNumber}
                </h2>
                <button
                  onClick={() => setShowOrderDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            {/* Order Details Content */}
            <div className="p-6">
              {/* Order Timeline */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Order Timeline</h3>
                <div className="space-y-3">
                  {selectedOrder.timeline.map((event, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full bg-${getStatusColor(event.status)}-500`}></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 capitalize">
                          {event.status.replace('_', ' ')}
                        </p>
                        <p className="text-xs text-gray-600">
                          {new Date(event.timestamp).toLocaleString()}
                        </p>
                        {event.note && (
                          <p className="text-xs text-gray-500">{event.note}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer & Delivery Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Customer Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Name:</span> {selectedOrder.customer.name}</p>
                    <p><span className="font-medium">Email:</span> {selectedOrder.customer.email}</p>
                    <p><span className="font-medium">Phone:</span> {selectedOrder.customer.phone}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Delivery Address</h4>
                  <div className="text-sm text-gray-600">
                    <p>{selectedOrder.deliveryAddress.street}</p>
                    <p>{selectedOrder.deliveryAddress.city}, {selectedOrder.deliveryAddress.state}</p>
                    <p>{selectedOrder.deliveryAddress.zipCode}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Order Items</h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <img
                          src={item.productImage || '/placeholder-product.jpg'}
                          alt={item.productName}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{item.productName}</p>
                          <p className="text-sm text-gray-600">Qty: {item.quantity} × ₹{item.price}</p>
                          {item.specifications && (
                            <p className="text-xs text-gray-500">{item.specifications}</p>
                          )}
                        </div>
                      </div>
                      <p className="font-medium text-gray-900">₹{item.total}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="border-t border-gray-200 pt-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{selectedOrder.subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>₹{selectedOrder.tax}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Charge:</span>
                    <span>₹{selectedOrder.deliveryCharge}</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount:</span>
                      <span>-₹{selectedOrder.discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg border-t border-gray-200 pt-2">
                    <span>Total:</span>
                    <span>₹{selectedOrder.total}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagementPage;
