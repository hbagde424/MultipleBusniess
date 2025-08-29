// Mock API Service for Demo Data
import demoData, { 
  User, Business, Product, Order, Review, 
  demoUsers, demoBusinesses, demoProducts, demoOrders, demoReviews,
  demoAnalytics, demoChatMessages, demoRecommendations
} from '../data/demoData';

// Simulate API delay
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API responses
class MockApiService {
  // Authentication
  async login(email: string, password: string) {
    await delay(800);
    const user = demoUsers.find(u => u.email === email);
    if (user && password === 'demo123') {
      return {
        success: true,
        user,
        token: `mock_token_${user.id}_${Date.now()}`
      };
    }
    throw new Error('Invalid credentials');
  }

  async register(userData: Partial<User>) {
    await delay(1000);
    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name || '',
      email: userData.email || '',
      phone: userData.phone || '',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      role: 'customer',
      address: userData.address
    };
    demoUsers.push(newUser);
    return {
      success: true,
      user: newUser,
      token: `mock_token_${newUser.id}_${Date.now()}`
    };
  }

  // Businesses
  async getBusinesses(filters?: { category?: string; cuisine?: string; search?: string }) {
    await delay();
    let filteredBusinesses = [...demoBusinesses];
    
    if (filters?.category) {
      filteredBusinesses = filteredBusinesses.filter(b => 
        b.category.toLowerCase().includes(filters.category!.toLowerCase())
      );
    }
    
    if (filters?.cuisine) {
      filteredBusinesses = filteredBusinesses.filter(b =>
        b.cuisine.some(c => c.toLowerCase().includes(filters.cuisine!.toLowerCase()))
      );
    }
    
    if (filters?.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredBusinesses = filteredBusinesses.filter(b =>
        b.name.toLowerCase().includes(searchTerm) ||
        b.description.toLowerCase().includes(searchTerm) ||
        b.cuisine.some(c => c.toLowerCase().includes(searchTerm))
      );
    }
    
    return {
      success: true,
      businesses: filteredBusinesses,
      total: filteredBusinesses.length
    };
  }

  async getBusinessById(id: string) {
    await delay();
    const business = demoBusinesses.find(b => b.id === id);
    if (!business) throw new Error('Business not found');
    
    return {
      success: true,
      business,
      products: demoProducts.filter(p => p.businessId === id),
      reviews: demoReviews.filter(r => r.businessId === id)
    };
  }

  async createBusiness(businessData: Partial<Business>) {
    await delay(1200);
    const newBusiness: Business = {
      id: Date.now().toString(),
      name: businessData.name || '',
      description: businessData.description || '',
      category: businessData.category || '',
      image: businessData.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop',
      rating: 0,
      totalReviews: 0,
      deliveryTime: '30-45 mins',
      deliveryFee: 30,
      minOrder: 200,
      isOpen: true,
      cuisine: businessData.cuisine || [],
      address: businessData.address || '',
      phone: businessData.phone || '',
      email: businessData.email || '',
      ownerId: businessData.ownerId || '1'
    };
    demoBusinesses.push(newBusiness);
    return { success: true, business: newBusiness };
  }

  async updateBusiness(id: string, updates: Partial<Business>) {
    await delay(1000);
    const index = demoBusinesses.findIndex(b => b.id === id);
    if (index === -1) throw new Error('Business not found');
    
    demoBusinesses[index] = { ...demoBusinesses[index], ...updates };
    return { success: true, business: demoBusinesses[index] };
  }

  async deleteBusiness(id: string) {
    await delay(800);
    const index = demoBusinesses.findIndex(b => b.id === id);
    if (index === -1) throw new Error('Business not found');
    
    demoBusinesses.splice(index, 1);
    return { success: true };
  }

  // Products
  async getProducts(businessId?: string, filters?: { category?: string; search?: string }) {
    await delay();
    let filteredProducts = [...demoProducts];
    
    if (businessId) {
      filteredProducts = filteredProducts.filter(p => p.businessId === businessId);
    }
    
    if (filters?.category) {
      filteredProducts = filteredProducts.filter(p => 
        p.category.toLowerCase().includes(filters.category!.toLowerCase())
      );
    }
    
    if (filters?.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredProducts = filteredProducts.filter(p =>
        p.name.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm) ||
        p.ingredients.some(i => i.toLowerCase().includes(searchTerm))
      );
    }
    
    return {
      success: true,
      products: filteredProducts,
      total: filteredProducts.length
    };
  }

  async getProductById(id: string) {
    await delay();
    const product = demoProducts.find(p => p.id === id);
    if (!product) throw new Error('Product not found');
    
    const business = demoBusinesses.find(b => b.id === product.businessId);
    const reviews = demoReviews.filter(r => r.productId === id);
    
    return {
      success: true,
      product,
      business,
      reviews
    };
  }

  async createProduct(productData: Partial<Product>) {
    await delay(1200);
    const newProduct: Product = {
      id: Date.now().toString(),
      name: productData.name || '',
      description: productData.description || '',
      price: productData.price || 0,
      image: productData.image || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
      category: productData.category || '',
      businessId: productData.businessId || '',
      isVegetarian: productData.isVegetarian || false,
      isSpicy: productData.isSpicy || false,
      isPopular: false,
      rating: 0,
      reviews: 0,
      cookingTime: productData.cookingTime || 20,
      ingredients: productData.ingredients || [],
      nutritionInfo: productData.nutritionInfo || { calories: 0, protein: 0, carbs: 0, fat: 0 }
    };
    demoProducts.push(newProduct);
    return { success: true, product: newProduct };
  }

  async updateProduct(id: string, updates: Partial<Product>) {
    await delay(1000);
    const index = demoProducts.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Product not found');
    
    demoProducts[index] = { ...demoProducts[index], ...updates };
    return { success: true, product: demoProducts[index] };
  }

  async deleteProduct(id: string) {
    await delay(800);
    const index = demoProducts.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Product not found');
    
    demoProducts.splice(index, 1);
    return { success: true };
  }

  // Orders
  async getOrders(userId?: string, status?: string) {
    await delay();
    let filteredOrders = [...demoOrders];
    
    if (userId) {
      filteredOrders = filteredOrders.filter(o => o.userId === userId);
    }
    
    if (status) {
      filteredOrders = filteredOrders.filter(o => o.status === status);
    }
    
    return {
      success: true,
      orders: filteredOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
      total: filteredOrders.length
    };
  }

  async getOrderById(id: string) {
    await delay();
    const order = demoOrders.find(o => o.id === id);
    if (!order) throw new Error('Order not found');
    
    const business = demoBusinesses.find(b => b.id === order.businessId);
    
    return {
      success: true,
      order,
      business
    };
  }

  async createOrder(orderData: Partial<Order>) {
    await delay(1500);
    const newOrder: Order = {
      id: Date.now().toString(),
      userId: orderData.userId || '',
      businessId: orderData.businessId || '',
      items: orderData.items || [],
      status: 'pending',
      totalAmount: orderData.totalAmount || 0,
      deliveryAddress: orderData.deliveryAddress || '',
      deliveryFee: orderData.deliveryFee || 30,
      estimatedDeliveryTime: '25-35 mins',
      paymentMethod: orderData.paymentMethod || 'UPI',
      paymentStatus: 'paid',
      createdAt: new Date()
    };
    demoOrders.push(newOrder);
    return { success: true, order: newOrder };
  }

  async updateOrderStatus(id: string, status: Order['status']) {
    await delay(800);
    const index = demoOrders.findIndex(o => o.id === id);
    if (index === -1) throw new Error('Order not found');
    
    demoOrders[index].status = status;
    if (status === 'delivered') {
      demoOrders[index].actualDeliveryTime = '28 mins';
    }
    
    return { success: true, order: demoOrders[index] };
  }

  // Reviews
  async getReviews(businessId?: string, productId?: string) {
    await delay();
    let filteredReviews = [...demoReviews];
    
    if (businessId) {
      filteredReviews = filteredReviews.filter(r => r.businessId === businessId);
    }
    
    if (productId) {
      filteredReviews = filteredReviews.filter(r => r.productId === productId);
    }
    
    return {
      success: true,
      reviews: filteredReviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
      total: filteredReviews.length
    };
  }

  async createReview(reviewData: Partial<Review>) {
    await delay(1000);
    const newReview: Review = {
      id: Date.now().toString(),
      userId: reviewData.userId || '',
      businessId: reviewData.businessId || '',
      productId: reviewData.productId,
      rating: reviewData.rating || 5,
      comment: reviewData.comment || '',
      images: reviewData.images,
      createdAt: new Date(),
      helpful: 0,
      isVerifiedPurchase: true
    };
    demoReviews.push(newReview);
    return { success: true, review: newReview };
  }

  // Analytics
  async getAnalytics() {
    await delay(1200);
    return {
      success: true,
      ...demoAnalytics
    };
  }

  // AI Recommendations
  async getRecommendations(userId: string) {
    await delay(800);
    return {
      success: true,
      ...demoRecommendations
    };
  }

  // Chat
  async getChatMessages() {
    await delay();
    return {
      success: true,
      messages: demoChatMessages
    };
  }

  async sendChatMessage(message: string, userId: string) {
    await delay(500);
    const newMessage = {
      id: Date.now().toString(),
      senderId: userId,
      message,
      timestamp: new Date(),
      isSupport: false
    };
    demoChatMessages.push(newMessage);
    
    // Simulate support response
    setTimeout(() => {
      const responses = [
        "Thank you for your message. I'm looking into this for you.",
        "I understand your concern. Let me help you with that.",
        "That's a great question! Here's what I can tell you:",
        "I've noted your feedback. Is there anything else I can help with?"
      ];
      const supportResponse = {
        id: (Date.now() + 1).toString(),
        senderId: 'support',
        message: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
        isSupport: true
      };
      demoChatMessages.push(supportResponse);
    }, 2000);
    
    return { success: true, message: newMessage };
  }

  // Delivery Tracking
  async getDeliveryTracking(orderId: string) {
    await delay(600);
    return {
      success: true,
      orderId,
      status: 'in_transit',
      estimatedTime: 25,
      currentLocation: {
        lat: 28.6139,
        lng: 77.2090,
        address: 'Near Central Park, Delhi'
      },
      deliveryPartner: {
        name: 'Rajesh Kumar',
        phone: '+91-9876543210',
        rating: 4.8,
        vehicle: 'Motorcycle'
      },
      timeline: [
        {
          status: 'Order Placed',
          timestamp: new Date(Date.now() - 3600000),
          note: 'Order received and being prepared'
        },
        {
          status: 'Preparing',
          timestamp: new Date(Date.now() - 2400000),
          note: 'Kitchen started preparing your order'
        },
        {
          status: 'Picked Up',
          timestamp: new Date(Date.now() - 1200000),
          note: 'Order picked up by delivery partner'
        },
        {
          status: 'In Transit',
          timestamp: new Date(Date.now() - 600000),
          note: 'On the way to your location'
        }
      ]
    };
  }

  // Media Upload
  async uploadMedia(file: File) {
    await delay(2000);
    // Simulate file upload
    const mockUrl = URL.createObjectURL(file);
    return {
      success: true,
      url: mockUrl,
      filename: file.name,
      size: file.size,
      mimeType: file.type
    };
  }

  // Search
  async search(query: string, type: 'all' | 'businesses' | 'products' = 'all') {
    await delay(600);
    const searchTerm = query.toLowerCase();
    
    let results: any = {};
    
    if (type === 'all' || type === 'businesses') {
      results.businesses = demoBusinesses.filter(b =>
        b.name.toLowerCase().includes(searchTerm) ||
        b.description.toLowerCase().includes(searchTerm) ||
        b.cuisine.some(c => c.toLowerCase().includes(searchTerm))
      );
    }
    
    if (type === 'all' || type === 'products') {
      results.products = demoProducts.filter(p =>
        p.name.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm) ||
        p.ingredients.some(i => i.toLowerCase().includes(searchTerm))
      );
    }
    
    return {
      success: true,
      query,
      ...results,
      total: (results.businesses?.length || 0) + (results.products?.length || 0)
    };
  }
}

export const mockApi = new MockApiService();
export default mockApi;
