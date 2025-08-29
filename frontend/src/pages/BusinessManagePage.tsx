import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search, 
  Filter,
  MoreVertical,
  Star,
  Users,
  Package,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface Business {
  _id: string;
  name: string;
  description: string;
  category: string;
  rating: number;
  totalReviews: number;
  address: string;
  phone: string;
  email: string;
  logo?: string;
  images: string[];
  isActive: boolean;
  isVerified: boolean;
  owner: {
    name: string;
    email: string;
  };
  createdAt: string;
}

const BusinessManagePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [businessToDelete, setBusinessToDelete] = useState<string | null>(null);
  const [actionDropdown, setActionDropdown] = useState<string | null>(null);

  const categories = ['all', 'food', 'tiffin', 'bakery', 'pickles', 'sweets', 'restaurant', 'grocery', 'other'];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchBusinesses();
  }, [isAuthenticated, navigate]);

  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:5000/api/businesses/owner/my-businesses', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('📦 My businesses loaded:', data);
        setBusinesses(data);
      } else if (response.status === 401) {
        navigate('/login');
      } else {
        console.error('Failed to fetch businesses');
      }
    } catch (error) {
      console.error('Error fetching businesses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBusiness = async (businessId: string) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:5000/api/businesses/${businessId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setBusinesses(businesses.filter(b => b._id !== businessId));
        setShowDeleteModal(false);
        setBusinessToDelete(null);
        console.log('✅ Business deleted successfully');
      } else {
        console.error('Failed to delete business');
        alert('Failed to delete business. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting business:', error);
      alert('Error deleting business. Please try again.');
    }
  };

  const handleToggleStatus = async (businessId: string, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:5000/api/businesses/${businessId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isActive: !currentStatus })
      });

      if (response.ok) {
        setBusinesses(businesses.map(b => 
          b._id === businessId ? { ...b, isActive: !currentStatus } : b
        ));
        console.log('✅ Business status updated');
      } else {
        console.error('Failed to update business status');
        alert('Failed to update business status. Please try again.');
      }
    } catch (error) {
      console.error('Error updating business status:', error);
      alert('Error updating business status. Please try again.');
    }
  };

  const filteredBusinesses = businesses.filter(business => {
    const matchesSearch = business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         business.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || business.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && business.isActive) ||
                         (statusFilter === 'inactive' && !business.isActive) ||
                         (statusFilter === 'verified' && business.isVerified) ||
                         (statusFilter === 'unverified' && !business.isVerified);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const ActionDropdown: React.FC<{ business: Business }> = ({ business }) => (
    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
      <div className="py-1">
        <Link
          to={`/business/${business._id}`}
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          onClick={() => setActionDropdown(null)}
        >
          <Eye className="w-4 h-4 inline mr-2" />
          View Details
        </Link>
        <Link
          to={`/business/edit/${business._id}`}
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          onClick={() => setActionDropdown(null)}
        >
          <Edit className="w-4 h-4 inline mr-2" />
          Edit Business
        </Link>
        <button
          onClick={() => {
            handleToggleStatus(business._id, business.isActive);
            setActionDropdown(null);
          }}
          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          {business.isActive ? (
            <>
              <AlertCircle className="w-4 h-4 inline mr-2" />
              Deactivate
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4 inline mr-2" />
              Activate
            </>
          )}
        </button>
        <hr className="my-1" />
        <button
          onClick={() => {
            setBusinessToDelete(business._id);
            setShowDeleteModal(true);
            setActionDropdown(null);
          }}
          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4 inline mr-2" />
          Delete Business
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your businesses...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">My Businesses</h1>
              <p className="text-sm text-gray-600">Manage your registered businesses</p>
            </div>
            <Link
              to="/business/register"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Business</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search businesses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="verified">Verified</option>
              <option value="unverified">Unverified</option>
            </select>

            {/* Results Count */}
            <div className="flex items-center text-sm text-gray-600">
              <Filter className="w-4 h-4 mr-2" />
              {filteredBusinesses.length} of {businesses.length} businesses
            </div>
          </div>
        </div>

        {/* Business Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredBusinesses.length > 0 ? (
            filteredBusinesses.map((business) => (
              <div
                key={business._id}
                className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Business Image */}
                <div className="h-48 bg-gray-200 relative">
                  {business.images.length > 0 ? (
                    <img
                      src={business.images[0]}
                      alt={business.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-4xl">🏪</span>
                    </div>
                  )}
                  
                  {/* Status Badges */}
                  <div className="absolute top-2 left-2 flex flex-col space-y-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      business.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {business.isActive ? 'Active' : 'Inactive'}
                    </span>
                    {business.isVerified && (
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                        Verified
                      </span>
                    )}
                  </div>

                  {/* Category Badge */}
                  <div className="absolute top-2 right-2">
                    <span className="bg-white/90 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                      {business.category}
                    </span>
                  </div>

                  {/* Actions Dropdown */}
                  <div className="absolute bottom-2 right-2">
                    <div className="relative">
                      <button
                        onClick={() => setActionDropdown(actionDropdown === business._id ? null : business._id)}
                        className="bg-white/90 p-2 rounded-full hover:bg-white transition-colors"
                      >
                        <MoreVertical className="w-4 h-4 text-gray-600" />
                      </button>
                      {actionDropdown === business._id && (
                        <ActionDropdown business={business} />
                      )}
                    </div>
                  </div>
                </div>

                {/* Business Info */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2 line-clamp-1">{business.name}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{business.description}</p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Star className="w-4 h-4 text-yellow-400" />
                      </div>
                      <p className="text-xs text-gray-600">Rating</p>
                      <p className="text-sm font-semibold">{business.rating.toFixed(1)}</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Users className="w-4 h-4 text-blue-400" />
                      </div>
                      <p className="text-xs text-gray-600">Reviews</p>
                      <p className="text-sm font-semibold">{business.totalReviews}</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Package className="w-4 h-4 text-green-400" />
                      </div>
                      <p className="text-xs text-gray-600">Products</p>
                      <p className="text-sm font-semibold">-</p>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-1 text-xs text-gray-600 mb-4">
                    <div className="flex items-center">
                      <span className="w-4 h-4 mr-2">📍</span>
                      <span className="line-clamp-1">{business.address}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-4 h-4 mr-2">📞</span>
                      <span>{business.phone}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <Link
                      to={`/business/${business._id}`}
                      className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors text-sm text-center"
                    >
                      View
                    </Link>
                    <Link
                      to={`/business/edit/${business._id}`}
                      className="flex-1 px-3 py-2 bg-gray-50 text-gray-600 rounded-md hover:bg-gray-100 transition-colors text-sm text-center"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-6xl mb-4">🏪</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No businesses found</h3>
              <p className="text-gray-500 mb-4">
                {businesses.length === 0 
                  ? "You haven't registered any businesses yet."
                  : "No businesses match your current filters."
                }
              </p>
              <Link
                to="/business/register"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Register Your First Business
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <Trash2 className="w-6 h-6 text-red-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Delete Business</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this business? This action cannot be undone and will remove all associated data.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setBusinessToDelete(null);
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => businessToDelete && handleDeleteBusiness(businessToDelete)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessManagePage;
