import React, { useState } from 'react';
import { useBusinesses } from '../../hooks/useCRUD';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface Business {
  _id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  cuisine: string[];
  isActive: boolean;
  rating: number;
  owner: string;
}

export const BusinessCRUD: React.FC = () => {
  const {
    data: businesses,
    loading,
    error,
    create,
    update,
    remove,
    refresh,
    clearError
  } = useBusinesses();

  const [showForm, setShowForm] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    cuisine: '',
    isActive: true
  });

  // Form handlers
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const businessData = {
      ...formData,
      cuisine: formData.cuisine.split(',').map(c => c.trim()).filter(c => c)
    };

    let result;
    if (editingBusiness) {
      result = await update(editingBusiness._id, businessData);
    } else {
      result = await create(businessData);
    }

    if (result.success) {
      resetForm();
      alert(editingBusiness ? 'Business updated successfully!' : 'Business created successfully!');
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  const handleEdit = (business: Business) => {
    setEditingBusiness(business);
    setFormData({
      name: business.name,
      description: business.description,
      address: business.address,
      phone: business.phone,
      email: business.email,
      cuisine: business.cuisine.join(', '),
      isActive: business.isActive
    });
    setShowForm(true);
  };

  const handleDelete = async (businessId: string) => {
    if (!confirm('Are you sure you want to delete this business?')) return;
    
    const result = await remove(businessId);
    if (result.success) {
      alert('Business deleted successfully!');
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      address: '',
      phone: '',
      email: '',
      cuisine: '',
      isActive: true
    });
    setEditingBusiness(null);
    setShowForm(false);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Business Management</h1>
        <div className="flex gap-2">
          <Button 
            onClick={refresh}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600"
          >
            {loading ? 'Loading...' : 'Refresh'}
          </Button>
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-green-500 hover:bg-green-600"
          >
            Add New Business
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button onClick={clearError} className="text-red-700 hover:text-red-900">
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">
              {editingBusiness ? 'Edit Business' : 'Add New Business'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                placeholder="Business Name"
                value={formData.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('name', e.target.value)}
                required
              />
              
              <textarea
                className="w-full p-3 border border-gray-300 rounded-md"
                placeholder="Description"
                value={formData.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('description', e.target.value)}
                rows={3}
                required
              />
              
              <Input
                type="text"
                placeholder="Address"
                value={formData.address}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('address', e.target.value)}
                required
              />
              
              <Input
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('phone', e.target.value)}
                required
              />
              
              <Input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('email', e.target.value)}
                required
              />
              
              <Input
                type="text"
                placeholder="Cuisine Types (comma separated)"
                value={formData.cuisine}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('cuisine', e.target.value)}
                required
              />
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('isActive', e.target.checked)}
                  className="rounded"
                />
                <span>Active Business</span>
              </label>
              
              <div className="flex gap-2 pt-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-500 hover:bg-blue-600"
                >
                  {loading ? 'Saving...' : (editingBusiness ? 'Update' : 'Create')}
                </Button>
                <Button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-500 hover:bg-gray-600"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Businesses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {businesses.map((business: Business) => (
          <div key={business._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold">{business.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  business.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {business.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{business.description}</p>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-gray-500">
                  <span className="font-medium">Address:</span>
                  <span className="ml-1 truncate">{business.address}</span>
                </div>
                
                <div className="flex items-center text-gray-500">
                  <span className="font-medium">Phone:</span>
                  <span className="ml-1">{business.phone}</span>
                </div>
                
                <div className="flex items-center text-gray-500">
                  <span className="font-medium">Email:</span>
                  <span className="ml-1 truncate">{business.email}</span>
                </div>
                
                <div className="flex items-center text-gray-500">
                  <span className="font-medium">Cuisine:</span>
                  <span className="ml-1">{business.cuisine.join(', ')}</span>
                </div>
                
                {business.rating && (
                  <div className="flex items-center text-gray-500">
                    <span className="font-medium">Rating:</span>
                    <span className="ml-1 text-yellow-500">
                      {'★'.repeat(Math.floor(business.rating))} {business.rating.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button
                  onClick={() => handleEdit(business)}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-sm py-2"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(business._id)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-sm py-2"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {businesses.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">No businesses found</div>
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-green-500 hover:bg-green-600"
          >
            Create Your First Business
          </Button>
        </div>
      )}

      {/* Loading State */}
      {loading && businesses.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">Loading businesses...</div>
        </div>
      )}
    </div>
  );
};

export default BusinessCRUD;
