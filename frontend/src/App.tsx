import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Pages
import HomePage from './pages/HomePage';
import DemoHomePage from './pages/DemoHomePage';
import DemoAdminDashboard from './pages/DemoAdminDashboard';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BusinessListPage from './pages/BusinessListPage';
import BusinessDetailPage from './pages/BusinessDetailPage';
import BusinessRegisterPage from './pages/BusinessRegisterPage';
import BusinessManagePage from './pages/BusinessManagePage';
import BusinessEditPage from './pages/BusinessEditPage';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import OrderHistoryPage from './pages/OrderHistoryPage';

// New Feature Pages
import AdminDashboard from './pages/AdminDashboard';
import BusinessDashboard from './pages/BusinessDashboard';
import SubscriptionPage from './pages/SubscriptionPage';
import ReviewsPage from './pages/ReviewsPage';
import NotificationPage from './pages/NotificationPage';
import LoyaltyPage from './pages/LoyaltyPage';
import PromoCodePage from './pages/PromoCodePage';
import AdvancedSearchPage from './pages/AdvancedSearchPage';
import PaymentPage from './pages/PaymentPage';

// Enhanced Business Management Pages
import EnhancedBusinessDashboard from './pages/EnhancedBusinessDashboard';
import ProductManagementPage from './pages/ProductManagementPage';
import OrderManagementPage from './pages/OrderManagementPage';
import CustomerManagementPage from './pages/CustomerManagementPage';
import AnalyticsReportsPage from './pages/AnalyticsReportsPage';
import BusinessSettingsPage from './pages/BusinessSettingsPage';

// Advanced Components
import AdvancedAnalytics from './components/advanced/AdvancedAnalytics';
import LiveChatSupport from './components/advanced/LiveChatSupport';
import AIRecommendationEngine from './components/advanced/AIRecommendationEngine';
import RealTimeDeliveryTracking from './components/advanced/RealTimeDeliveryTracking';
import SocialFeatures from './components/advanced/SocialFeatures';
import MultimediaAndVoiceFeatures from './components/advanced/MultimediaAndVoiceFeatures';
import VoiceAndMultimediaHub from './components/multimedia/VoiceAndMultimediaHub';

// CRUD Components
import ProductCRUD from './components/crud/ProductCRUD';
import BusinessCRUD from './components/crud/BusinessCRUD';
import AdminCRUDDashboard from './components/crud/AdminCRUDDashboard';

import './App.css';

