import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface DeliveryTracking {
  orderId: string;
  status: 'preparing' | 'picked_up' | 'in_transit' | 'delivered';
  estimatedTime: number; // minutes
  currentLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  deliveryPartner: {
    name: string;
    phone: string;
    rating: number;
    vehicle: string;
  };
  route: {
    distance: number;
    duration: number;
    steps: any[];
  };
  timeline: {
    status: string;
    timestamp: Date;
    note?: string;
  }[];
}

export const RealTimeDeliveryTracking: React.FC<{ orderId: string }> = ({ orderId }) => {
  const [tracking, setTracking] = useState<DeliveryTracking | null>(null);
  const [loading, setLoading] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  const fetchTrackingInfo = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/delivery/track/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setTracking(data);
      }
    } catch (error) {
      console.error('Error fetching tracking info:', error);
    }
    setLoading(false);
  };

  // Simulate real-time updates (replace with WebSocket in production)
  useEffect(() => {
    fetchTrackingInfo();
    
    const interval = setInterval(() => {
      fetchTrackingInfo();
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [orderId]);

  const callDeliveryPartner = () => {
    if (tracking?.deliveryPartner.phone) {
      window.open(`tel:${tracking.deliveryPartner.phone}`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'preparing': return 'text-yellow-600 bg-yellow-100';
      case 'picked_up': return 'text-blue-600 bg-blue-100';
      case 'in_transit': return 'text-purple-600 bg-purple-100';
      case 'delivered': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'preparing': return '👨‍🍳';
      case 'picked_up': return '📦';
      case 'in_transit': return '🚗';
      case 'delivered': return '✅';
      default: return '📍';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'preparing': return 'Order is being prepared';
      case 'picked_up': return 'Order picked up by delivery partner';
      case 'in_transit': return 'On the way to your location';
      case 'delivered': return 'Order delivered successfully';
      default: return 'Processing order';
    }
  };

  if (loading && !tracking) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="text-lg text-gray-500">Loading delivery tracking...</div>
        </div>
      </div>
    );
  }

  if (!tracking) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="text-lg text-gray-500">No tracking information available</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
          <h1 className="text-2xl font-bold mb-2">Track Your Order</h1>
          <p className="opacity-90">Order ID: {tracking.orderId}</p>
        </div>

        {/* Current Status */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <span className="text-3xl mr-3">{getStatusIcon(tracking.status)}</span>
              <div>
                <h2 className="text-xl font-semibold">{getStatusText(tracking.status)}</h2>
                <p className="text-gray-600">
                  Estimated delivery: {tracking.estimatedTime} minutes
                </p>
              </div>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(tracking.status)}`}>
              {tracking.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="relative">
            <div className="flex justify-between mb-2">
              {['preparing', 'picked_up', 'in_transit', 'delivered'].map((status, index) => (
                <div key={status} className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    ['preparing', 'picked_up', 'in_transit', 'delivered'].indexOf(tracking.status) >= index
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {index + 1}
                  </div>
                  <span className="text-xs mt-1 text-center">
                    {status.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
            <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-200">
              <div 
                className="h-full bg-blue-500 transition-all duration-500"
                style={{ 
                  width: `${(['preparing', 'picked_up', 'in_transit', 'delivered'].indexOf(tracking.status) / 3) * 100}%` 
                }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
          {/* Map Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Live Location</h3>
            <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center relative">
              <div className="text-center">
                <div className="text-4xl mb-2">🗺️</div>
                <p className="text-gray-600">Interactive Map</p>
                <p className="text-sm text-gray-500">
                  Current location: {tracking.currentLocation.address}
                </p>
              </div>
              {/* In production, integrate with Google Maps or similar */}
            </div>
            
            {tracking.status === 'in_transit' && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Distance remaining</p>
                    <p className="text-sm text-gray-600">{tracking.route.distance} km</p>
                  </div>
                  <div>
                    <p className="font-medium">ETA</p>
                    <p className="text-sm text-gray-600">{tracking.route.duration} mins</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Delivery Partner Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Delivery Partner</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {tracking.deliveryPartner.name.charAt(0)}
                </div>
                <div className="ml-3">
                  <h4 className="font-semibold">{tracking.deliveryPartner.name}</h4>
                  <div className="flex items-center">
                    <span className="text-yellow-500">★</span>
                    <span className="ml-1 text-sm text-gray-600">
                      {tracking.deliveryPartner.rating}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Vehicle:</span>
                  <span className="font-medium">{tracking.deliveryPartner.vehicle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-medium">{tracking.deliveryPartner.phone}</span>
                </div>
              </div>
              
              <Button 
                onClick={callDeliveryPartner}
                className="w-full bg-green-500 hover:bg-green-600"
              >
                📞 Call Delivery Partner
              </Button>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="p-6 border-t">
          <h3 className="text-lg font-semibold mb-4">Order Timeline</h3>
          <div className="space-y-4">
            {tracking.timeline.map((event, index) => (
              <div key={index} className="flex items-start">
                <div className="w-3 h-3 bg-blue-500 rounded-full mt-2 mr-4"></div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{event.status.replace('_', ' ')}</p>
                      {event.note && (
                        <p className="text-sm text-gray-600">{event.note}</p>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 bg-gray-50 flex gap-4">
          <Button 
            onClick={fetchTrackingInfo}
            className="bg-blue-500 hover:bg-blue-600"
          >
            🔄 Refresh
          </Button>
          
          {tracking.status !== 'delivered' && (
            <>
              <Button className="bg-yellow-500 hover:bg-yellow-600">
                📝 Report Issue
              </Button>
              <Button className="bg-red-500 hover:bg-red-600">
                ❌ Cancel Order
              </Button>
            </>
          )}
          
          {tracking.status === 'delivered' && (
            <Button className="bg-green-500 hover:bg-green-600">
              ⭐ Rate Experience
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RealTimeDeliveryTracking;
