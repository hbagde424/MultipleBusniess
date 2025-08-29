import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface AIRecommendation {
  id: string;
  productId: string;
  productName: string;
  reason: string;
  confidence: number;
  image: string;
  price: number;
  rating: number;
}

interface UserBehavior {
  viewedProducts: string[];
  purchaseHistory: string[];
  searchTerms: string[];
  preferences: {
    cuisine: string[];
    priceRange: string;
    rating: number;
  };
}

export const AIRecommendationEngine: React.FC = () => {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [userBehavior, setUserBehavior] = useState<UserBehavior | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai/recommendations', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setRecommendations(data.recommendations || []);
        setUserBehavior(data.userBehavior || null);
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
    setLoading(false);
  };

  const trackInteraction = async (productId: string, action: string) => {
    try {
      await fetch('/api/ai/track-interaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          productId,
          action, // 'view', 'click', 'add_to_cart', 'purchase'
          timestamp: new Date()
        })
      });
    } catch (error) {
      console.error('Error tracking interaction:', error);
    }
  };

  const refreshRecommendations = async () => {
    try {
      await fetch('/api/ai/refresh-recommendations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchRecommendations();
    } catch (error) {
      console.error('Error refreshing recommendations:', error);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const getReasonIcon = (reason: string) => {
    switch (reason) {
      case 'frequently_bought': return '🔄';
      case 'similar_users': return '👥';
      case 'trending': return '🔥';
      case 'price_drop': return '💰';
      case 'recently_viewed': return '👀';
      case 'seasonal': return '🍂';
      default: return '⭐';
    }
  };

  const getReasonText = (reason: string) => {
    switch (reason) {
      case 'frequently_bought': return 'Frequently bought together';
      case 'similar_users': return 'Popular with similar users';
      case 'trending': return 'Trending in your area';
      case 'price_drop': return 'Price dropped recently';
      case 'recently_viewed': return 'Based on your recent views';
      case 'seasonal': return 'Perfect for this season';
      default: return 'Recommended for you';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">AI-Powered Recommendations</h1>
          <p className="text-gray-600 mt-2">Personalized suggestions just for you</p>
        </div>
        <Button 
          onClick={refreshRecommendations}
          className="bg-blue-500 hover:bg-blue-600"
        >
          🔄 Refresh Recommendations
        </Button>
      </div>

      {/* User Behavior Insights */}
      {userBehavior && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Your Preferences</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Favorite Cuisines</h3>
              <div className="flex flex-wrap gap-2">
                {userBehavior.preferences.cuisine.map((cuisine) => (
                  <span 
                    key={cuisine}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {cuisine}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Price Range</h3>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                {userBehavior.preferences.priceRange}
              </span>
            </div>
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Minimum Rating</h3>
              <div className="flex items-center">
                <span className="text-yellow-500">
                  {'★'.repeat(Math.floor(userBehavior.preferences.rating))}
                </span>
                <span className="ml-1 text-gray-600">
                  {userBehavior.preferences.rating}+
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {['all', 'trending', 'similar_users', 'frequently_bought', 'price_drop'].map((category) => (
            <Button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`${
                selectedCategory === category
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category === 'all' ? 'All Recommendations' : getReasonText(category)}
            </Button>
          ))}
        </div>
      </div>

      {/* Recommendations Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="text-lg text-gray-500">Loading personalized recommendations...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {recommendations
            .filter(rec => selectedCategory === 'all' || rec.reason === selectedCategory)
            .map((recommendation) => (
              <div 
                key={recommendation.id} 
                className="bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => trackInteraction(recommendation.productId, 'click')}
              >
                <div className="relative">
                  <img
                    src={recommendation.image || '/placeholder-food.jpg'}
                    alt={recommendation.productName}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-2 right-2 bg-white rounded-full px-2 py-1 text-xs font-semibold">
                    {(recommendation.confidence * 100).toFixed(0)}% match
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{recommendation.productName}</h3>
                  
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold text-green-600">
                      ₹{recommendation.price}
                    </span>
                    <div className="flex items-center">
                      <span className="text-yellow-500">★</span>
                      <span className="ml-1 text-gray-600">{recommendation.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600 mb-3">
                    <span className="mr-2">{getReasonIcon(recommendation.reason)}</span>
                    <span>{getReasonText(recommendation.reason)}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-sm py-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        trackInteraction(recommendation.productId, 'add_to_cart');
                      }}
                    >
                      Add to Cart
                    </Button>
                    <Button 
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        trackInteraction(recommendation.productId, 'view');
                      }}
                    >
                      👀
                    </Button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      {recommendations.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-lg text-gray-500 mb-4">
            No recommendations available yet
          </div>
          <p className="text-gray-400">
            Browse some products to get personalized recommendations!
          </p>
        </div>
      )}

      {/* AI Insights */}
      <div className="mt-12 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">🤖 AI Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-700 mb-2">How it works</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Analyzes your browsing and purchase history</li>
              <li>• Learns from similar users' preferences</li>
              <li>• Considers trending items in your area</li>
              <li>• Factors in seasonal and time-based patterns</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Privacy</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Your data is anonymized and secure</li>
              <li>• Used only for improving recommendations</li>
              <li>• No personal information is shared</li>
              <li>• You can opt out anytime in settings</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIRecommendationEngine;
