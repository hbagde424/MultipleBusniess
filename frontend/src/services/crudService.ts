// Generic CRUD Service for API operations
class CRUDService {
  private baseURL: string;
  private token: string | null;

  constructor(baseURL: string = '/api') {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('token');
  }

  // Get authorization headers
  private getHeaders(contentType: string = 'application/json') {
    const headers: Record<string, string> = {
      'Content-Type': contentType,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Generic CREATE operation
  async create<T>(endpoint: string, data: any): Promise<T> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Create operation failed:', error);
      throw error;
    }
  }

  // Generic READ operation (GET ALL)
  async readAll<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    try {
      let url = `${this.baseURL}${endpoint}`;
      
      if (params) {
        const searchParams = new URLSearchParams();
        Object.keys(params).forEach(key => {
          if (params[key] !== undefined && params[key] !== null) {
            searchParams.append(key, params[key].toString());
          }
        });
        url += `?${searchParams.toString()}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Read operation failed:', error);
      throw error;
    }
  }

  // Generic READ operation (GET BY ID)
  async readById<T>(endpoint: string, id: string): Promise<T> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}/${id}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Read by ID operation failed:', error);
      throw error;
    }
  }

  // Generic UPDATE operation
  async update<T>(endpoint: string, id: string, data: any): Promise<T> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Update operation failed:', error);
      throw error;
    }
  }

  // Generic DELETE operation
  async delete<T>(endpoint: string, id: string): Promise<T> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Delete operation failed:', error);
      throw error;
    }
  }

  // Update token
  updateToken(newToken: string) {
    this.token = newToken;
    localStorage.setItem('token', newToken);
  }

  // Clear token
  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }
}

// Specific service instances for different entities
export class ProductService extends CRUDService {
  async getAllProducts(filters?: { page?: number; limit?: number; category?: string }) {
    return this.readAll('/products', filters);
  }

  async getProduct(id: string) {
    return this.readById('/products', id);
  }

  async createProduct(productData: any) {
    return this.create('/products', productData);
  }

  async updateProduct(id: string, productData: any) {
    return this.update('/products', id, productData);
  }

  async deleteProduct(id: string) {
    return this.delete('/products', id);
  }

  async getProductsByBusiness(businessId: string) {
    return this.readAll(`/products/business/${businessId}`);
  }
}

export class BusinessService extends CRUDService {
  async getAllBusinesses(filters?: { page?: number; limit?: number; location?: string }) {
    return this.readAll('/businesses', filters);
  }

  async getBusiness(id: string) {
    return this.readById('/businesses', id);
  }

  async createBusiness(businessData: any) {
    return this.create('/businesses', businessData);
  }

  async updateBusiness(id: string, businessData: any) {
    return this.update('/businesses', id, businessData);
  }

  async deleteBusiness(id: string) {
    return this.delete('/businesses', id);
  }

  async getMyBusinesses() {
    return this.readAll('/businesses/my');
  }
}

export class OrderService extends CRUDService {
  async createOrder(orderData: any) {
    return this.create('/orders', orderData);
  }

  async getMyOrders(filters?: { page?: number; limit?: number; status?: string }) {
    return this.readAll('/orders/my-orders', filters);
  }

  async getOrder(id: string) {
    return this.readById('/orders', id);
  }

  async updateOrder(id: string, orderData: any) {
    return this.update('/orders', id, orderData);
  }

  async cancelOrder(id: string) {
    return this.update('/orders/cancel', id, {});
  }

  async reorder(id: string) {
    return this.create(`/orders/reorder/${id}`, {});
  }
}

export class CartService extends CRUDService {
  async getCart() {
    return this.readAll('/cart');
  }

  async addToCart(productId: string, quantity: number) {
    return this.create('/cart/add', { productId, quantity });
  }

  async updateCartItem(productId: string, quantity: number) {
    return this.update('/cart/item', productId, { quantity });
  }

  async removeFromCart(productId: string) {
    return this.delete('/cart/item', productId);
  }

  async clearCart() {
    return this.delete('/cart/clear', '');
  }
}

export class ReviewService extends CRUDService {
  async createReview(reviewData: any) {
    return this.create('/reviews', reviewData);
  }

  async getReviews(filters?: { page?: number; limit?: number }) {
    return this.readAll('/reviews', filters);
  }

  async getProductReviews(productId: string) {
    return this.readAll(`/reviews/product/${productId}`);
  }

  async getBusinessReviews(businessId: string) {
    return this.readAll(`/reviews/business/${businessId}`);
  }

  async updateReview(id: string, reviewData: any) {
    return this.update('/reviews', id, reviewData);
  }

  async deleteReview(id: string) {
    return this.delete('/reviews', id);
  }

  async markHelpful(id: string) {
    return this.create(`/reviews/${id}/helpful`, {});
  }
}

export class WishlistService extends CRUDService {
  async getWishlist() {
    return this.readAll('/wishlist');
  }

  async addToWishlist(productId: string) {
    return this.create('/wishlist/add', { productId });
  }

  async removeFromWishlist(productId: string) {
    return this.delete('/wishlist/remove', productId);
  }

  async clearWishlist() {
    return this.delete('/wishlist/clear', '');
  }
}

export class NotificationService extends CRUDService {
  async getNotifications(filters?: { page?: number; limit?: number }) {
    return this.readAll('/notifications', filters);
  }

  async markAsRead(id: string) {
    return this.update('/notifications', `${id}/read`, {});
  }

  async markAllAsRead() {
    return this.update('/notifications/mark-all-read', '', {});
  }

  async deleteNotification(id: string) {
    return this.delete('/notifications', id);
  }

  async getUnreadCount() {
    return this.readAll('/notifications/unread-count');
  }
}

export class SubscriptionService extends CRUDService {
  async createSubscription(subscriptionData: any) {
    return this.create('/subscriptions', subscriptionData);
  }

  async getSubscriptions(filters?: { status?: string; page?: number; limit?: number }) {
    return this.readAll('/subscriptions', filters);
  }

  async getSubscription(id: string) {
    return this.readById('/subscriptions', id);
  }

  async pauseSubscription(id: string) {
    return this.update('/subscriptions', `${id}/pause`, {});
  }

  async resumeSubscription(id: string) {
    return this.update('/subscriptions', `${id}/resume`, {});
  }

  async cancelSubscription(id: string) {
    return this.delete('/subscriptions', id);
  }
}

// Export service instances
export const productService = new ProductService();
export const businessService = new BusinessService();
export const orderService = new OrderService();
export const cartService = new CartService();
export const reviewService = new ReviewService();
export const wishlistService = new WishlistService();
export const notificationService = new NotificationService();
export const subscriptionService = new SubscriptionService();

export default CRUDService;
