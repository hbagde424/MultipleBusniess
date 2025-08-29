import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Settings,
  Store,
  Bell,
  CreditCard,
  Truck,
  Shield,
  Users,
  Globe,
  Mail,
  Phone,
  MapPin,
  Clock,
  DollarSign,
  Percent,
  Zap,
  Eye,
  EyeOff,
  Save,
  Upload,
  Camera,
  Edit,
  Check,
  X,
  AlertCircle,
  Info
} from 'lucide-react';

interface BusinessSettings {
  name: string;
  description: string;
  logo: string;
  banner: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  contact: {
    email: string;
    phone: string;
    website: string;
  };
  operatingHours: {
    [key: string]: {
      isOpen: boolean;
      openTime: string;
      closeTime: string;
    };
  };
  minimumOrderValue: number;
  deliveryRadius: number;
  averageDeliveryTime: number;
  currency: string;
  taxRate: number;
}

interface NotificationSettings {
  newOrders: boolean;
  orderUpdates: boolean;
  customerMessages: boolean;
  lowInventory: boolean;
  dailyReports: boolean;
  weeklyReports: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
}

interface PaymentSettings {
  acceptCash: boolean;
  acceptCards: boolean;
  acceptUPI: boolean;
  acceptWallet: boolean;
  stripeEnabled: boolean;
  razorpayEnabled: boolean;
  paypalEnabled: boolean;
  stripePublicKey: string;
  stripeSecretKey: string;
  razorpayKeyId: string;
  razorpayKeySecret: string;
}

interface DeliverySettings {
  selfDelivery: boolean;
  thirdPartyDelivery: boolean;
  deliveryCharges: {
    flatRate: number;
    perKm: number;
    freeDeliveryThreshold: number;
  };
  deliveryZones: Array<{
    name: string;
    radius: number;
    charge: number;
  }>;
}

const BusinessSettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPasswords, setShowPasswords] = useState<{[key: string]: boolean}>({});
  
  const [businessSettings, setBusinessSettings] = useState<BusinessSettings>({
    name: '',
    description: '',
    logo: '',
    banner: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      coordinates: { lat: 0, lng: 0 }
    },
    contact: {
      email: '',
      phone: '',
      website: ''
    },
    operatingHours: {
      monday: { isOpen: true, openTime: '09:00', closeTime: '22:00' },
      tuesday: { isOpen: true, openTime: '09:00', closeTime: '22:00' },
      wednesday: { isOpen: true, openTime: '09:00', closeTime: '22:00' },
      thursday: { isOpen: true, openTime: '09:00', closeTime: '22:00' },
      friday: { isOpen: true, openTime: '09:00', closeTime: '22:00' },
      saturday: { isOpen: true, openTime: '09:00', closeTime: '23:00' },
      sunday: { isOpen: true, openTime: '10:00', closeTime: '23:00' }
    },
    minimumOrderValue: 100,
    deliveryRadius: 5,
    averageDeliveryTime: 30,
    currency: 'INR',
    taxRate: 5
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    newOrders: true,
    orderUpdates: true,
    customerMessages: true,
    lowInventory: true,
    dailyReports: true,
    weeklyReports: false,
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true
  });

  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>({
    acceptCash: true,
    acceptCards: true,
    acceptUPI: true,
    acceptWallet: false,
    stripeEnabled: false,
    razorpayEnabled: true,
    paypalEnabled: false,
    stripePublicKey: '',
    stripeSecretKey: '',
    razorpayKeyId: '',
    razorpayKeySecret: ''
  });

  const [deliverySettings, setDeliverySettings] = useState<DeliverySettings>({
    selfDelivery: true,
    thirdPartyDelivery: false,
    deliveryCharges: {
      flatRate: 30,
      perKm: 5,
      freeDeliveryThreshold: 500
    },
    deliveryZones: [
      { name: 'Zone 1 (0-2 km)', radius: 2, charge: 20 },
      { name: 'Zone 2 (2-5 km)', radius: 5, charge: 40 },
      { name: 'Zone 3 (5-10 km)', radius: 10, charge: 60 }
    ]
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchSettings();
  }, [isAuthenticated, navigate]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Mock data - replace with actual API calls
      const mockBusinessData = {
        name: 'Delicious Bites Restaurant',
        description: 'Authentic Indian cuisine with a modern twist. Fresh ingredients, traditional recipes, and exceptional taste.',
        logo: '/logo.png',
        banner: '/banner.jpg',
        address: {
          street: '123 Food Street, Sector 15',
          city: 'Noida',
          state: 'Uttar Pradesh',
          zipCode: '201301',
          coordinates: { lat: 28.5355, lng: 77.3910 }
        },
        contact: {
          email: 'info@deliciousbites.com',
          phone: '+91-9876543210',
          website: 'www.deliciousbites.com'
        },
        operatingHours: businessSettings.operatingHours,
        minimumOrderValue: 150,
        deliveryRadius: 8,
        averageDeliveryTime: 25,
        currency: 'INR',
        taxRate: 5
      };

      setBusinessSettings(mockBusinessData);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (settingsType: string) => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      
      // API calls would go here
      console.log(`Saving ${settingsType} settings...`);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert(`${settingsType} settings saved successfully!`);
    } catch (error) {
      console.error(`Error saving ${settingsType} settings:`, error);
      alert(`Failed to save ${settingsType} settings`);
    } finally {
      setSaving(false);
    }
  };

  const togglePasswordVisibility = (field: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Store },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'delivery', label: 'Delivery', icon: Truck },
    { id: 'security', label: 'Security', icon: Shield }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <Settings className="w-6 h-6 mr-3 text-blue-600" />
                Business Settings
              </h1>
              <p className="text-sm text-gray-600">
                Configure your business preferences and settings
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-64">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <nav className="p-4 space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                  </div>
                  <div className="p-6 space-y-6">
                    {/* Logo and Banner */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Restaurant Logo
                        </label>
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                            <Camera className="w-6 h-6 text-gray-400" />
                          </div>
                          <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                            <Upload className="w-4 h-4 inline mr-2" />
                            Upload Logo
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Banner Image
                        </label>
                        <div className="flex items-center space-x-4">
                          <div className="w-24 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                            <Camera className="w-6 h-6 text-gray-400" />
                          </div>
                          <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                            <Upload className="w-4 h-4 inline mr-2" />
                            Upload Banner
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Restaurant Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Restaurant Name
                      </label>
                      <input
                        type="text"
                        value={businessSettings.name}
                        onChange={(e) => setBusinessSettings({
                          ...businessSettings,
                          name: e.target.value
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        rows={3}
                        value={businessSettings.description}
                        onChange={(e) => setBusinessSettings({
                          ...businessSettings,
                          description: e.target.value
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Describe your restaurant..."
                      />
                    </div>

                    {/* Contact Information */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={businessSettings.contact.email}
                          onChange={(e) => setBusinessSettings({
                            ...businessSettings,
                            contact: { ...businessSettings.contact, email: e.target.value }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={businessSettings.contact.phone}
                          onChange={(e) => setBusinessSettings({
                            ...businessSettings,
                            contact: { ...businessSettings.contact, phone: e.target.value }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Website
                        </label>
                        <input
                          type="url"
                          value={businessSettings.contact.website}
                          onChange={(e) => setBusinessSettings({
                            ...businessSettings,
                            contact: { ...businessSettings.contact, website: e.target.value }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Address */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address
                      </label>
                      <div className="space-y-4">
                        <input
                          type="text"
                          placeholder="Street Address"
                          value={businessSettings.address.street}
                          onChange={(e) => setBusinessSettings({
                            ...businessSettings,
                            address: { ...businessSettings.address, street: e.target.value }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <input
                            type="text"
                            placeholder="City"
                            value={businessSettings.address.city}
                            onChange={(e) => setBusinessSettings({
                              ...businessSettings,
                              address: { ...businessSettings.address, city: e.target.value }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <input
                            type="text"
                            placeholder="State"
                            value={businessSettings.address.state}
                            onChange={(e) => setBusinessSettings({
                              ...businessSettings,
                              address: { ...businessSettings.address, state: e.target.value }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <input
                            type="text"
                            placeholder="ZIP Code"
                            value={businessSettings.address.zipCode}
                            onChange={(e) => setBusinessSettings({
                              ...businessSettings,
                              address: { ...businessSettings.address, zipCode: e.target.value }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={() => saveSettings('general')}
                        disabled={saving}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
                      >
                        <Save className="w-4 h-4" />
                        <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Operating Hours */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Operating Hours</h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {Object.entries(businessSettings.operatingHours).map(([day, hours]) => (
                        <div key={day} className="flex items-center space-x-4">
                          <div className="w-20">
                            <span className="text-sm font-medium text-gray-700 capitalize">
                              {day}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={hours.isOpen}
                              onChange={(e) => setBusinessSettings({
                                ...businessSettings,
                                operatingHours: {
                                  ...businessSettings.operatingHours,
                                  [day]: { ...hours, isOpen: e.target.checked }
                                }
                              })}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-600">Open</span>
                          </div>
                          {hours.isOpen && (
                            <>
                              <input
                                type="time"
                                value={hours.openTime}
                                onChange={(e) => setBusinessSettings({
                                  ...businessSettings,
                                  operatingHours: {
                                    ...businessSettings.operatingHours,
                                    [day]: { ...hours, openTime: e.target.value }
                                  }
                                })}
                                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                              <span className="text-gray-400">to</span>
                              <input
                                type="time"
                                value={hours.closeTime}
                                onChange={(e) => setBusinessSettings({
                                  ...businessSettings,
                                  operatingHours: {
                                    ...businessSettings.operatingHours,
                                    [day]: { ...hours, closeTime: e.target.value }
                                  }
                                })}
                                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </>
                          )}
                          {!hours.isOpen && (
                            <span className="text-sm text-red-600">Closed</span>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 flex justify-end">
                      <button
                        onClick={() => saveSettings('operating-hours')}
                        disabled={saving}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
                      >
                        <Save className="w-4 h-4" />
                        <span>{saving ? 'Saving...' : 'Save Hours'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Business Configuration */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Business Configuration</h3>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Minimum Order Value (₹)
                        </label>
                        <input
                          type="number"
                          value={businessSettings.minimumOrderValue}
                          onChange={(e) => setBusinessSettings({
                            ...businessSettings,
                            minimumOrderValue: parseInt(e.target.value) || 0
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Delivery Radius (km)
                        </label>
                        <input
                          type="number"
                          value={businessSettings.deliveryRadius}
                          onChange={(e) => setBusinessSettings({
                            ...businessSettings,
                            deliveryRadius: parseInt(e.target.value) || 0
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Average Delivery Time (minutes)
                        </label>
                        <input
                          type="number"
                          value={businessSettings.averageDeliveryTime}
                          onChange={(e) => setBusinessSettings({
                            ...businessSettings,
                            averageDeliveryTime: parseInt(e.target.value) || 0
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tax Rate (%)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={businessSettings.taxRate}
                          onChange={(e) => setBusinessSettings({
                            ...businessSettings,
                            taxRate: parseFloat(e.target.value) || 0
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-6 flex justify-end">
                      <button
                        onClick={() => saveSettings('business-config')}
                        disabled={saving}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
                      >
                        <Save className="w-4 h-4" />
                        <span>{saving ? 'Saving...' : 'Save Configuration'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Notification Preferences</h3>
                  <p className="text-sm text-gray-600">Configure how you want to receive notifications</p>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    {/* Order Notifications */}
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-4">Order Notifications</h4>
                      <div className="space-y-4">
                        {[
                          { key: 'newOrders', label: 'New Orders', description: 'Get notified when new orders are placed' },
                          { key: 'orderUpdates', label: 'Order Updates', description: 'Get notified when order status changes' }
                        ].map((item) => (
                          <div key={item.key} className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{item.label}</p>
                              <p className="text-sm text-gray-600">{item.description}</p>
                            </div>
                            <input
                              type="checkbox"
                              checked={notificationSettings[item.key as keyof NotificationSettings] as boolean}
                              onChange={(e) => setNotificationSettings({
                                ...notificationSettings,
                                [item.key]: e.target.checked
                              })}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Business Notifications */}
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-4">Business Notifications</h4>
                      <div className="space-y-4">
                        {[
                          { key: 'customerMessages', label: 'Customer Messages', description: 'Get notified when customers send messages' },
                          { key: 'lowInventory', label: 'Low Inventory', description: 'Get notified when items are running low' },
                          { key: 'dailyReports', label: 'Daily Reports', description: 'Receive daily business summary reports' },
                          { key: 'weeklyReports', label: 'Weekly Reports', description: 'Receive weekly business analytics reports' }
                        ].map((item) => (
                          <div key={item.key} className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{item.label}</p>
                              <p className="text-sm text-gray-600">{item.description}</p>
                            </div>
                            <input
                              type="checkbox"
                              checked={notificationSettings[item.key as keyof NotificationSettings] as boolean}
                              onChange={(e) => setNotificationSettings({
                                ...notificationSettings,
                                [item.key]: e.target.checked
                              })}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Notification Channels */}
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-4">Notification Channels</h4>
                      <div className="space-y-4">
                        {[
                          { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive notifications via email' },
                          { key: 'smsNotifications', label: 'SMS Notifications', description: 'Receive notifications via SMS' },
                          { key: 'pushNotifications', label: 'Push Notifications', description: 'Receive browser push notifications' }
                        ].map((item) => (
                          <div key={item.key} className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{item.label}</p>
                              <p className="text-sm text-gray-600">{item.description}</p>
                            </div>
                            <input
                              type="checkbox"
                              checked={notificationSettings[item.key as keyof NotificationSettings] as boolean}
                              onChange={(e) => setNotificationSettings({
                                ...notificationSettings,
                                [item.key]: e.target.checked
                              })}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => saveSettings('notifications')}
                      disabled={saving}
                      className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>{saving ? 'Saving...' : 'Save Notifications'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Settings */}
            {activeTab === 'payments' && (
              <div className="space-y-6">
                {/* Payment Methods */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Accepted Payment Methods</h3>
                    <p className="text-sm text-gray-600">Configure which payment methods you accept</p>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { key: 'acceptCash', label: 'Cash', icon: DollarSign },
                        { key: 'acceptCards', label: 'Cards', icon: CreditCard },
                        { key: 'acceptUPI', label: 'UPI', icon: Zap },
                        { key: 'acceptWallet', label: 'Wallet', icon: CreditCard }
                      ].map((method) => (
                        <div key={method.key} className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg">
                          <input
                            type="checkbox"
                            checked={paymentSettings[method.key as keyof PaymentSettings] as boolean}
                            onChange={(e) => setPaymentSettings({
                              ...paymentSettings,
                              [method.key]: e.target.checked
                            })}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <method.icon className="w-5 h-5 text-gray-600" />
                          <span className="text-sm font-medium text-gray-900">{method.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Payment Gateway Configuration */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Payment Gateway Configuration</h3>
                    <p className="text-sm text-gray-600">Configure your payment gateway credentials</p>
                  </div>
                  <div className="p-6 space-y-6">
                    {/* Razorpay */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-md font-medium text-gray-900">Razorpay</h4>
                        <input
                          type="checkbox"
                          checked={paymentSettings.razorpayEnabled}
                          onChange={(e) => setPaymentSettings({
                            ...paymentSettings,
                            razorpayEnabled: e.target.checked
                          })}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </div>
                      {paymentSettings.razorpayEnabled && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Key ID
                            </label>
                            <input
                              type="text"
                              value={paymentSettings.razorpayKeyId}
                              onChange={(e) => setPaymentSettings({
                                ...paymentSettings,
                                razorpayKeyId: e.target.value
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="rzp_test_..."
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Key Secret
                            </label>
                            <div className="relative">
                              <input
                                type={showPasswords.razorpaySecret ? 'text' : 'password'}
                                value={paymentSettings.razorpayKeySecret}
                                onChange={(e) => setPaymentSettings({
                                  ...paymentSettings,
                                  razorpayKeySecret: e.target.value
                                })}
                                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Your secret key"
                              />
                              <button
                                type="button"
                                onClick={() => togglePasswordVisibility('razorpaySecret')}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              >
                                {showPasswords.razorpaySecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Stripe */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-md font-medium text-gray-900">Stripe</h4>
                        <input
                          type="checkbox"
                          checked={paymentSettings.stripeEnabled}
                          onChange={(e) => setPaymentSettings({
                            ...paymentSettings,
                            stripeEnabled: e.target.checked
                          })}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </div>
                      {paymentSettings.stripeEnabled && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Publishable Key
                            </label>
                            <input
                              type="text"
                              value={paymentSettings.stripePublicKey}
                              onChange={(e) => setPaymentSettings({
                                ...paymentSettings,
                                stripePublicKey: e.target.value
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="pk_test_..."
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Secret Key
                            </label>
                            <div className="relative">
                              <input
                                type={showPasswords.stripeSecret ? 'text' : 'password'}
                                value={paymentSettings.stripeSecretKey}
                                onChange={(e) => setPaymentSettings({
                                  ...paymentSettings,
                                  stripeSecretKey: e.target.value
                                })}
                                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="sk_test_..."
                              />
                              <button
                                type="button"
                                onClick={() => togglePasswordVisibility('stripeSecret')}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              >
                                {showPasswords.stripeSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-6 border-t border-gray-200">
                    <div className="flex justify-end">
                      <button
                        onClick={() => saveSettings('payments')}
                        disabled={saving}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
                      >
                        <Save className="w-4 h-4" />
                        <span>{saving ? 'Saving...' : 'Save Payment Settings'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Delivery Settings */}
            {activeTab === 'delivery' && (
              <div className="space-y-6">
                {/* Delivery Options */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Delivery Options</h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={deliverySettings.selfDelivery}
                          onChange={(e) => setDeliverySettings({
                            ...deliverySettings,
                            selfDelivery: e.target.checked
                          })}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Self Delivery</p>
                          <p className="text-sm text-gray-600">Use your own delivery team</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={deliverySettings.thirdPartyDelivery}
                          onChange={(e) => setDeliverySettings({
                            ...deliverySettings,
                            thirdPartyDelivery: e.target.checked
                          })}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Third Party Delivery</p>
                          <p className="text-sm text-gray-600">Use external delivery services</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delivery Charges */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Delivery Charges</h3>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Flat Rate (₹)
                        </label>
                        <input
                          type="number"
                          value={deliverySettings.deliveryCharges.flatRate}
                          onChange={(e) => setDeliverySettings({
                            ...deliverySettings,
                            deliveryCharges: {
                              ...deliverySettings.deliveryCharges,
                              flatRate: parseInt(e.target.value) || 0
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Per KM (₹)
                        </label>
                        <input
                          type="number"
                          value={deliverySettings.deliveryCharges.perKm}
                          onChange={(e) => setDeliverySettings({
                            ...deliverySettings,
                            deliveryCharges: {
                              ...deliverySettings.deliveryCharges,
                              perKm: parseInt(e.target.value) || 0
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Free Delivery Above (₹)
                        </label>
                        <input
                          type="number"
                          value={deliverySettings.deliveryCharges.freeDeliveryThreshold}
                          onChange={(e) => setDeliverySettings({
                            ...deliverySettings,
                            deliveryCharges: {
                              ...deliverySettings.deliveryCharges,
                              freeDeliveryThreshold: parseInt(e.target.value) || 0
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delivery Zones */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Delivery Zones</h3>
                    <p className="text-sm text-gray-600">Configure different delivery charges for different zones</p>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {deliverySettings.deliveryZones.map((zone, index) => (
                        <div key={index} className="grid grid-cols-3 gap-4 p-4 border border-gray-200 rounded-lg">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Zone Name
                            </label>
                            <input
                              type="text"
                              value={zone.name}
                              onChange={(e) => {
                                const newZones = [...deliverySettings.deliveryZones];
                                newZones[index] = { ...zone, name: e.target.value };
                                setDeliverySettings({
                                  ...deliverySettings,
                                  deliveryZones: newZones
                                });
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Radius (km)
                            </label>
                            <input
                              type="number"
                              value={zone.radius}
                              onChange={(e) => {
                                const newZones = [...deliverySettings.deliveryZones];
                                newZones[index] = { ...zone, radius: parseInt(e.target.value) || 0 };
                                setDeliverySettings({
                                  ...deliverySettings,
                                  deliveryZones: newZones
                                });
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Charge (₹)
                            </label>
                            <input
                              type="number"
                              value={zone.charge}
                              onChange={(e) => {
                                const newZones = [...deliverySettings.deliveryZones];
                                newZones[index] = { ...zone, charge: parseInt(e.target.value) || 0 };
                                setDeliverySettings({
                                  ...deliverySettings,
                                  deliveryZones: newZones
                                });
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 flex justify-end">
                      <button
                        onClick={() => saveSettings('delivery')}
                        disabled={saving}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
                      >
                        <Save className="w-4 h-4" />
                        <span>{saving ? 'Saving...' : 'Save Delivery Settings'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Security Settings</h3>
                  <p className="text-sm text-gray-600">Manage your account security and privacy</p>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    {/* Password Change */}
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-4">Change Password</h4>
                      <div className="space-y-4 max-w-md">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Current Password
                          </label>
                          <input
                            type="password"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            New Password
                          </label>
                          <input
                            type="password"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
                          Update Password
                        </button>
                      </div>
                    </div>

                    {/* Two-Factor Authentication */}
                    <div className="border-t border-gray-200 pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-md font-medium text-gray-900">Two-Factor Authentication</h4>
                          <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                        </div>
                        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm">
                          Enable 2FA
                        </button>
                      </div>
                    </div>

                    {/* Login Sessions */}
                    <div className="border-t border-gray-200 pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-md font-medium text-gray-900">Active Login Sessions</h4>
                          <p className="text-sm text-gray-600">Manage your active login sessions</p>
                        </div>
                        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm">
                          View Sessions
                        </button>
                      </div>
                    </div>

                    {/* Account Deletion */}
                    <div className="border-t border-gray-200 pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-md font-medium text-red-900">Delete Account</h4>
                          <p className="text-sm text-red-600">Permanently delete your account and all data</p>
                        </div>
                        <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm">
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessSettingsPage;
