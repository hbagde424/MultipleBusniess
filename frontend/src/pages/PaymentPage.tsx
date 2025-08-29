import React, { useState, useEffect } from 'react';
import { CreditCard, Smartphone, Wallet, Building, Check, AlertCircle, History, Download } from 'lucide-react';

interface PaymentMethod {
  id: string;
  type: 'card' | 'upi' | 'wallet' | 'netbanking';
  name: string;
  details: string;
  isDefault: boolean;
}

interface PaymentTransaction {
  id: string;
  orderId: string;
  amount: number;
  method: string;
  status: 'success' | 'failed' | 'pending' | 'refunded';
  transactionId: string;
  createdAt: string;
  refundAmount?: number;
}

const PaymentPage: React.FC = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'methods' | 'history'>('methods');
  const [showAddMethod, setShowAddMethod] = useState(false);
  
  const [newMethod, setNewMethod] = useState({
    type: 'card' as PaymentMethod['type'],
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    holderName: '',
    upiId: '',
    walletType: '',
    bankName: ''
  });

  useEffect(() => {
    fetchPaymentData();
  }, []);

  const fetchPaymentData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      // Fetch saved payment methods
      const methodsResponse = await fetch('/api/payments/methods', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (methodsResponse.ok) {
        const methodsData = await methodsResponse.json();
        setPaymentMethods(methodsData);
      }

      // Fetch payment history
      const historyResponse = await fetch('/api/payments/history', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (historyResponse.ok) {
        const historyData = await historyResponse.json();
        setTransactions(historyData);
      }
    } catch (error) {
      console.error('Error fetching payment data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPaymentMethod = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      let methodData: any = {
        type: newMethod.type
      };

      switch (newMethod.type) {
        case 'card':
          methodData = {
            ...methodData,
            name: `**** ${newMethod.cardNumber.slice(-4)}`,
            details: `${newMethod.holderName} • Expires ${newMethod.expiryMonth}/${newMethod.expiryYear}`,
            cardNumber: newMethod.cardNumber,
            expiryMonth: newMethod.expiryMonth,
            expiryYear: newMethod.expiryYear,
            holderName: newMethod.holderName
          };
          break;
        case 'upi':
          methodData = {
            ...methodData,
            name: newMethod.upiId,
            details: 'UPI Payment'
          };
          break;
        case 'wallet':
          methodData = {
            ...methodData,
            name: newMethod.walletType,
            details: 'Digital Wallet'
          };
          break;
        case 'netbanking':
          methodData = {
            ...methodData,
            name: newMethod.bankName,
            details: 'Net Banking'
          };
          break;
      }

      const response = await fetch('/api/payments/methods', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(methodData)
      });

      if (response.ok) {
        setShowAddMethod(false);
        setNewMethod({
          type: 'card',
          cardNumber: '',
          expiryMonth: '',
          expiryYear: '',
          cvv: '',
          holderName: '',
          upiId: '',
          walletType: '',
          bankName: ''
        });
        fetchPaymentData();
      }
    } catch (error) {
      console.error('Error adding payment method:', error);
    }
  };

  const handleSetDefault = async (methodId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/payments/methods/${methodId}/default`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        fetchPaymentData();
      }
    } catch (error) {
      console.error('Error setting default payment method:', error);
    }
  };

  const handleDeleteMethod = async (methodId: string) => {
    if (!confirm('Are you sure you want to delete this payment method?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/payments/methods/${methodId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        fetchPaymentData();
      }
    } catch (error) {
      console.error('Error deleting payment method:', error);
    }
  };

  const downloadInvoice = async (transactionId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/payments/${transactionId}/invoice`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice-${transactionId}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error downloading invoice:', error);
    }
  };

  const getPaymentIcon = (type: string) => {
    switch (type) {
      case 'card':
        return <CreditCard className="w-6 h-6" />;
      case 'upi':
        return <Smartphone className="w-6 h-6" />;
      case 'wallet':
        return <Wallet className="w-6 h-6" />;
      case 'netbanking':
        return <Building className="w-6 h-6" />;
      default:
        return <CreditCard className="w-6 h-6" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'refunded':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payment information...</p>
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
            <h1 className="text-2xl font-bold text-gray-900">Payment Settings</h1>
            <p className="text-sm text-gray-600">Manage your payment methods and view transaction history</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'methods', label: 'Payment Methods', icon: CreditCard },
                { id: 'history', label: 'Transaction History', icon: History }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {/* Payment Methods Tab */}
            {activeTab === 'methods' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Saved Payment Methods</h3>
                  <button
                    onClick={() => setShowAddMethod(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add Payment Method
                  </button>
                </div>

                {paymentMethods.length === 0 ? (
                  <div className="text-center py-12">
                    <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Payment Methods</h3>
                    <p className="text-gray-600 mb-6">Add a payment method to make checkout faster</p>
                    <button
                      onClick={() => setShowAddMethod(true)}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Add Your First Method
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {paymentMethods.map((method) => (
                      <div key={method.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="text-gray-600">
                            {getPaymentIcon(method.type)}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{method.name}</h4>
                            <p className="text-sm text-gray-600">{method.details}</p>
                          </div>
                          {method.isDefault && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {!method.isDefault && (
                            <button
                              onClick={() => handleSetDefault(method.id)}
                              className="px-3 py-1 text-blue-600 border border-blue-600 rounded text-sm hover:bg-blue-50"
                            >
                              Set Default
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteMethod(method.id)}
                            className="px-3 py-1 text-red-600 border border-red-600 rounded text-sm hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Transaction History Tab */}
            {activeTab === 'history' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Transaction History</h3>
                
                {transactions.length === 0 ? (
                  <div className="text-center py-12">
                    <History className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Transactions</h3>
                    <p className="text-gray-600">Your payment history will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {transactions.map((transaction) => (
                      <div key={transaction.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-gray-900">
                                Order #{transaction.orderId}
                              </h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                                {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                              <div>
                                <span className="font-medium">Amount:</span> ₹{transaction.amount}
                                {transaction.refundAmount && (
                                  <span className="text-blue-600"> (₹{transaction.refundAmount} refunded)</span>
                                )}
                              </div>
                              <div>
                                <span className="font-medium">Method:</span> {transaction.method}
                              </div>
                              <div>
                                <span className="font-medium">Date:</span> {formatDate(transaction.createdAt)}
                              </div>
                            </div>
                            
                            <div className="mt-2 text-xs text-gray-500">
                              Transaction ID: {transaction.transactionId}
                            </div>
                          </div>
                          
                          {transaction.status === 'success' && (
                            <button
                              onClick={() => downloadInvoice(transaction.id)}
                              className="ml-4 p-2 text-gray-600 hover:text-blue-600"
                              title="Download Invoice"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Payment Method Modal */}
      {showAddMethod && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Add Payment Method</h3>
              
              <form onSubmit={handleAddPaymentMethod} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Type</label>
                  <select
                    value={newMethod.type}
                    onChange={(e) => setNewMethod({ ...newMethod, type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="card">Credit/Debit Card</option>
                    <option value="upi">UPI</option>
                    <option value="wallet">Digital Wallet</option>
                    <option value="netbanking">Net Banking</option>
                  </select>
                </div>

                {newMethod.type === 'card' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                      <input
                        type="text"
                        value={newMethod.cardNumber}
                        onChange={(e) => setNewMethod({ ...newMethod, cardNumber: e.target.value })}
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Month</label>
                        <input
                          type="text"
                          value={newMethod.expiryMonth}
                          onChange={(e) => setNewMethod({ ...newMethod, expiryMonth: e.target.value })}
                          placeholder="MM"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Year</label>
                        <input
                          type="text"
                          value={newMethod.expiryYear}
                          onChange={(e) => setNewMethod({ ...newMethod, expiryYear: e.target.value })}
                          placeholder="YY"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
                      <input
                        type="text"
                        value={newMethod.holderName}
                        onChange={(e) => setNewMethod({ ...newMethod, holderName: e.target.value })}
                        placeholder="John Doe"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </>
                )}

                {newMethod.type === 'upi' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">UPI ID</label>
                    <input
                      type="text"
                      value={newMethod.upiId}
                      onChange={(e) => setNewMethod({ ...newMethod, upiId: e.target.value })}
                      placeholder="username@paytm"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                )}

                {newMethod.type === 'wallet' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Wallet Type</label>
                    <select
                      value={newMethod.walletType}
                      onChange={(e) => setNewMethod({ ...newMethod, walletType: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Wallet</option>
                      <option value="Paytm">Paytm</option>
                      <option value="PhonePe">PhonePe</option>
                      <option value="Google Pay">Google Pay</option>
                      <option value="Amazon Pay">Amazon Pay</option>
                    </select>
                  </div>
                )}

                {newMethod.type === 'netbanking' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name</label>
                    <input
                      type="text"
                      value={newMethod.bankName}
                      onChange={(e) => setNewMethod({ ...newMethod, bankName: e.target.value })}
                      placeholder="State Bank of India"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                )}

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddMethod(false)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Add Method
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

export default PaymentPage;
