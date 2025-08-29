import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, MapPin, Star, Clock, DollarSign, X, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SearchFilters {
  query: string;
  category: string;
  location: string;
  priceRange: [number, number];
  rating: number;
  deliveryTime: number;
  sortBy: 'relevance' | 'rating' | 'price_low' | 'price_high' | 'distance' | 'popularity';
  businessType: 'all' | 'food' | 'grocery' | 'pharmacy' | 'electronics' | 'fashion';
  isVeg: boolean | null;
  openNow: boolean;
  hasOffers: boolean;
}

interface SearchResult {
  id: string;
  type: 'product' | 'business';
  name: string;
  description?: string;
  image: string;
  price?: number;
  rating: number;
  reviewCount: number;
  businessName?: string;
  businessId?: string;
  category: string;
  distance?: number;
  deliveryTime?: number;
  isVeg?: boolean;
  hasOffer?: boolean;
  offerText?: string;
}

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'query' | 'business' | 'product' | 'category';
  count?: number;
}

const AdvancedSearchPage: React.FC = () => {
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: '',
    location: '',
    priceRange: [0, 5000],
    rating: 0,
    deliveryTime: 60,
    sortBy: 'relevance',
    businessType: 'all',
    isVeg: null,
    openNow: false,
    hasOffers: false
  });

  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [trendingSearches, setTrendingSearches] = useState<string[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [resultCount, setResultCount] = useState(0);

  useEffect(() => {
    fetchTrendingSearches();
    fetchSearchHistory();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (filters.query.length > 2) {
        fetchSuggestions(filters.query);
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [filters.query]);

  useEffect(() => {
    if (filters.query || Object.values(filters).some(v => v !== '' && v !== null && v !== false && (Array.isArray(v) ? v[0] !== 0 || v[1] !== 5000 : v !== 0 && v !== 60 && v !== 'relevance' && v !== 'all'))) {
      performSearch();
    }
  }, [filters]);

  const fetchTrendingSearches = async () => {
    try {
      const response = await fetch('/api/search/trending');
      if (response.ok) {
        const data = await response.json();
        setTrendingSearches(data);
      }
    } catch (error) {
      console.error('Error fetching trending searches:', error);
    }
  };

  const fetchSearchHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('/api/search/history', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSearchHistory(data);
      }
    } catch (error) {
      console.error('Error fetching search history:', error);
    }
  };

  const fetchSuggestions = async (query: string) => {
    try {
      const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(query)}`);
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const performSearch = async () => {
    try {
      setLoading(true);
      
      const searchParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== '' && value !== false && 
            (Array.isArray(value) ? value[0] !== 0 || value[1] !== 5000 : 
             value !== 0 && value !== 60 && value !== 'relevance' && value !== 'all')) {
          if (Array.isArray(value)) {
            searchParams.append(key, value.join(','));
          } else {
            searchParams.append(key, value.toString());
          }
        }
      });

      const endpoints = [];
      
      // Search products
      endpoints.push(
        fetch(`/api/search/products?${searchParams}`)
          .then(res => res.ok ? res.json() : [])
          .then(data => data.map((item: any) => ({ ...item, type: 'product' })))
      );

      // Search businesses
      endpoints.push(
        fetch(`/api/search/businesses?${searchParams}`)
          .then(res => res.ok ? res.json() : [])
          .then(data => data.map((item: any) => ({ ...item, type: 'business' })))
      );

      const [productResults, businessResults] = await Promise.all(endpoints);
      
      const combinedResults = [...productResults, ...businessResults];
      setResults(combinedResults);
      setResultCount(combinedResults.length);

      // Save search to history
      if (filters.query && !searchHistory.includes(filters.query)) {
        saveSearchToHistory(filters.query);
      }
    } catch (error) {
      console.error('Error performing search:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSearchToHistory = async (query: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      await fetch('/api/search/history', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query })
      });
      
      setSearchHistory(prev => [query, ...prev.filter(item => item !== query)].slice(0, 10));
    } catch (error) {
      console.error('Error saving search to history:', error);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    if (filters.query.trim()) {
      performSearch();
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setFilters(prev => ({ ...prev, query: suggestion.text }));
    setShowSuggestions(false);
    searchInputRef.current?.blur();
  };

  const handleTrendingClick = (search: string) => {
    setFilters(prev => ({ ...prev, query: search }));
    setShowSuggestions(false);
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      category: '',
      location: '',
      priceRange: [0, 5000],
      rating: 0,
      deliveryTime: 60,
      sortBy: 'relevance',
      businessType: 'all',
      isVeg: null,
      openNow: false,
      hasOffers: false
    });
    setResults([]);
  };

  const handleResultClick = (result: SearchResult) => {
    if (result.type === 'product') {
      navigate(`/products/${result.id}`);
    } else {
      navigate(`/businesses/${result.id}`);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="relative">
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={filters.query}
                  onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
                  onFocus={() => setShowSuggestions(suggestions.length > 0)}
                  placeholder="Search for products, businesses, or categories..."
                  className="w-full pl-10 pr-20 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowFilters(!showFilters)}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <Filter className="w-5 h-5" />
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                  >
                    {loading ? 'Searching...' : 'Search'}
                  </button>
                </div>
              </div>
            </form>

            {/* Search Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <Search className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{suggestion.text}</span>
                      <span className="text-xs text-gray-500 capitalize">{suggestion.type}</span>
                    </div>
                    {suggestion.count && (
                      <span className="text-xs text-gray-400">{suggestion.count} results</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Trending Searches */}
          {!filters.query && trendingSearches.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Trending Searches:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {trendingSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleTrendingClick(search)}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search History */}
          {!filters.query && searchHistory.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Recent Searches:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {searchHistory.slice(0, 5).map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleTrendingClick(search)}
                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm hover:bg-blue-100"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Business Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Type</label>
                <select
                  value={filters.businessType}
                  onChange={(e) => setFilters(prev => ({ ...prev, businessType: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Businesses</option>
                  <option value="food">Food & Restaurants</option>
                  <option value="grocery">Grocery Stores</option>
                  <option value="pharmacy">Pharmacies</option>
                  <option value="electronics">Electronics</option>
                  <option value="fashion">Fashion</option>
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={filters.location}
                    onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Enter location"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range: ₹{filters.priceRange[0]} - ₹{filters.priceRange[1]}
                </label>
                <input
                  type="range"
                  min="0"
                  max="5000"
                  step="100"
                  value={filters.priceRange[1]}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    priceRange: [prev.priceRange[0], parseInt(e.target.value)]
                  }))}
                  className="w-full"
                />
              </div>

              {/* Minimum Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
                <select
                  value={filters.rating}
                  onChange={(e) => setFilters(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="0">Any Rating</option>
                  <option value="3">3+ Stars</option>
                  <option value="4">4+ Stars</option>
                  <option value="5">5 Stars</option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="relevance">Relevance</option>
                  <option value="rating">Highest Rating</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="distance">Nearest First</option>
                  <option value="popularity">Most Popular</option>
                </select>
              </div>

              {/* Checkboxes */}
              <div className="col-span-1 md:col-span-2 lg:col-span-3">
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.openNow}
                      onChange={(e) => setFilters(prev => ({ ...prev, openNow: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">Open Now</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.hasOffers}
                      onChange={(e) => setFilters(prev => ({ ...prev, hasOffers: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">Has Offers</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.isVeg === true}
                      onChange={(e) => setFilters(prev => ({ ...prev, isVeg: e.target.checked ? true : null }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">Vegetarian Only</span>
                  </label>
                </div>
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center space-x-2"
                >
                  <X className="w-4 h-4" />
                  <span>Clear All</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Searching...</p>
          </div>
        ) : results.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                Found {resultCount} result{resultCount !== 1 ? 's' : ''} 
                {filters.query && ` for "${filters.query}"`}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {results.map((result) => (
                <div
                  key={`${result.type}-${result.id}`}
                  onClick={() => handleResultClick(result)}
                  className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
                >
                  <div className="relative">
                    <img
                      src={result.image || '/placeholder.jpg'}
                      alt={result.name}
                      className="w-full h-48 object-cover"
                    />
                    {result.hasOffer && result.offerText && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                        {result.offerText}
                      </div>
                    )}
                    {result.isVeg !== undefined && (
                      <div className={`absolute top-2 right-2 w-4 h-4 border-2 ${
                        result.isVeg ? 'border-green-500' : 'border-red-500'
                      } rounded-sm flex items-center justify-center`}>
                        <div className={`w-2 h-2 rounded-full ${
                          result.isVeg ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{result.name}</h3>
                    
                    {result.type === 'product' && result.businessName && (
                      <p className="text-sm text-gray-600 mb-2">{result.businessName}</p>
                    )}
                    
                    {result.description && (
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{result.description}</p>
                    )}

                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-1">
                        {renderStars(result.rating)}
                        <span className="text-sm text-gray-600">({result.reviewCount})</span>
                      </div>
                      
                      {result.price && (
                        <span className="font-semibold text-gray-900">₹{result.price}</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span className="capitalize">{result.category}</span>
                      {result.deliveryTime && (
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{result.deliveryTime} min</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : filters.query || Object.values(filters).some(v => v !== '' && v !== null && v !== false && (Array.isArray(v) ? v[0] !== 0 || v[1] !== 5000 : v !== 0 && v !== 60 && v !== 'relevance' && v !== 'all')) ? (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search criteria or browse our categories.
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Clear Filters
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default AdvancedSearchPage;
