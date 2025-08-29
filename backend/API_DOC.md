# Multi-Business Platform API Documentation

## 🏪 **Multi-Business Support**
This platform now supports ANY type of business - from tiffin services to pickle vendors, cake shops, and more!

## Authentication
- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login and receive JWT token
- `POST /api/auth/forgot-password` — Request password reset token
- `POST /api/auth/reset-password` — Reset password with token
- `POST /api/auth/change-password` — Change password (auth required)

## Users
- `GET /api/users/` — Get all users (admin only)
- `GET /api/users/:id` — Get user by ID (self or admin)
- `PUT /api/users/:id` — Update user (self or admin)
- `DELETE /api/users/:id` — Delete user (admin only)

## 🏢 Businesses
- `GET /api/businesses/` — Get all businesses (public, filter by category)
- `GET /api/businesses/:id` — Get business details (public)
- `POST /api/businesses/` — Create business (auth required)
- `GET /api/businesses/owner/my-businesses` — Get my businesses (business owner)
- `PUT /api/businesses/:id` — Update business (owner or admin)
- `DELETE /api/businesses/:id` — Delete business (owner or admin)

## 🛍️ Products
- `GET /api/products/` — Get all products (public, filter by category/business)
- `GET /api/products/:id` — Get product details (public)
- `GET /api/products/business/:businessId` — Get products by business (public)
- `POST /api/products/` — Create product (business owner or admin)
- `PUT /api/products/:id` — Update product (business owner or admin)
- `DELETE /api/products/:id` — Delete product (business owner or admin)

## 🛒 Orders
- `GET /api/orders/` — Get all orders (admin only)
- `POST /api/orders/` — Create order (auth required)
- `GET /api/orders/my-orders` — Get user's order history (auth required)
- `GET /api/orders/business/:businessId` — Get business orders (business owner)
- `PUT /api/orders/:id` — Update order status (admin only)
- `DELETE /api/orders/:id` — Delete order (admin only)

## ⭐ Reviews
- `GET /api/reviews/` — Get all reviews (public)
- `GET /api/reviews/product/:productId` — Get reviews for specific product (public)
- `GET /api/reviews/business/:businessId` — Get reviews for business (public)
- `POST /api/reviews/` — Create review (auth required)
- `PUT /api/reviews/:id` — Update review (owner or admin)
- `DELETE /api/reviews/:id` — Delete review (owner or admin)

## 📊 Admin Dashboard
- `GET /api/admin/stats` — Get admin dashboard statistics (admin only)

## 🔐 Authorization
- **Customer**: Can register, order, review
- **Business Owner**: Can manage their businesses and products
- **Admin**: Full access to all features

---

# 🎯 **Business Categories Supported**
- 🍱 **Food & Tiffin Services**
- 🎂 **Bakery & Cakes**
- 🥒 **Pickles & Preserves**
- 🍬 **Sweets & Confectionery**
- 🍽️ **Restaurants**
- 🛒 **Grocery & General**
- 📦 **Other**

# 📝 **Sample API Requests**

## Register Business Owner
```json
POST /api/auth/register
{
  "name": "Raj Pickle Store",
  "email": "raj@pickles.com",
  "password": "password123",
  "role": "business_owner"
}
```

## Create Business
```json
POST /api/businesses
{
  "name": "Raj's Authentic Pickles",
  "description": "Traditional homemade pickles",
  "category": "pickles",
  "address": "Mumbai, Maharashtra",
  "phone": "9876543210",
  "email": "raj@pickles.com"
}
```

## Create Product (Pickle)
```json
POST /api/products
{
  "name": "Mango Pickle",
  "description": "Spicy traditional mango pickle",
  "price": 150,
  "category": "pickle",
  "business": "business_id_here",
  "ingredients": ["Mango", "Spices", "Oil"],
  "stock": 50,
  "unit": "jar"
}
```

## Create Product (Cake)
```json
POST /api/products
{
  "name": "Chocolate Cake",
  "description": "Rich chocolate birthday cake",
  "price": 800,
  "category": "cake",
  "business": "bakery_business_id",
  "ingredients": ["Chocolate", "Flour", "Eggs"],
  "stock": 10,
  "unit": "piece"
}
```

## Create Order
```json
POST /api/orders
{
  "business": "business_id_here",
  "items": [
    {
      "product": "product_id_here",
      "quantity": 2,
      "price": 150
    }
  ],
  "deliveryAddress": "123 Main Street, Mumbai",
  "phone": "9876543210",
  "notes": "Please deliver between 2-4 PM"
}
```

---

# ✅ **Features Available**
- 🏪 **Multi-business support** (any business type)
- 👥 **Role-based access** (Customer, Business Owner, Admin)
- 🛍️ **Product management** with categories
- 🛒 **Shopping cart & orders** with multiple items
- ⭐ **Reviews & ratings** for products and businesses
- 📊 **Admin dashboard** with comprehensive stats
- 🔐 **Secure authentication** with password reset
- 📱 **Mobile-friendly** API structure

Your platform is now ready for ANY business to sell online! 🚀
