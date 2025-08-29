import React, { useState, useEffect } from 'react';
import { Trophy, Star, Gift, History, TrendingUp, Users, Coins, Calendar } from 'lucide-react';

interface LoyaltyPoint {
  id: string;
  points: number;
  type: 'earned' | 'redeemed' | 'expired' | 'bonus';
  reason: string;
  orderId?: string;
  expiresAt?: string;
  isActive: boolean;
  transactionId: string;
  createdAt: string;
}

interface LoyaltyStats {
  totalPoints: number;
  pointsEarned: number;
  pointsRedeemed: number;
  pointsExpiring: number;
  tier: string;
  nextTierPoints: number;
  rank: number;
}

interface RedemptionOption {
  id: string;
  title: string;
  description: string;
  pointsRequired: number;
  discount: number;
  type: 'percentage' | 'fixed';
  isAvailable: boolean;
}

const LoyaltyPage: React.FC = () => {
  const [loyaltyStats, setLoyaltyStats] = useState<LoyaltyStats>({
    totalPoints: 0,
    pointsEarned: 0,
    pointsRedeemed: 0,
    pointsExpiring: 0,
    tier: 'Bronze',
    nextTierPoints: 0,
    rank: 0
  });
  const [pointHistory, setPointHistory] = useState<LoyaltyPoint[]>([]);
  const [redemptionOptions, setRedemptionOptions] = useState<RedemptionOption[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'redeem' | 'leaderboard'>('overview');

  useEffect(() => {
    fetchLoyaltyData();
  }, []);

  const fetchLoyaltyData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      // Fetch loyalty points and stats
      const pointsResponse = await fetch('/api/loyalty/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (pointsResponse.ok) {
        const pointsData = await pointsResponse.json();
        setLoyaltyStats(pointsData.stats);
      }

      // Fetch points history
      const historyResponse = await fetch('/api/loyalty/history', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (historyResponse.ok) {
        const historyData = await historyResponse.json();
        setPointHistory(historyData);
      }

      // Fetch redemption options
      const redemptionResponse = await fetch('/api/loyalty/redemption-options', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (redemptionResponse.ok) {
        const redemptionData = await redemptionResponse.json();
        setRedemptionOptions(redemptionData);
      }

      // Fetch leaderboard
      const leaderboardResponse = await fetch('/api/loyalty/leaderboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (leaderboardResponse.ok) {
        const leaderboardData = await leaderboardResponse.json();
        setLeaderboard(leaderboardData);
      }
    } catch (error) {
      console.error('Error fetching loyalty data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRedeemPoints = async (optionId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/loyalty/redeem', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ optionId })
      });

      if (response.ok) {
        fetchLoyaltyData(); // Refresh data
        alert('Points redeemed successfully!');
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to redeem points');
      }
    } catch (error) {
      console.error('Error redeeming points:', error);
      alert('Failed to redeem points');
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'bronze':
        return 'text-orange-600 bg-orange-100';
      case 'silver':
        return 'text-gray-600 bg-gray-100';
      case 'gold':
        return 'text-yellow-600 bg-yellow-100';
      case 'platinum':
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPointTypeColor = (type: string) => {
    switch (type) {
      case 'earned':
        return 'text-green-600 bg-green-100';
      case 'redeemed':
        return 'text-red-600 bg-red-100';
      case 'expired':
        return 'text-gray-600 bg-gray-100';
      case 'bonus':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
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
          <p className="mt-4 text-gray-600">Loading loyalty data...</p>
        </div>
      </div>
    );
  }

  const progressPercentage = loyaltyStats.nextTierPoints > 0 
    ? (loyaltyStats.totalPoints / loyaltyStats.nextTierPoints) * 100 
    : 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Loyalty Rewards</h1>
              <p className="text-blue-100 mt-2">Earn points with every purchase and unlock amazing rewards</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold">{loyaltyStats.totalPoints.toLocaleString()}</div>
              <div className="text-blue-100">Available Points</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Current Tier</p>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTierColor(loyaltyStats.tier)}`}>
                  {loyaltyStats.tier}
                </span>
              </div>
              <Trophy className="w-8 h-8 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Points Earned</p>
                <p className="text-2xl font-bold text-green-600">{loyaltyStats.pointsEarned.toLocaleString()}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Points Redeemed</p>
                <p className="text-2xl font-bold text-blue-600">{loyaltyStats.pointsRedeemed.toLocaleString()}</p>
              </div>
              <Gift className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Your Rank</p>
                <p className="text-2xl font-bold text-purple-600">#{loyaltyStats.rank}</p>
              </div>
              <Star className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Tier Progress */}
        {loyaltyStats.nextTierPoints > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Progress to Next Tier</h3>
              <span className="text-sm text-gray-600">
                {loyaltyStats.totalPoints} / {loyaltyStats.nextTierPoints} points
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {loyaltyStats.nextTierPoints - loyaltyStats.totalPoints} more points to reach the next tier
            </p>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: Trophy },
                { id: 'history', label: 'Point History', icon: History },
                { id: 'redeem', label: 'Redeem Points', icon: Gift },
                { id: 'leaderboard', label: 'Leaderboard', icon: Users }
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
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">How to Earn Points</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <Coins className="w-8 h-8 text-yellow-500 mb-2" />
                      <h4 className="font-medium text-gray-900">Place Orders</h4>
                      <p className="text-sm text-gray-600">Earn 1 point for every ₹10 spent</p>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <Star className="w-8 h-8 text-blue-500 mb-2" />
                      <h4 className="font-medium text-gray-900">Write Reviews</h4>
                      <p className="text-sm text-gray-600">Get 50 points for each review</p>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <Users className="w-8 h-8 text-green-500 mb-2" />
                      <h4 className="font-medium text-gray-900">Refer Friends</h4>
                      <p className="text-sm text-gray-600">Earn 500 points per referral</p>
                    </div>
                  </div>
                </div>

                {loyaltyStats.pointsExpiring > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-5 h-5 text-yellow-600" />
                      <h4 className="font-medium text-yellow-800">Points Expiring Soon</h4>
                    </div>
                    <p className="text-sm text-yellow-700 mt-1">
                      {loyaltyStats.pointsExpiring} points will expire in the next 30 days. Use them before they expire!
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Point History Tab */}
            {activeTab === 'history' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Point History</h3>
                {pointHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No point transactions yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pointHistory.map((point) => (
                      <div key={point.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPointTypeColor(point.type)}`}>
                            {point.type}
                          </span>
                          <div>
                            <p className="font-medium text-gray-900">{point.reason}</p>
                            <p className="text-sm text-gray-600">{formatDate(point.createdAt)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${
                            point.type === 'earned' || point.type === 'bonus' 
                              ? 'text-green-600' 
                              : 'text-red-600'
                          }`}>
                            {point.type === 'earned' || point.type === 'bonus' ? '+' : '-'}{point.points}
                          </p>
                          {point.expiresAt && (
                            <p className="text-xs text-gray-500">
                              Expires: {formatDate(point.expiresAt)}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Redeem Points Tab */}
            {activeTab === 'redeem' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Redeem Your Points</h3>
                {redemptionOptions.length === 0 ? (
                  <div className="text-center py-8">
                    <Gift className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No redemption options available</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {redemptionOptions.map((option) => (
                      <div key={option.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="text-center">
                          <Gift className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                          <h4 className="font-semibold text-gray-900 mb-2">{option.title}</h4>
                          <p className="text-sm text-gray-600 mb-4">{option.description}</p>
                          
                          <div className="mb-4">
                            <span className="text-2xl font-bold text-purple-600">
                              {option.pointsRequired}
                            </span>
                            <span className="text-sm text-gray-600 ml-1">points</span>
                          </div>

                          <div className="mb-4">
                            <span className="text-lg font-semibold text-green-600">
                              {option.type === 'percentage' ? `${option.discount}% OFF` : `₹${option.discount} OFF`}
                            </span>
                          </div>

                          <button
                            onClick={() => handleRedeemPoints(option.id)}
                            disabled={!option.isAvailable || loyaltyStats.totalPoints < option.pointsRequired}
                            className={`w-full py-2 px-4 rounded-lg font-medium ${
                              option.isAvailable && loyaltyStats.totalPoints >= option.pointsRequired
                                ? 'bg-purple-600 text-white hover:bg-purple-700'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            {loyaltyStats.totalPoints >= option.pointsRequired ? 'Redeem Now' : 'Not Enough Points'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Leaderboard Tab */}
            {activeTab === 'leaderboard' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Point Earners</h3>
                {leaderboard.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No leaderboard data available</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {leaderboard.map((user, index) => (
                      <div key={user.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                            index === 0 ? 'bg-yellow-500' :
                            index === 1 ? 'bg-gray-400' :
                            index === 2 ? 'bg-orange-600' : 'bg-blue-500'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-600">{user.tier} Member</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-purple-600">{user.totalPoints.toLocaleString()}</p>
                          <p className="text-sm text-gray-600">points</p>
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
    </div>
  );
};

export default LoyaltyPage;
