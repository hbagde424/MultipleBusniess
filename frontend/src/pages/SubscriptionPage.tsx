import React, { useState, useEffect } from 'react';
import { Calendar, Package, Clock, CreditCard, RefreshCw, Pause, Play, X } from 'lucide-react';

interface SubscriptionItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  image?: string;
}

interface Subscription {
  id: string;
  businessId: string;
  businessName: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  items: SubscriptionItem[];
  startDate: string;
  nextDelivery: string;
  endDate?: string;
  isActive: boolean;
  pausedUntil?: string;
  totalOrders: number;
  totalAmount: number;
  createdAt: string;
}

const SubscriptionPage: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/subscriptions/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSubscriptions(data);
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePauseSubscription = async (subscriptionId: string) => {
    try {
      setActionLoading(subscriptionId);
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/subscriptions/${subscriptionId}/pause`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        fetchSubscriptions(); // Refresh the list
      }
    } catch (error) {
      console.error('Error pausing subscription:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleResumeSubscription = async (subscriptionId: string) => {
    try {
      setActionLoading(subscriptionId);
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/subscriptions/${subscriptionId}/resume`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        fetchSubscriptions(); // Refresh the list
      }
    } catch (error) {
      console.error('Error resuming subscription:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancelSubscription = async (subscriptionId: string) => {
    if (!window.confirm('Are you sure you want to cancel this subscription?')) {
      return;
    }

    try {
      setActionLoading(subscriptionId);
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/subscriptions/${subscriptionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        fetchSubscriptions(); // Refresh the list
      }
    } catch (error) {
      console.error('Error canceling subscription:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const getFrequencyText = (frequency: string) => {
    switch (frequency) {
      case 'daily':
        return 'Daily';
      case 'weekly':
        return 'Weekly';
      case 'monthly':
        return 'Monthly';
      default:
        return frequency;
    }
  };

  const getStatusColor = (subscription: Subscription) => {
    if (!subscription.isActive) {
      return 'bg-red-100 text-red-800';
    }
    if (subscription.pausedUntil) {
      return 'bg-yellow-100 text-yellow-800';
    }
    return 'bg-green-100 text-green-800';
  };

  const getStatusText = (subscription: Subscription) => {
    if (!subscription.isActive) {
      return 'Cancelled';
    }
    if (subscription.pausedUntil) {
      return 'Paused';
    }
    return 'Active';
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
          <p className="mt-4 text-gray-600">Loading subscriptions...</p>
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
            <h1 className="text-2xl font-bold text-gray-900">My Subscriptions</h1>
            <p className="text-sm text-gray-600">Manage your recurring orders and deliveries</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {subscriptions.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <RefreshCw className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Subscriptions Yet</h3>
            <p className="text-gray-600 mb-6">
              You haven't set up any recurring orders. Create a subscription to get your favorite items delivered automatically.
            </p>
            <button
              onClick={() => window.location.href = '/businesses'}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Businesses
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {subscriptions.map((subscription) => (
              <div key={subscription.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                {/* Subscription Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{subscription.businessName}</h3>
                      <p className="text-sm text-gray-600">
                        {getFrequencyText(subscription.frequency)} Subscription
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(subscription)}`}>
                        {getStatusText(subscription)}
                      </span>
                      <div className="flex items-center space-x-2">
                        {subscription.isActive && !subscription.pausedUntil && (
                          <button
                            onClick={() => handlePauseSubscription(subscription.id)}
                            disabled={actionLoading === subscription.id}
                            className="p-2 text-gray-400 hover:text-yellow-600 transition-colors"
                            title="Pause Subscription"
                          >
                            <Pause className="w-4 h-4" />
                          </button>
                        )}
                        {subscription.isActive && subscription.pausedUntil && (
                          <button
                            onClick={() => handleResumeSubscription(subscription.id)}
                            disabled={actionLoading === subscription.id}
                            className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                            title="Resume Subscription"
                          >
                            <Play className="w-4 h-4" />
                          </button>
                        )}
                        {subscription.isActive && (
                          <button
                            onClick={() => handleCancelSubscription(subscription.id)}
                            disabled={actionLoading === subscription.id}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                            title="Cancel Subscription"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subscription Details */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Next Delivery</p>
                        <p className="text-sm text-gray-600">{formatDate(subscription.nextDelivery)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Package className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Total Orders</p>
                        <p className="text-sm text-gray-600">{subscription.totalOrders} deliveries</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CreditCard className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Amount per Delivery</p>
                        <p className="text-sm text-gray-600">₹{subscription.totalAmount}</p>
                      </div>
                    </div>
                  </div>

                  {/* Subscription Items */}
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-4">Items in this Subscription</h4>
                    <div className="space-y-3">
                      {subscription.items.map((item, index) => (
                        <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                          <img
                            src={item.image || '/placeholder-product.jpg'}
                            alt={item.productName}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{item.productName}</p>
                            <p className="text-xs text-gray-600">Quantity: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">₹{item.price * item.quantity}</p>
                            <p className="text-xs text-gray-600">₹{item.price} each</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Subscription Timeline */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">
                          Started on {formatDate(subscription.startDate)}
                        </span>
                      </div>
                      {subscription.endDate && (
                        <span className="text-gray-600">
                          Ends on {formatDate(subscription.endDate)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Loading Overlay */}
                {actionLoading === subscription.id && (
                  <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="mt-2 text-sm text-gray-600">Processing...</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionPage;
