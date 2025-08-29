// Enhanced API Service with Mock Integration
import { mockApi } from './mockApiService';

// Configuration for API mode
const USE_MOCK_API = true; // Set to false when real API is available
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  private async request(endpoint: string, options: RequestInit = {}) {
    // Use mock API if enabled
    if (USE_MOCK_API) {
      return this.mockRequest(endpoint, options);
    }

    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  private async mockRequest(endpoint: string, options: RequestInit = {}) {
    const method = options.method || 'GET';
    const body = options.body ? JSON.parse(options.body as string) : null;
    
    // Route to appropriate mock API method
    try {
      switch (true) {
        // Authentication
        case endpoint === '/auth/login' && method === 'POST':
          return await mockApi.login(body.email, body.password);
        
        case endpoint === '/auth/register' && method === 'POST':
          return await mockApi.register(body);

        // Businesses
        case endpoint.startsWith('/businesses') && method === 'GET':
          if (endpoint.includes('/businesses/')) {
            const id = endpoint.split('/')[2];
            return await mockApi.getBusinessById(id);
          }
          return await mockApi.getBusinesses(body);
        
        case endpoint === '/businesses' && method === 'POST':
          return await mockApi.createBusiness(body);
        
        case endpoint.startsWith('/businesses/') && method === 'PUT':
          const businessId = endpoint.split('/')[2];
          return await mockApi.updateBusiness(businessId, body);
        
        case endpoint.startsWith('/businesses/') && method === 'DELETE':
          const deleteBusinessId = endpoint.split('/')[2];
          return await mockApi.deleteBusiness(deleteBusinessId);

        // Products
        case endpoint.startsWith('/products') && method === 'GET':
          if (endpoint.includes('/products/')) {
            const id = endpoint.split('/')[2];
            return await mockApi.getProductById(id);
          }
          return await mockApi.getProducts(body?.businessId, body);
        
        case endpoint === '/products' && method === 'POST':
          return await mockApi.createProduct(body);
        
        case endpoint.startsWith('/products/') && method === 'PUT':
          const productId = endpoint.split('/')[2];
          return await mockApi.updateProduct(productId, body);
        
        case endpoint.startsWith('/products/') && method === 'DELETE':
          const deleteProductId = endpoint.split('/')[2];
          return await mockApi.deleteProduct(deleteProductId);

        // Orders
        case endpoint.startsWith('/orders') && method === 'GET':
          if (endpoint.includes('/orders/')) {
            const id = endpoint.split('/')[2];
            return await mockApi.getOrderById(id);
          }
          return await mockApi.getOrders(body?.userId, body?.status);
        
        case endpoint === '/orders' && method === 'POST':
          return await mockApi.createOrder(body);
        
        case endpoint.includes('/orders/') && endpoint.includes('/status') && method === 'PUT':
          const orderId = endpoint.split('/')[2];
          return await mockApi.updateOrderStatus(orderId, body.status);

        // Reviews
        case endpoint.startsWith('/reviews') && method === 'GET':
          return await mockApi.getReviews(body?.businessId, body?.productId);
        
        case endpoint === '/reviews' && method === 'POST':
          return await mockApi.createReview(body);

        // Analytics
        case endpoint === '/analytics' && method === 'GET':
          return await mockApi.getAnalytics();

        // AI Recommendations
        case endpoint.startsWith('/recommendations') && method === 'GET':
          const userId = endpoint.split('/')[2] || '1';
          return await mockApi.getRecommendations(userId);

        // Chat
        case endpoint === '/chat/messages' && method === 'GET':
          return await mockApi.getChatMessages();
        
        case endpoint === '/chat/messages' && method === 'POST':
          return await mockApi.sendChatMessage(body.message, body.userId);

        // Delivery Tracking
        case endpoint.includes('/delivery/track/') && method === 'GET':
          const trackingOrderId = endpoint.split('/')[3];
          return await mockApi.getDeliveryTracking(trackingOrderId);

        // Search
        case endpoint.startsWith('/search') && method === 'GET':
          const params = new URLSearchParams(endpoint.split('?')[1]);
          return await mockApi.search(
            params.get('q') || '',
            params.get('type') as any || 'all'
          );

        default:
          throw new Error(`Mock API endpoint not implemented: ${method} ${endpoint}`);
      }
    } catch (error) {
      console.error('Mock API error:', error);
      throw error;
    }
  }

  // Authentication methods
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: any) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return { success: true };
  }

  // Business methods
  async getBusinesses(filters?: any) {
    return this.request('/businesses', {
      method: 'GET',
      body: JSON.stringify(filters),
    });
  }

  async getBusinessById(id: string) {
    return this.request(`/businesses/${id}`);
  }

  async createBusiness(businessData: any) {
    return this.request('/businesses', {
      method: 'POST',
      body: JSON.stringify(businessData),
    });
  }

  async updateBusiness(id: string, updates: any) {
    return this.request(`/businesses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteBusiness(id: string) {
    return this.request(`/businesses/${id}`, {
      method: 'DELETE',
    });
  }

  // Product methods
  async getProducts(filters?: any) {
    return this.request('/products', {
      method: 'GET',
      body: JSON.stringify(filters),
    });
  }

  async getProductById(id: string) {
    return this.request(`/products/${id}`);
  }

  async createProduct(productData: any) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(id: string, updates: any) {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteProduct(id: string) {
    return this.request(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  // Order methods
  async getOrders(filters?: any) {
    return this.request('/orders', {
      method: 'GET',
      body: JSON.stringify(filters),
    });
  }

  async getOrderById(id: string) {
    return this.request(`/orders/${id}`);
  }

  async createOrder(orderData: any) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async updateOrderStatus(id: string, status: string) {
    return this.request(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // Review methods
  async getReviews(filters?: any) {
    return this.request('/reviews', {
      method: 'GET',
      body: JSON.stringify(filters),
    });
  }

  async createReview(reviewData: any) {
    return this.request('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  }

  // Analytics methods
  async getAnalytics() {
    return this.request('/analytics');
  }

  // AI Recommendation methods
  async getRecommendations(userId: string) {
    return this.request(`/recommendations/${userId}`);
  }

  // Chat methods
  async getChatMessages() {
    return this.request('/chat/messages');
  }

  async sendChatMessage(message: string, userId: string) {
    return this.request('/chat/messages', {
      method: 'POST',
      body: JSON.stringify({ message, userId }),
    });
  }

  // Delivery Tracking
  async getDeliveryTracking(orderId: string) {
    return this.request(`/delivery/track/${orderId}`);
  }

  // Search methods
  async search(query: string, type: string = 'all') {
    return this.request(`/search?q=${encodeURIComponent(query)}&type=${type}`);
  }

  // Media upload
  async uploadMedia(file: File) {
    if (USE_MOCK_API) {
      return mockApi.uploadMedia(file);
    }
    
    const formData = new FormData();
    formData.append('media', file);
    
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/multimedia/media/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    
    return response.json();
  }

  // Utility methods
  setApiMode(useMock: boolean) {
    // This would typically be set via environment variables
    console.log(`API Mode: ${useMock ? 'Mock' : 'Real'}`);
  }

  getApiStatus() {
    return {
      mode: USE_MOCK_API ? 'mock' : 'real',
      baseUrl: API_BASE_URL,
      isOnline: navigator.onLine,
    };
  }
}

export const apiService = new ApiService();
export default apiService;