// Landing page component
const LandingPage: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <div className="App-logo">
          <h1 className="text-6xl font-bold text-blue-400 mb-4">
            🍱 Tifine
          </h1>
        </div>
        <p className="text-xl mb-6">
          Your Multi-Business Platform for Food & Services
        </p>
        <div className="flex space-x-4">
          <a
            className="App-link bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg transition-colors"
            href="/demo"
          >
            Try Demo
          </a>
          <a
            className="App-link bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-lg transition-colors"
            href="/admin/demo"
          >
            Admin Demo
          </a>
          <a
            className="App-link bg-purple-500 hover:bg-purple-600 px-6 py-3 rounded-lg transition-colors"
            href="/home"
          >
            Get Started
          </a>
          <a
            className="App-link bg-green-500 hover:bg-green-600 px-6 py-3 rounded-lg transition-colors"
            href="/register"
          >
            Join as Business
          </a>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-yellow-400 font-semibold mb-2">🎮 Demo Features</h3>
            <ul className="text-left space-y-1">
              <li>• Full CRUD Operations</li>
              <li>• AI Recommendations</li>
              <li>• Voice Commands</li>
              <li>• Real-time Tracking</li>
              <li>• Social Features</li>
            </ul>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-green-400 font-semibold mb-2">🚀 Advanced Tools</h3>
            <ul className="text-left space-y-1">
              <li>• Live Chat Support</li>
              <li>• Analytics Dashboard</li>
              <li>• Multimedia Hub</li>
              <li>• AR Food Recognition</li>
              <li>• Smart Filters</li>
            </ul>
          </div>
        </div>
        <p className="mt-8 text-sm opacity-75">
          Connect customers with local businesses • Tiffin • Food • Services
        </p>
      </header>
    </div>
  );
};

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen flex flex-col">
            <Routes>
              {/* Landing page */}
              <Route path="/" element={<LandingPage />} />
              
              {/* Main app routes with header/footer */}
              <Route path="/*" element={
                <>
                  <Header />
                  <main className="flex-1">
                    <Routes>
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/demo" element={<DemoHomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/businesses" element={<BusinessListPage />} />
                    <Route path="/business/:id" element={<BusinessDetailPage />} />
                    <Route path="/business/register" element={<BusinessRegisterPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/wishlist" element={<WishlistPage />} />
                    <Route path="/orders" element={<OrderHistoryPage />} />
                    
                    {/* Advanced Feature Routes */}
                    <Route path="/advanced/analytics" element={<AdvancedAnalytics />} />
                    <Route path="/advanced/chat" element={<LiveChatSupport />} />
                    <Route path="/advanced/ai-recommendations" element={<AIRecommendationEngine />} />
                    <Route path="/advanced/tracking" element={<RealTimeDeliveryTracking orderId="demo123" />} />
                    <Route path="/advanced/social" element={<SocialFeatures />} />
                    <Route path="/advanced/multimedia" element={<MultimediaAndVoiceFeatures />} />
                    <Route path="/multimedia/hub" element={<VoiceAndMultimediaHub />} />
                    
                    {/* CRUD Routes */}
                    <Route path="/crud/products" element={<ProductCRUD />} />
                    <Route path="/crud/businesses" element={<BusinessCRUD />} />
                    <Route path="/crud/admin" element={<AdminCRUDDashboard />} />
                    
                    {/* Admin Routes */}
                    <Route path="/admin/dashboard" element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminDashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/demo" element={<DemoAdminDashboard />} />
                    
                    {/* Business Routes */}
                    <Route path="/business/dashboard" element={
                      <ProtectedRoute requiredRole="business_owner">
                        <BusinessDashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="/business/enhanced-dashboard" element={
                      <ProtectedRoute requiredRole="business_owner">
                        <EnhancedBusinessDashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="/business/manage" element={
                      <ProtectedRoute requiredRole="business_owner">
                        <BusinessManagePage />
                      </ProtectedRoute>
                    } />
                    <Route path="/business/edit/:id" element={
                      <ProtectedRoute requiredRole="business_owner">
                        <BusinessEditPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/business/products" element={
                      <ProtectedRoute requiredRole="business_owner">
                        <ProductManagementPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/business/orders" element={
                      <ProtectedRoute requiredRole="business_owner">
                        <OrderManagementPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/business/customers" element={
                      <ProtectedRoute requiredRole="business_owner">
                        <CustomerManagementPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/business/analytics" element={
                      <ProtectedRoute requiredRole="business_owner">
                        <AnalyticsReportsPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/business/settings" element={
                      <ProtectedRoute requiredRole="business_owner">
                        <BusinessSettingsPage />
                      </ProtectedRoute>
                    } />
                    
                    {/* Feature Routes */}
                    <Route path="/subscriptions" element={<SubscriptionPage />} />
                    <Route path="/reviews" element={<ReviewsPage />} />
                    <Route path="/notifications" element={<NotificationPage />} />
                    <Route path="/loyalty" element={<LoyaltyPage />} />
                    <Route path="/promo-codes" element={<PromoCodePage />} />
                    <Route path="/search" element={<AdvancedSearchPage />} />
                    <Route path="/payments" element={<PaymentPage />} />
                  </Routes>
                </main>
                <Footer />
              </>
            } />
          </Routes>
        </div>
      </Router>
      </AuthProvider>
    </Provider>
  );
}

export default App;
