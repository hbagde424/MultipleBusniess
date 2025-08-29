import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Star,
  AlertCircle,
  CheckCircle,
  Upload,
  MoreVertical,
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3
} from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  comparePrice?: number;
  cost: number;
  sku: string;
  barcode?: string;
  stock: number;
  lowStockThreshold: number;
  category: string;
  subcategory?: string;
  tags: string[];
  images: string[];
  rating: number;
  reviewCount: number;
  soldCount: number;
  isActive: boolean;
  isFeatured: boolean;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
}

const ProductManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = [
    'all', 'Main Course', 'Appetizers', 'Desserts', 'Beverages', 
    'Snacks', 'Breakfast', 'Lunch', 'Dinner', 'Special Items'
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchProducts();
  }, [isAuthenticated, navigate]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Mock data for demonstration
      const mockProducts: Product[] = [
        {
          _id: '1',
          name: 'Chicken Biryani',
          description: 'Aromatic basmati rice with tender chicken pieces, cooked with traditional spices',
          price: 250,
          comparePrice: 300,
          cost: 150,
          sku: 'CHK-BIR-001',
          barcode: '1234567890123',
          stock: 25,
          lowStockThreshold: 5,
          category: 'Main Course',
          subcategory: 'Rice Dishes',
          tags: ['spicy', 'chicken', 'rice', 'biryani'],
          images: ['/images/chicken-biryani.jpg'],
          rating: 4.8,
          reviewCount: 45,
          soldCount: 120,
          isActive: true,
          isFeatured: true,
          weight: 500,
          dimensions: { length: 20, width: 15, height: 8 },
          seoTitle: 'Best Chicken Biryani in Town',
          seoDescription: 'Order authentic chicken biryani made with premium ingredients',
          createdAt: '2025-08-01T10:00:00Z',
          updatedAt: '2025-08-29T10:00:00Z'
        },
        {
          _id: '2',
          name: 'Paneer Butter Masala',
          description: 'Creamy tomato-based curry with soft paneer cubes',
          price: 180,
          cost: 100,
          sku: 'PAN-BUT-001',
          stock: 15,
          lowStockThreshold: 3,
          category: 'Main Course',
          subcategory: 'Curry',
          tags: ['vegetarian', 'paneer', 'curry', 'creamy'],
          images: ['/images/paneer-butter-masala.jpg'],
          rating: 4.5,
          reviewCount: 32,
          soldCount: 89,
          isActive: true,
          isFeatured: false,
          weight: 400,
          createdAt: '2025-08-01T10:00:00Z',
          updatedAt: '2025-08-29T10:00:00Z'
        }
      ];

      setProducts(mockProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      const token = localStorage.getItem('token');
      
      // API call would go here
      console.log('Deleting product:', productId);
      
      setProducts(products.filter(p => p._id !== productId));
      setShowDeleteModal(false);
      setProductToDelete(null);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleToggleStatus = async (productId: string, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem('token');
      
      // API call would go here
      setProducts(products.map(p => 
        p._id === productId ? { ...p, isActive: !currentStatus } : p
      ));
    } catch (error) {
      console.error('Error updating product status:', error);
    }
  };

  const handleBulkAction = (action: string) => {
    console.log('Bulk action:', action, 'for products:', selectedProducts);
    // Implement bulk actions
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && product.isActive) ||
                         (statusFilter === 'inactive' && !product.isActive) ||
                         (statusFilter === 'featured' && product.isFeatured) ||
                         (statusFilter === 'low-stock' && product.stock <= product.lowStockThreshold);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'price':
        aValue = a.price;
        bValue = b.price;
        break;
      case 'stock':
        aValue = a.stock;
        bValue = b.stock;
        break;
      case 'sold':
        aValue = a.soldCount;
        bValue = b.soldCount;
        break;
      case 'rating':
        aValue = a.rating;
        bValue = b.rating;
        break;
      default:
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
    }
    
    if (sortOrder === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const ProductCard: React.FC<{ product: Product }> = ({ product }) => (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={product.images[0] || '/placeholder-product.jpg'}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        
        {/* Status Badges */}
        <div className="absolute top-2 left-2 flex flex-col space-y-1">
          {!product.isActive && (
            <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
              Inactive
            </span>
          )}
          {product.isFeatured && (
            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
              Featured
            </span>
          )}
          {product.stock <= product.lowStockThreshold && (
            <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
              Low Stock
            </span>
          )}
        </div>

        {/* Actions Dropdown */}
        <div className="absolute top-2 right-2">
          <div className="relative">
            <button className="bg-white/90 p-2 rounded-full hover:bg-white transition-colors">
              <MoreVertical className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{product.name}</h3>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={selectedProducts.includes(product._id)}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedProducts([...selectedProducts, product._id]);
                } else {
                  setSelectedProducts(selectedProducts.filter(id => id !== product._id));
                }
              }}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>

        {/* Price and Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-500">Price</p>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-green-600">₹{product.price}</span>
              {product.comparePrice && (
                <span className="text-sm text-gray-400 line-through">₹{product.comparePrice}</span>
              )}
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500">Stock</p>
            <span className={`text-lg font-semibold ${
              product.stock <= product.lowStockThreshold ? 'text-red-600' : 'text-gray-900'
            }`}>
              {product.stock}
            </span>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-3 gap-2 mb-4 text-center">
          <div>
            <div className="flex items-center justify-center mb-1">
              <Star className="w-4 h-4 text-yellow-400" />
            </div>
            <p className="text-xs text-gray-600">Rating</p>
            <p className="text-sm font-semibold">{product.rating}</p>
          </div>
          <div>
            <div className="flex items-center justify-center mb-1">
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <p className="text-xs text-gray-600">Sold</p>
            <p className="text-sm font-semibold">{product.soldCount}</p>
          </div>
          <div>
            <div className="flex items-center justify-center mb-1">
              <BarChart3 className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-xs text-gray-600">Reviews</p>
            <p className="text-sm font-semibold">{product.reviewCount}</p>
          </div>
        </div>

        {/* SKU and Category */}
        <div className="mb-4">
          <p className="text-xs text-gray-500">SKU: {product.sku}</p>
          <p className="text-xs text-gray-500">Category: {product.category}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Link
            to={`/business/products/edit/${product._id}`}
            className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors text-sm text-center"
          >
            Edit
          </Link>
          <button
            onClick={() => handleToggleStatus(product._id, product.isActive)}
            className={`flex-1 px-3 py-2 rounded-md text-sm transition-colors ${
              product.isActive 
                ? 'bg-red-50 text-red-600 hover:bg-red-100'
                : 'bg-green-50 text-green-600 hover:bg-green-100'
            }`}
          >
            {product.isActive ? 'Deactivate' : 'Activate'}
          </button>
          <button
            onClick={() => {
              setProductToDelete(product._id);
              setShowDeleteModal(true);
            }}
            className="px-3 py-2 bg-gray-50 text-gray-600 rounded-md hover:bg-gray-100 transition-colors text-sm"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
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
                <Package className="w-6 h-6 mr-3 text-blue-600" />
                Product Management
              </h1>
              <p className="text-sm text-gray-600">
                Manage your product catalog and inventory
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/business/products/bulk-upload')}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm flex items-center space-x-2"
              >
                <Upload className="w-4 h-4" />
                <span>Bulk Upload</span>
              </button>
              <Link
                to="/business/products/add"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            {/* Search */}
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search products..."
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
                  {category === 'all' ? 'All Categories' : category}
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
              <option value="featured">Featured</option>
              <option value="low-stock">Low Stock</option>
            </select>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="name">Sort by Name</option>
              <option value="price">Sort by Price</option>
              <option value="stock">Sort by Stock</option>
              <option value="sold">Sort by Sales</option>
              <option value="rating">Sort by Rating</option>
            </select>

            {/* View Mode */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <Package className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <BarChart3 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedProducts.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {selectedProducts.length} products selected
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleBulkAction('activate')}
                    className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200"
                  >
                    Activate
                  </button>
                  <button
                    onClick={() => handleBulkAction('deactivate')}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
                  >
                    Deactivate
                  </button>
                  <button
                    onClick={() => handleBulkAction('delete')}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        {/* Empty State */}
        {sortedProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
            <p className="text-gray-500 mb-4">
              {products.length === 0 
                ? "You haven't added any products yet."
                : "No products match your current filters."
              }
            </p>
            <Link
              to="/business/products/add"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Product
            </Link>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <Trash2 className="w-6 h-6 text-red-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Delete Product</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this product? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setProductToDelete(null);
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => productToDelete && handleDeleteProduct(productToDelete)}
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

export default ProductManagementPage;
