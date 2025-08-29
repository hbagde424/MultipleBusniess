import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '../components/ui';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  rating: number;
  reviewCount: number;
  availability: boolean;
  stock?: number;
}

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
  website?: string;
  logo?: string;
  images: string[];
  isActive: boolean;
  isVerified: boolean;
  deliveryRadius: number;
  minOrderAmount: number;
  deliveryCharge: number;
  businessHours: Array<{
    day: string;
    isOpen: boolean;
    openTime: string;
    closeTime: string;
  }>;
  owner: {
    name: string;
    email: string;
  };
}

const BusinessDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [business, setBusiness] = useState<Business | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('products');

  useEffect(() => {
    if (id) {
      fetchBusinessDetails();
    }
  }, [id]);

  const fetchBusinessDetails = async () => {
    try {
      setLoading(true);
      
      // Fetch business details
      const businessResponse = await fetch(`http://localhost:5000/api/businesses/${id}`);
      
      if (businessResponse.ok) {
        const businessData = await businessResponse.json();
        console.log('📦 Business details loaded:', businessData);
        setBusiness(businessData);
      } else {
        console.error('Failed to fetch business details');
      }

      // TODO: Fetch business products
      // const productsResponse = await fetch(`http://localhost:5000/api/products/business/${id}`);
      // if (productsResponse.ok) {
      //   const productsData = await productsResponse.json();
      //   setProducts(productsData);
      // }
      
    } catch (error) {
      console.error('Error fetching business details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading business details...</p>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Business not found</h2>
          <Link to="/businesses" className="text-blue-600 hover:text-blue-800">
            ← Back to businesses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Business Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-1/3">
              <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                {business.images.length > 0 ? (
                  <img
                    src={business.images[0]}
                    alt={business.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-6xl">🏪</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="lg:w-2/3">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                  {business.category}
                </span>
                {business.isActive && (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                    Open
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl font-bold mb-3">{business.name}</h1>
              <p className="text-gray-600 mb-4">{business.description}</p>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  <span className="text-yellow-400 text-lg">★</span>
                  <span className="ml-1 font-semibold">{business.rating.toFixed(1)}</span>
                  <span className="ml-1 text-gray-600">({business.totalReviews} reviews)</span>
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <span className="w-4 h-4 mr-2">📍</span>
                  <span>{business.address}</span>
                </div>
                <div className="flex items-center">
                  <span className="w-4 h-4 mr-2">📞</span>
                  <span>{business.phone}</span>
                </div>
                <div className="flex items-center">
                  <span className="w-4 h-4 mr-2">✉️</span>
                  <span>{business.email}</span>
                </div>
                {business.website && (
                  <div className="flex items-center">
                    <span className="w-4 h-4 mr-2">🌐</span>
                    <a href={business.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {business.website}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="container mx-auto px-4 py-6">
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('products')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'products'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Products ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'reviews'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Reviews
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'about'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              About
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'products' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.length > 0 ? (
              products.map((product) => (
                <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="aspect-square bg-gray-200">
                    {product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-4xl">📦</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold mb-2 line-clamp-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-green-600">₹{product.price}</span>
                      <div className="flex items-center text-sm">
                        <span className="text-yellow-400">★</span>
                        <span className="ml-1">{product.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    
                    <Button 
                      variant="primary" 
                      size="sm" 
                      className="w-full"
                      disabled={!product.availability}
                    >
                      {product.availability ? 'Add to Cart' : 'Out of Stock'}
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No products yet</h3>
                <p className="text-gray-500">This business hasn't added any products yet.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⭐</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Reviews coming soon</h3>
            <p className="text-gray-500">Customer reviews will be displayed here.</p>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="max-w-3xl">
            <h3 className="text-xl font-semibold mb-4">About {business.name}</h3>
            <p className="text-gray-600 mb-6">{business.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Contact Information</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>📞 {business.phone}</div>
                  <div>✉️ {business.email}</div>
                  {business.website && (
                    <div>🌐 <a href={business.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{business.website}</a></div>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Address</h4>
                <div className="text-sm text-gray-600">
                  <div>{business.address}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessDetailPage;
