import React, { useState, useEffect } from 'react';
import { Star, User, Calendar, ThumbsUp, Reply, Flag, ChevronDown, ChevronUp } from 'lucide-react';

interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  productId?: string;
  productName?: string;
  businessId?: string;
  businessName?: string;
  rating: number;
  comment: string;
  images?: string[];
  isVerified: boolean;
  helpfulVotes: number;
  hasVotedHelpful: boolean;
  businessReply?: {
    message: string;
    repliedAt: string;
  };
  status: 'active' | 'pending' | 'hidden';
  createdAt: string;
}

interface ReviewFormData {
  rating: number;
  comment: string;
  images: File[];
}

const ReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<'all' | 'product' | 'business'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'rating_high' | 'rating_low' | 'helpful'>('newest');
  
  const [reviewForm, setReviewForm] = useState<ReviewFormData>({
    rating: 0,
    comment: '',
    images: []
  });

  useEffect(() => {
    fetchReviews();
  }, [filter, sortBy]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        filter,
        sort: sortBy
      });

      const response = await fetch(`http://localhost:5000/api/reviews/?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('📦 Raw backend data:', data);
        
        // Handle empty data or invalid format
        if (!Array.isArray(data)) {
          console.warn('⚠️ Backend returned non-array data:', data);
          setReviews([]);
          return;
        }
        
        // Transform backend data to match frontend interface
        const transformedReviews = data.map((review: any) => ({
          id: review._id || '',
          userId: review.user?._id || '',
          userName: review.user?.name || 'Anonymous User',
          userAvatar: review.user?.profileImage || '',
          productId: review.product?._id || '',
          productName: review.product?.name || 'Unknown Product',
          businessId: review.business?._id || '',
          businessName: review.business?.name || 'Unknown Business',
          rating: review.rating || 0,
          comment: review.comment || '',
          images: review.images || [],
          isVerified: true, // For demo purposes
          helpfulVotes: review.helpfulVotes?.length || 0,
          hasVotedHelpful: false, // Will be updated based on user
          businessReply: review.businessReply ? {
            message: review.businessReply.comment || '',
            repliedAt: review.businessReply.repliedAt || new Date().toISOString()
          } : undefined,
          status: 'active' as const,
          createdAt: review.createdAt || new Date().toISOString()
        }));
        
        console.log('✅ Transformed reviews:', transformedReviews);
        setReviews(transformedReviews);
      } else {
        console.error('❌ Failed to fetch reviews:', response.status);
        setReviews([]);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      
      // For demo purposes, using dummy IDs
      // In real app, these would come from props or URL params
      const reviewData = {
        rating: reviewForm.rating,
        comment: reviewForm.comment,
        product: '67210f8a5c1234567890abc1', // Dummy product ID
        business: '67210f8a5c1234567890abc2', // Dummy business ID
      };

      const response = await fetch('http://localhost:5000/api/reviews/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reviewData)
      });

      if (response.ok) {
        setShowReviewForm(false);
        setReviewForm({ rating: 0, comment: '', images: [] });
        fetchReviews();
      } else {
        const error = await response.json();
        console.error('Review submission failed:', error);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const handleVoteHelpful = async (reviewId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/reviews/${reviewId}/helpful`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        fetchReviews(); // Refresh to get updated vote count
      }
    } catch (error) {
      console.error('Error voting helpful:', error);
    }
  };

  const toggleExpandReview = (reviewId: string) => {
    const newExpanded = new Set(expandedReviews);
    if (newExpanded.has(reviewId)) {
      newExpanded.delete(reviewId);
    } else {
      newExpanded.add(reviewId);
    }
    setExpandedReviews(newExpanded);
  };

  const renderStars = (rating: number, interactive: boolean = false, onRate?: (rating: number) => void) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={() => interactive && onRate && onRate(star)}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Reviews & Ratings</h1>
                <p className="text-sm text-gray-600">Share your experience and read what others say</p>
              </div>
              <button
                onClick={() => setShowReviewForm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Write Review
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Reviews</option>
                <option value="product">Product Reviews</option>
                <option value="business">Business Reviews</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="rating_high">Highest Rating</option>
                <option value="rating_low">Lowest Rating</option>
                <option value="helpful">Most Helpful</option>
              </select>
            </div>

            <div className="text-sm text-gray-600">
              {reviews.length} review{reviews.length !== 1 ? 's' : ''} found
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {reviews.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <Star className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Reviews Yet</h3>
            <p className="text-gray-600 mb-6">
              Be the first to share your experience with our community.
            </p>
            <button
              onClick={() => setShowReviewForm(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Write First Review
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                {/* Review Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                      {review.userAvatar ? (
                        <img src={review.userAvatar} alt={review.userName} className="w-10 h-10 rounded-full" />
                      ) : (
                        (review.userName || 'A').charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-gray-900">{review.userName}</p>
                        {review.isVerified && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            Verified
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        {renderStars(review.rating)}
                        <span className="text-sm text-gray-600">
                          {formatDate(review.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Flag className="w-4 h-4" />
                  </button>
                </div>

                {/* Product/Business Info */}
                {(review.productName || review.businessName) && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      Review for: <span className="font-medium text-gray-900">
                        {review.productName || review.businessName}
                      </span>
                    </p>
                  </div>
                )}

                {/* Review Content */}
                <div className="mb-4">
                  <p className={`text-gray-700 ${
                    expandedReviews.has(review.id) ? '' : 'line-clamp-3'
                  }`}>
                    {review.comment}
                  </p>
                  
                  {review.comment.length > 200 && (
                    <button
                      onClick={() => toggleExpandReview(review.id)}
                      className="text-blue-600 hover:text-blue-700 text-sm mt-2 flex items-center space-x-1"
                    >
                      <span>{expandedReviews.has(review.id) ? 'Show less' : 'Show more'}</span>
                      {expandedReviews.has(review.id) ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>

                {/* Review Images */}
                {review.images && review.images.length > 0 && (
                  <div className="mb-4">
                    <div className="flex space-x-2 overflow-x-auto">
                      {review.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Review image ${index + 1}`}
                          className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Business Reply */}
                {review.businessReply && (
                  <div className="mb-4 ml-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                    <div className="flex items-center space-x-2 mb-2">
                      <Reply className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">Business Response</span>
                      <span className="text-xs text-blue-600">
                        {formatDate(review.businessReply.repliedAt)}
                      </span>
                    </div>
                    <p className="text-blue-800 text-sm">{review.businessReply.message}</p>
                  </div>
                )}

                {/* Review Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleVoteHelpful(review.id)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm transition-colors ${
                      review.hasVotedHelpful
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>Helpful ({review.helpfulVotes})</span>
                  </button>

                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      review.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : review.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {review.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Form Modal */}
      {showReviewForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Write a Review</h3>
              
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </label>
                  {renderStars(reviewForm.rating, true, (rating) => 
                    setReviewForm({ ...reviewForm, rating })
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comment
                  </label>
                  <textarea
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Share your experience..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Images (Optional)
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => setReviewForm({ 
                      ...reviewForm, 
                      images: Array.from(e.target.files || []) 
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={reviewForm.rating === 0 || !reviewForm.comment.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewsPage;
