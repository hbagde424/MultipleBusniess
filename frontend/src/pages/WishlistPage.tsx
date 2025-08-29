import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui';

interface WishlistItem {
  _id: string;
  productId: string;
  name: string;
  price: number;
  image?: string;
  businessId: string;
  businessName: string;
  availability: boolean;
  rating: number;
  discountPrice?: number;
}

const WishlistPage: React.FC = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch wishlist from API
    // fetchWishlist();
    setLoading(false);
  }, []);

  const removeFromWishlist = async (itemId: string) => {
    try {
      // TODO: Remove item from wishlist via API
      // await removeWishlistItem(itemId);
      setWishlistItems(prev => prev.filter(item => item._id !== itemId));
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
    }
  };

  const addToCart = async (item: WishlistItem) => {
    try {
      // TODO: Add item to cart via API
      // await addToCart(item.productId, 1);
      alert('Added to cart!');
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
          
          <div className="text-center py-12">
            <div className="text-8xl mb-6">❤️</div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-8">Save items you love to buy them later.</p>
            <Link to="/businesses">
              <Button variant="primary">Start Shopping</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">My Wishlist</h1>
          <span className="text-gray-600">{wishlistItems.length} items</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((item) => (
            <div key={item._id} className="bg-white rounded-lg shadow-md overflow-hidden relative">
              {/* Remove from wishlist button */}
              <button
                onClick={() => removeFromWishlist(item._id)}
                className="absolute top-2 right-2 z-10 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50"
              >
                <span className="text-red-500">❤️</span>
              </button>

              {/* Product Image */}
              <div className="aspect-square bg-gray-200 relative">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-4xl">📦</span>
                  </div>
                )}
                
                {!item.availability && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Out of Stock
                    </span>
                  </div>
                )}

                {item.discountPrice && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    {Math.round(((item.price - item.discountPrice) / item.price) * 100)}% OFF
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="font-semibold mb-2 line-clamp-2">{item.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{item.businessName}</p>
                
                <div className="flex items-center mb-3">
                  <span className="text-yellow-400 text-sm">★</span>
                  <span className="ml-1 text-sm text-gray-600">{item.rating.toFixed(1)}</span>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    {item.discountPrice ? (
                      <>
                        <span className="text-lg font-bold text-green-600">₹{item.discountPrice}</span>
                        <span className="text-sm text-gray-500 line-through">₹{item.price}</span>
                      </>
                    ) : (
                      <span className="text-lg font-bold text-green-600">₹{item.price}</span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full"
                    onClick={() => addToCart(item)}
                    disabled={!item.availability}
                  >
                    {item.availability ? 'Add to Cart' : 'Out of Stock'}
                  </Button>
                  
                  <Link
                    to={`/product/${item.productId}`}
                    className="block w-full text-center py-2 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Continue Shopping */}
        <div className="text-center mt-12">
          <Link to="/businesses">
            <Button variant="secondary">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
