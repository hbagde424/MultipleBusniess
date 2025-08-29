import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Users,
  Search,
  Filter,
  Plus,
  Edit,
  Mail,
  Phone,
  MapPin,
  Star,
  ShoppingBag,
  TrendingUp,
  Calendar,
  Download,
  Eye,
  MessageCircle,
  Gift,
  Heart,
  UserPlus,
  FileText,
  BarChart3,
  Target
} from 'lucide-react';

interface CustomerAddress {
  id: string;
  type: 'home' | 'office' | 'other';
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  status: 'active' | 'inactive' | 'blocked';
  customerType: 'regular' | 'premium' | 'vip';
  joinedDate: string;
  lastOrderDate?: string;
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  favoriteCategories: string[];
  addresses: CustomerAddress[];
  preferences: {
    communicationChannel: 'email' | 'sms' | 'both';
    marketingConsent: boolean;
    spiceLevel: number;
    dietaryRestrictions: string[];
  };
  loyaltyPoints: number;
  referralCode: string;
  tags: string[];
  notes: string;
}

const CustomerManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [showCustomerDetails, setShowCustomerDetails] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const customerTypes = [
    { value: 'all', label: 'All Customers', color: 'gray' },
    { value: 'regular', label: 'Regular', color: 'blue' },
    { value: 'premium', label: 'Premium', color: 'purple' },
    { value: 'vip', label: 'VIP', color: 'gold' }
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchCustomers();
  }, [isAuthenticated, navigate]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Mock data for demonstration
      const mockCustomers: Customer[] = [
        {
          _id: '1',
          name: 'Rajesh Kumar',
          email: 'rajesh@email.com',
          phone: '+91-9876543210',
          avatar: '/avatars/rajesh.jpg',
          dateOfBirth: '1985-06-15',
          gender: 'male',
          status: 'active',
          customerType: 'premium',
          joinedDate: '2024-01-15T00:00:00Z',
          lastOrderDate: '2025-08-25T10:30:00Z',
          totalOrders: 24,
          totalSpent: 15600,
          averageOrderValue: 650,
          favoriteCategories: ['Biryani', 'North Indian', 'Chinese'],
          addresses: [
            {
              id: 'addr1',
              type: 'home',
              street: '123 MG Road, Sector 15',
              city: 'Noida',
              state: 'Uttar Pradesh',
              zipCode: '201301',
              isDefault: true
            },
            {
              id: 'addr2',
              type: 'office',
              street: '456 Cyber City',
              city: 'Gurgaon',
              state: 'Haryana',
              zipCode: '122001',
              isDefault: false
            }
          ],
          preferences: {
            communicationChannel: 'both',
            marketingConsent: true,
            spiceLevel: 3,
            dietaryRestrictions: []
          },
          loyaltyPoints: 2340,
          referralCode: 'RAJ2024',
          tags: ['frequent-buyer', 'food-lover'],
          notes: 'Prefers spicy food, orders regularly on weekends'
        },
        {
          _id: '2',
          name: 'Priya Sharma',
          email: 'priya@email.com',
          phone: '+91-9876543211',
          dateOfBirth: '1990-03-22',
          gender: 'female',
          status: 'active',
          customerType: 'regular',
          joinedDate: '2024-06-10T00:00:00Z',
          lastOrderDate: '2025-08-28T14:15:00Z',
          totalOrders: 8,
          totalSpent: 3200,
          averageOrderValue: 400,
          favoriteCategories: ['South Indian', 'Desserts'],
          addresses: [
            {
              id: 'addr3',
              type: 'home',
              street: '789 CP, Central Delhi',
              city: 'New Delhi',
              state: 'Delhi',
              zipCode: '110001',
              isDefault: true
            }
          ],
          preferences: {
            communicationChannel: 'email',
            marketingConsent: true,
            spiceLevel: 2,
            dietaryRestrictions: ['vegetarian']
          },
          loyaltyPoints: 640,
          referralCode: 'PRI2024',
          tags: ['vegetarian', 'dessert-lover'],
          notes: 'Strictly vegetarian, loves desserts'
        },
        {
          _id: '3',
          name: 'Amit Patel',
          email: 'amit@email.com',
          phone: '+91-9876543212',
          status: 'active',
          customerType: 'vip',
          joinedDate: '2023-09-05T00:00:00Z',
          lastOrderDate: '2025-08-29T09:45:00Z',
          totalOrders: 89,
          totalSpent: 67500,
          averageOrderValue: 758,
          favoriteCategories: ['Gujarati', 'Punjabi', 'Continental'],
          addresses: [
            {
              id: 'addr4',
              type: 'home',
              street: '321 Satellite, SG Highway',
              city: 'Ahmedabad',
              state: 'Gujarat',
              zipCode: '380015',
              isDefault: true
            }
          ],
          preferences: {
            communicationChannel: 'both',
            marketingConsent: true,
            spiceLevel: 4,
            dietaryRestrictions: ['jain']
          },
          loyaltyPoints: 8950,
          referralCode: 'AMI2023',
          tags: ['vip-customer', 'high-value', 'loyal'],
          notes: 'VIP customer, high frequency orders, follows Jain diet'
        }
      ];

      setCustomers(mockCustomers);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCustomerTypeColor = (type: string) => {
    switch (type) {
      case 'regular':
        return 'blue';
      case 'premium':
        return 'purple';
      case 'vip':
        return 'yellow';
      default:
        return 'gray';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'green';
      case 'inactive':
        return 'yellow';
      case 'blocked':
        return 'red';
      default:
        return 'gray';
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    const matchesType = typeFilter === 'all' || customer.customerType === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const CustomerCard: React.FC<{ customer: Customer }> = ({ customer }) => {
    const typeColor = getCustomerTypeColor(customer.customerType);
    const statusColor = getStatusColor(customer.status);
    
    return (
      <div className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {customer.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${typeColor}-100 text-${typeColor}-800 capitalize`}>
                    {customer.customerType}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${statusColor}-100 text-${statusColor}-800 capitalize`}>
                    {customer.status}
                  </span>
                </div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={selectedCustomers.includes(customer._id)}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedCustomers([...selectedCustomers, customer._id]);
                } else {
                  setSelectedCustomers(selectedCustomers.filter(id => id !== customer._id));
                }
              }}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>

          {/* Contact Info */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Mail className="w-4 h-4" />
              <span>{customer.email}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Phone className="w-4 h-4" />
              <span>{customer.phone}</span>
            </div>
            {customer.addresses.length > 0 && (
              <div className="flex items-start space-x-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4 mt-0.5" />
                <span>{customer.addresses[0].city}, {customer.addresses[0].state}</span>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <p className="text-lg font-bold text-gray-900">{customer.totalOrders}</p>
              <p className="text-xs text-gray-600">Orders</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-gray-900">₹{customer.totalSpent.toLocaleString()}</p>
              <p className="text-xs text-gray-600">Total Spent</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-gray-900">{customer.loyaltyPoints}</p>
              <p className="text-xs text-gray-600">Points</p>
            </div>
          </div>

          {/* Tags */}
          {customer.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {customer.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
              {customer.tags.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                  +{customer.tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Last Order */}
          {customer.lastOrderDate && (
            <div className="text-sm text-gray-600 mb-4">
              <span className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Last order: {new Date(customer.lastOrderDate).toLocaleDateString()}</span>
              </span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                setSelectedCustomer(customer);
                setShowCustomerDetails(true);
              }}
              className="px-3 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors text-sm flex items-center space-x-1"
            >
              <Eye className="w-4 h-4" />
              <span>View</span>
            </button>
            
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                <MessageCircle className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-600 hover:text-green-600 transition-colors">
                <Mail className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-600 hover:text-purple-600 transition-colors">
                <Edit className="w-4 h-4" />
              </button>
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
          <p className="mt-4 text-gray-600">Loading customers...</p>
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
                <Users className="w-6 h-6 mr-3 text-blue-600" />
                Customer Management
              </h1>
              <p className="text-sm text-gray-600">
                Manage and analyze your customer base
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowAddCustomer(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm flex items-center space-x-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Add Customer</span>
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
                <p className="text-sm text-green-600">+12% this month</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Customers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {customers.filter(c => c.status === 'active').length}
                </p>
                <p className="text-sm text-green-600">+8% this month</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">VIP Customers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {customers.filter(c => c.customerType === 'vip').length}
                </p>
                <p className="text-sm text-yellow-600">High value</p>
              </div>
              <Star className="w-8 h-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Order Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{Math.round(customers.reduce((sum, c) => sum + c.averageOrderValue, 0) / customers.length || 0)}
                </p>
                <p className="text-sm text-blue-600">Per customer</p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Search */}
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search customers..."
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
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="blocked">Blocked</option>
            </select>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {customerTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Name A-Z</option>
              <option value="spending">Highest Spending</option>
              <option value="orders">Most Orders</option>
            </select>
          </div>

          {/* Bulk Actions */}
          {selectedCustomers.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {selectedCustomers.length} customers selected
                </span>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200">
                    Send Email
                  </button>
                  <button className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200">
                    Add to Campaign
                  </button>
                  <button className="px-3 py-1 bg-purple-100 text-purple-700 rounded text-sm hover:bg-purple-200">
                    Update Type
                  </button>
                  <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200">
                    Export Selected
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Customers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCustomers.map((customer) => (
            <CustomerCard key={customer._id} customer={customer} />
          ))}
        </div>

        {/* Empty State */}
        {filteredCustomers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No customers found</h3>
            <p className="text-gray-500">
              {customers.length === 0 
                ? "You don't have any customers yet."
                : "No customers match your current filters."
              }
            </p>
          </div>
        )}
      </div>

      {/* Customer Details Modal */}
      {showCustomerDetails && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Customer Details - {selectedCustomer.name}
                </h2>
                <button
                  onClick={() => setShowCustomerDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {/* Customer Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="md:col-span-2">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {selectedCustomer.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{selectedCustomer.name}</h3>
                      <p className="text-gray-600">{selectedCustomer.email}</p>
                      <p className="text-gray-600">{selectedCustomer.phone}</p>
                    </div>
                  </div>
                  
                  {selectedCustomer.notes && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
                      <p className="text-sm text-gray-600">{selectedCustomer.notes}</p>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Loyalty Points</h4>
                    <p className="text-2xl font-bold text-blue-700">{selectedCustomer.loyaltyPoints}</p>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">Total Spent</h4>
                    <p className="text-2xl font-bold text-green-700">₹{selectedCustomer.totalSpent.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Addresses */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Addresses</h4>
                <div className="space-y-3">
                  {selectedCustomer.addresses.map((address) => (
                    <div key={address.id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                          address.type === 'home' ? 'bg-blue-100 text-blue-800' :
                          address.type === 'office' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {address.type}
                        </span>
                        {address.isDefault && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-700">
                        {address.street}, {address.city}, {address.state} - {address.zipCode}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Preferences */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Preferences</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-gray-700">Spice Level</p>
                    <div className="flex items-center space-x-1 mt-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`w-3 h-3 rounded-full ${
                            level <= selectedCustomer.preferences.spiceLevel
                              ? 'bg-red-500'
                              : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-gray-700">Communication</p>
                    <p className="text-sm text-gray-600 capitalize">
                      {selectedCustomer.preferences.communicationChannel}
                    </p>
                  </div>
                </div>
                
                {selectedCustomer.preferences.dietaryRestrictions.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Dietary Restrictions</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedCustomer.preferences.dietaryRestrictions.map((restriction, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs"
                        >
                          {restriction}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-gray-900">{selectedCustomer.totalOrders}</p>
                  <p className="text-sm text-gray-600">Total Orders</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-gray-900">₹{selectedCustomer.averageOrderValue}</p>
                  <p className="text-sm text-gray-600">Avg Order Value</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.floor((new Date().getTime() - new Date(selectedCustomer.joinedDate).getTime()) / (1000 * 60 * 60 * 24))}
                  </p>
                  <p className="text-sm text-gray-600">Days Since Joined</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerManagementPage;
