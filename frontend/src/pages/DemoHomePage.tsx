import React, { useState, useEffect } from 'react';
import { apiService } from '../services/enhancedApiService';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { 
  Search, Filter, MapPin, Clock, Star, Heart, ShoppingCart,
  Utensils, Coffee, Pizza, Truck, Phone, Mail, Globe
} from 'lucide-react';

interface Business {
  id: string;
  name: string;
  description: string;
  category: string;
  image: string;
  rating: number;
  totalReviews: number;
  deliveryTime: string;
  deliveryFee: number;
  minOrder: number;
  isOpen: boolean;
  cuisine: string[];
  address: string;
  phone: string;
  email: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  businessId: string;
  isVegetarian: boolean;
  isSpicy: boolean;
  isPopular: boolean;
  rating: number;
  reviews: number;
}

const DemoHomePage: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [apiStatus, setApiStatus] = useState<any>(null);

  const categories = [
    { id: 'all', name: 'All', icon: Utensils },
    { id: 'Indian', name: 'Indian', icon: Utensils },
    { id: 'Italian', name: 'Italian', icon: Pizza },
    { id: 'Street Food', name: 'Street Food', icon: Coffee },
    { id: 'Biryani', name: 'Biryani', icon: Utensils }
  ];

  useEffect(() => {
    loadData();
    setApiStatus(apiService.getApiStatus());
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [businessResponse, productResponse] = await Promise.all([
        apiService.getBusinesses(),
        apiService.getProducts()
      ]);

      if (businessResponse.success) {
        setBusinesses(businessResponse.businesses);
      }

      if (productResponse.success) {
        setProducts(productResponse.products);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadData();
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.search(searchQuery);
      if (response.success) {
        setBusinesses(response.businesses || []);
        setProducts(response.products || []);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryFilter = async (category: string) => {
    setSelectedCategory(category);
    setLoading(true);
    
    try {
      const filters = category === 'all' ? {} : { category };
      const response = await apiService.getBusinesses(filters);
      
      if (response.success) {
        setBusinesses(response.businesses);
      }
    } catch (error) {
      console.error('Filter error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBusinesses = businesses.filter(business => {
    if (selectedCategory === 'all') return true;
    return business.category === selectedCategory || 
           business.cuisine.includes(selectedCategory);
  });

  const popularProducts = products.filter(product => product.isPopular).slice(0, 6);

  if (loading && businesses.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading demo data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Tifine Demo
              </h1>
              
              {/* API Status Indicator */}
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  apiStatus?.mode === 'mock' ? 'bg-yellow-500' : 'bg-green-500'
                }`}></div>
                <span className="text-sm text-gray-600">
                  {apiStatus?.mode === 'mock' ? 'Demo Mode' : 'Live API'}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="secondary">
                <Heart className="h-4 w-4 mr-2" />
                Wishlist
              </Button>
              <Button>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Cart
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Delicious Food, Delivered Fast
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Discover amazing restaurants and cuisines in your area
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto bg-white rounded-lg p-2 flex">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search for restaurants, cuisines, or dishes..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                onKeyPress={(e: React.KeyboardEvent) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
                className="pl-10 border-0 text-gray-900"
              />
            </div>
            <Button onClick={handleSearch} className="ml-2">
              Search
            </Button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Category Filter */}
        <section className="mb-8">
          <h3 className="text-2xl font-bold mb-4">Browse Categories</h3>
          <div className="flex space-x-4 overflow-x-auto pb-2">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategoryFilter(category.id)}
                  className={`flex flex-col items-center p-4 rounded-lg min-w-[100px] transition-all ${
                    selectedCategory === category.id
                      ? 'bg-purple-100 text-purple-600 border-2 border-purple-300'
                      : 'bg-white hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  <IconComponent className="h-8 w-8 mb-2" />
                  <span className="text-sm font-medium">{category.name}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Popular Dishes */}
        {popularProducts.length > 0 && (
          <section className="mb-8">
            <h3 className="text-2xl font-bold mb-4">Popular Dishes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-lg">{product.name}</h4>
                      {product.isVegetarian && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                          Veg
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-lg">₹{product.price}</span>
                        {product.originalPrice && (
                          <span className="text-gray-500 line-through text-sm">
                            ₹{product.originalPrice}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm">{product.rating}</span>
                        <span className="text-gray-500 text-sm">({product.reviews})</span>
                      </div>
                    </div>
                    <Button className="w-full mt-3" size="sm">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Restaurants */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold">
              {selectedCategory === 'all' ? 'All Restaurants' : `${selectedCategory} Restaurants`}
            </h3>
            <div className="text-sm text-gray-600">
              {filteredBusinesses.length} restaurants found
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                  <div className="w-full h-48 bg-gray-200"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredBusinesses.length === 0 ? (
            <div className="text-center py-12">
              <Utensils className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-600 mb-2">
                No restaurants found
              </h4>
              <p className="text-gray-500">
                {searchQuery 
                  ? `No results for "${searchQuery}". Try a different search term.`
                  : `No ${selectedCategory} restaurants available in this area.`
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBusinesses.map((business) => (
                <div key={business.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img
                      src={business.image}
                      alt={business.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        business.isOpen 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {business.isOpen ? 'Open' : 'Closed'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-lg">{business.name}</h4>
                      <button className="text-gray-400 hover:text-red-500 transition-colors">
                        <Heart className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {business.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {business.cuisine.slice(0, 3).map((cuisine, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                        >
                          {cuisine}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span>{business.rating}</span>
                        <span>({business.totalReviews})</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{business.deliveryTime}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm mb-4">
                      <span>₹{business.deliveryFee} delivery</span>
                      <span>Min order ₹{business.minOrder}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-xs text-gray-500 mb-4">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{business.address}</span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button className="flex-1" size="sm">
                        View Menu
                      </Button>
                      <Button variant="secondary" size="sm">
                        <Phone className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Demo Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">Tifine Multi-Business Platform</h3>
          <p className="text-gray-400 mb-4">
            This is a demo version with sample data. All features are fully functional!
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4" />
              <span>Demo Mode Active</span>
            </div>
            <div className="flex items-center space-x-2">
              <Truck className="h-4 w-4" />
              <span>{businesses.length} Demo Restaurants</span>
            </div>
            <div className="flex items-center space-x-2">
              <Utensils className="h-4 w-4" />
              <span>{products.length} Demo Dishes</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DemoHomePage;
