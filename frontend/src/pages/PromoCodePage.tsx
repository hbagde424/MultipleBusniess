import React, { useState, useEffect } from 'react';
import { Tag, Copy, Clock, Users, DollarSign, Gift, Star, CheckCircle, XCircle } from 'lucide-react';

interface PromoCode {
  id: string;
  code: string;
  description: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderAmount: number;
  maxDiscount?: number;
  usageLimit: number;
  usedCount: number;
  validUsers: string[];
  startDate: string;
  endDate: string;
  isActive: boolean;
  businessId?: string;
  businessName?: string;
  categories?: string[];
}

const PromoCodePage: React.FC = () => {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'expired' | 'used'>('all');
  const [testCode, setTestCode] = useState('');
  const [testResult, setTestResult] = useState<any>(null);
  const [testLoading, setTestLoading] = useState(false);

  useEffect(() => {
    fetchPromoCodes();
  }, [filter]);

  const fetchPromoCodes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      
      if (filter !== 'all') {
        params.append('status', filter);
      }

      const response = await fetch(`/api/promo/available?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPromoCodes(data);
      }
    } catch (error) {
      console.error('Error fetching promo codes:', error);
    } finally {
      setLoading(false);
    }
  };

  const validatePromoCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testCode.trim()) return;

    try {
      setTestLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/promo/validate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          code: testCode.toUpperCase(),
          orderAmount: 1000 // Sample order amount for testing
        })
      });

      const result = await response.json();
      setTestResult(result);
    } catch (error) {
      console.error('Error validating promo code:', error);
      setTestResult({ 
        valid: false, 
        message: 'Failed to validate promo code' 
      });
    } finally {
      setTestLoading(false);
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    // You could add a toast notification here
    alert(`Promo code "${code}" copied to clipboard!`);
  };

  const getPromoStatus = (promo: PromoCode) => {
    const now = new Date();
    const startDate = new Date(promo.startDate);
    const endDate = new Date(promo.endDate);
    
    if (!promo.isActive) return 'inactive';
    if (now < startDate) return 'upcoming';
    if (now > endDate) return 'expired';
    if (promo.usedCount >= promo.usageLimit) return 'exhausted';
    return 'active';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'exhausted':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'expired':
        return 'Expired';
      case 'upcoming':
        return 'Upcoming';
      case 'exhausted':
        return 'Limit Reached';
      case 'inactive':
        return 'Inactive';
      default:
        return 'Unknown';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDiscountText = (promo: PromoCode) => {
    if (promo.type === 'percentage') {
      return `${promo.value}% OFF`;
    } else {
      return `₹${promo.value} OFF`;
    }
  };

  const getUsagePercentage = (promo: PromoCode) => {
    if (promo.usageLimit === 0) return 0;
    return (promo.usedCount / promo.usageLimit) * 100;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading promo codes...</p>
        </div>
      </div>
    );
  }

  const activePromos = promoCodes.filter(p => getPromoStatus(p) === 'active');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Promo Codes & Offers</h1>
            <p className="text-purple-100 mt-2">Save more with our exclusive discount codes</p>
            <div className="mt-4">
              <span className="inline-block bg-white text-purple-600 px-4 py-2 rounded-full font-semibold">
                {activePromos.length} Active Offers
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Promo Code Validator */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Promo Code</h3>
          <form onSubmit={validatePromoCode} className="flex space-x-4">
            <input
              type="text"
              value={testCode}
              onChange={(e) => setTestCode(e.target.value.toUpperCase())}
              placeholder="Enter promo code"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="submit"
              disabled={testLoading || !testCode.trim()}
              className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400"
            >
              {testLoading ? 'Validating...' : 'Test Code'}
            </button>
          </form>
          
          {testResult && (
            <div className={`mt-4 p-4 rounded-lg ${
              testResult.valid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-center space-x-2">
                {testResult.valid ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <span className={`font-medium ${
                  testResult.valid ? 'text-green-800' : 'text-red-800'
                }`}>
                  {testResult.message}
                </span>
              </div>
              {testResult.valid && testResult.discount && (
                <p className="text-green-700 mt-2">
                  Discount: ₹{testResult.discount} on order of ₹1000
                </p>
              )}
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="p-4 border-b border-gray-200">
            <div className="flex space-x-4">
              {[
                { id: 'all', label: 'All Offers' },
                { id: 'active', label: 'Active' },
                { id: 'upcoming', label: 'Upcoming' },
                { id: 'expired', label: 'Expired' }
              ].map((filterOption) => (
                <button
                  key={filterOption.id}
                  onClick={() => setFilter(filterOption.id as any)}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    filter === filterOption.id
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {filterOption.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Promo Codes Grid */}
        {promoCodes.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <Tag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Promo Codes Found</h3>
            <p className="text-gray-600">
              {filter === 'active' 
                ? "No active promo codes available right now."
                : "Check back later for exciting offers and discounts!"
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {promoCodes.map((promo) => {
              const status = getPromoStatus(promo);
              const usagePercentage = getUsagePercentage(promo);
              
              return (
                <div key={promo.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                  {/* Promo Header */}
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Gift className="w-5 h-5" />
                        <span className="font-semibold text-lg">{getDiscountText(promo)}</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                        {getStatusText(status)}
                      </span>
                    </div>
                  </div>

                  {/* Promo Body */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="bg-gray-100 px-3 py-2 rounded border-2 border-dashed border-gray-300">
                        <span className="font-mono font-bold text-lg text-gray-900">{promo.code}</span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(promo.code)}
                        className="p-2 text-gray-400 hover:text-purple-600"
                        title="Copy code"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-gray-700 text-sm mb-4">{promo.description}</p>

                    {/* Promo Details */}
                    <div className="space-y-2 text-sm">
                      {promo.minOrderAmount > 0 && (
                        <div className="flex items-center space-x-2 text-gray-600">
                          <DollarSign className="w-4 h-4" />
                          <span>Min order: ₹{promo.minOrderAmount}</span>
                        </div>
                      )}

                      {promo.maxDiscount && promo.type === 'percentage' && (
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Star className="w-4 h-4" />
                          <span>Max discount: ₹{promo.maxDiscount}</span>
                        </div>
                      )}

                      <div className="flex items-center space-x-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>Valid till {formatDate(promo.endDate)}</span>
                      </div>

                      {promo.businessName && (
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Tag className="w-4 h-4" />
                          <span>Valid at {promo.businessName}</span>
                        </div>
                      )}
                    </div>

                    {/* Usage Progress */}
                    {promo.usageLimit > 0 && (
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                          <span>Used</span>
                          <span>{promo.usedCount} / {promo.usageLimit}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Action Button */}
                    <div className="mt-4">
                      {status === 'active' ? (
                        <button
                          onClick={() => copyToClipboard(promo.code)}
                          className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition-colors"
                        >
                          Copy & Use Code
                        </button>
                      ) : (
                        <button
                          disabled
                          className="w-full bg-gray-300 text-gray-500 py-2 rounded-md cursor-not-allowed"
                        >
                          {status === 'expired' ? 'Expired' :
                           status === 'upcoming' ? 'Coming Soon' :
                           status === 'exhausted' ? 'Limit Reached' : 'Not Available'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* How to Use Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">How to Use Promo Codes</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Copy className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">1. Copy Code</h4>
              <p className="text-sm text-gray-600">Click on any promo code to copy it to your clipboard</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Tag className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">2. Shop & Checkout</h4>
              <p className="text-sm text-gray-600">Add items to cart and proceed to checkout</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">3. Apply & Save</h4>
              <p className="text-sm text-gray-600">Paste the code at checkout and enjoy your discount</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoCodePage;
