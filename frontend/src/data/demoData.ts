// Demo Data for Tifine Multi-Business Platform
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: 'customer' | 'business_owner' | 'admin';
  address?: string;
  preferences?: string[];
}

export interface Business {
  id: string;
  name: string;
  description: string;
  category: string;
  image: string;
  rating: number;
  totalReviews: number;
  deliveryTime: string;
  deliveryFee: number;
  minOrder: number;
  isOpen: boolean;
  cuisine: string[];
  address: string;
  phone: string;
  email: string;
  ownerId: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  businessId: string;
  isVegetarian: boolean;
  isSpicy: boolean;
  isPopular: boolean;
  rating: number;
  reviews: number;
  cookingTime: number;
  ingredients: string[];
  nutritionInfo: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface Order {
  id: string;
  userId: string;
  businessId: string;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
    name: string;
  }>;
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  totalAmount: number;
  deliveryAddress: string;
  deliveryFee: number;
  estimatedDeliveryTime: string;
  actualDeliveryTime?: string;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
  createdAt: Date;
  deliveryPartnerId?: string;
}

export interface Review {
  id: string;
  userId: string;
  businessId: string;
  productId?: string;
  rating: number;
  comment: string;
  images?: string[];
  createdAt: Date;
  helpful: number;
  isVerifiedPurchase: boolean;
}

// Demo Users
export const demoUsers: User[] = [
  {
    id: '1',
    name: 'Rahul Sharma',
    email: 'rahul@example.com',
    phone: '+91-9876543210',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    role: 'customer',
    address: '123 MG Road, Delhi, 110001',
    preferences: ['Indian', 'Italian', 'Chinese']
  },
  {
    id: '2',
    name: 'Priya Patel',
    email: 'priya@example.com',
    phone: '+91-9876543211',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face',
    role: 'customer',
    address: '456 Park Street, Mumbai, 400001'
  },
  {
    id: '3',
    name: 'Chef Ramesh Kumar',
    email: 'ramesh@delhidelights.com',
    phone: '+91-9876543212',
    avatar: 'https://images.unsplash.com/photo-1566554273541-37a9ca77b91e?w=150&h=150&fit=crop&crop=face',
    role: 'business_owner',
    address: '789 Connaught Place, Delhi, 110001'
  }
];

// Demo Businesses
export const demoBusinesses: Business[] = [
  {
    id: '1',
    name: 'Delhi Delights',
    description: 'Authentic North Indian cuisine with traditional flavors',
    category: 'Indian',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&h=400&fit=crop',
    rating: 4.5,
    totalReviews: 1250,
    deliveryTime: '25-35 mins',
    deliveryFee: 30,
    minOrder: 200,
    isOpen: true,
    cuisine: ['North Indian', 'Punjabi', 'Vegetarian'],
    address: '123 Karol Bagh, Delhi',
    phone: '+91-11-12345678',
    email: 'orders@delhidelights.com',
    ownerId: '3'
  },
  {
    id: '2',
    name: 'Mumbai Masala',
    description: 'Street food and regional specialties from Mumbai',
    category: 'Street Food',
    image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=600&h=400&fit=crop',
    rating: 4.2,
    totalReviews: 890,
    deliveryTime: '30-40 mins',
    deliveryFee: 25,
    minOrder: 150,
    isOpen: true,
    cuisine: ['Mumbai Street Food', 'Maharashtrian', 'Chaat'],
    address: '456 Andheri West, Mumbai',
    phone: '+91-22-98765432',
    email: 'hello@mumbaimasala.com',
    ownerId: '3'
  },
  {
    id: '3',
    name: 'Pasta Paradise',
    description: 'Authentic Italian pasta and pizza',
    category: 'Italian',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop',
    rating: 4.7,
    totalReviews: 675,
    deliveryTime: '20-30 mins',
    deliveryFee: 40,
    minOrder: 300,
    isOpen: true,
    cuisine: ['Italian', 'Continental', 'Pizza'],
    address: '789 Bandra, Mumbai',
    phone: '+91-22-87654321',
    email: 'orders@pastaparadise.com',
    ownerId: '3'
  },
  {
    id: '4',
    name: 'Biryani House',
    description: 'Hyderabadi and Lucknowi biryanis with authentic flavors',
    category: 'Biryani',
    image: 'https://images.unsplash.com/photo-1563379091339-03246963d51a?w=600&h=400&fit=crop',
    rating: 4.6,
    totalReviews: 2100,
    deliveryTime: '35-45 mins',
    deliveryFee: 35,
    minOrder: 250,
    isOpen: true,
    cuisine: ['Hyderabadi', 'Lucknowi', 'Mughlai'],
    address: '321 Old City, Hyderabad',
    phone: '+91-40-23456789',
    email: 'orders@biryanihouse.com',
    ownerId: '3'
  }
];

// Demo Products
export const demoProducts: Product[] = [
  // Delhi Delights Products
  {
    id: '1',
    name: 'Butter Chicken',
    description: 'Creamy tomato-based curry with tender chicken pieces',
    price: 320,
    originalPrice: 380,
    image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400&h=300&fit=crop',
    category: 'Main Course',
    businessId: '1',
    isVegetarian: false,
    isSpicy: true,
    isPopular: true,
    rating: 4.6,
    reviews: 234,
    cookingTime: 25,
    ingredients: ['Chicken', 'Tomatoes', 'Cream', 'Butter', 'Spices'],
    nutritionInfo: { calories: 450, protein: 35, carbs: 12, fat: 28 }
  },
  {
    id: '2',
    name: 'Paneer Makhani',
    description: 'Rich and creamy cottage cheese curry',
    price: 280,
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop',
    category: 'Main Course',
    businessId: '1',
    isVegetarian: true,
    isSpicy: false,
    isPopular: true,
    rating: 4.4,
    reviews: 189,
    cookingTime: 20,
    ingredients: ['Paneer', 'Tomatoes', 'Cream', 'Cashews', 'Spices'],
    nutritionInfo: { calories: 380, protein: 18, carbs: 15, fat: 25 }
  },
  {
    id: '3',
    name: 'Garlic Naan',
    description: 'Soft bread topped with garlic and butter',
    price: 80,
    image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop',
    category: 'Bread',
    businessId: '1',
    isVegetarian: true,
    isSpicy: false,
    isPopular: false,
    rating: 4.3,
    reviews: 156,
    cookingTime: 15,
    ingredients: ['Flour', 'Garlic', 'Butter', 'Yogurt'],
    nutritionInfo: { calories: 220, protein: 6, carbs: 35, fat: 8 }
  },

  // Mumbai Masala Products
  {
    id: '4',
    name: 'Vada Pav',
    description: 'Mumbai\'s famous street food burger',
    price: 60,
    image: 'https://images.unsplash.com/photo-1626132647523-66f1dee50c87?w=400&h=300&fit=crop',
    category: 'Street Food',
    businessId: '2',
    isVegetarian: true,
    isSpicy: true,
    isPopular: true,
    rating: 4.5,
    reviews: 312,
    cookingTime: 10,
    ingredients: ['Potato', 'Gram flour', 'Bread', 'Chutney'],
    nutritionInfo: { calories: 300, protein: 8, carbs: 45, fat: 12 }
  },
  {
    id: '5',
    name: 'Pav Bhaji',
    description: 'Spiced vegetable curry with buttered bread rolls',
    price: 140,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop',
    category: 'Street Food',
    businessId: '2',
    isVegetarian: true,
    isSpicy: true,
    isPopular: true,
    rating: 4.7,
    reviews: 298,
    cookingTime: 15,
    ingredients: ['Mixed vegetables', 'Butter', 'Bread', 'Spices'],
    nutritionInfo: { calories: 420, protein: 12, carbs: 55, fat: 18 }
  },

  // Pasta Paradise Products
  {
    id: '6',
    name: 'Chicken Alfredo Pasta',
    description: 'Creamy white sauce pasta with grilled chicken',
    price: 380,
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop',
    category: 'Pasta',
    businessId: '3',
    isVegetarian: false,
    isSpicy: false,
    isPopular: true,
    rating: 4.8,
    reviews: 245,
    cookingTime: 20,
    ingredients: ['Pasta', 'Chicken', 'Cream', 'Parmesan', 'Herbs'],
    nutritionInfo: { calories: 520, protein: 32, carbs: 45, fat: 24 }
  },
  {
    id: '7',
    name: 'Margherita Pizza',
    description: 'Classic pizza with tomato sauce, mozzarella, and basil',
    price: 420,
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=300&fit=crop',
    category: 'Pizza',
    businessId: '3',
    isVegetarian: true,
    isSpicy: false,
    isPopular: true,
    rating: 4.6,
    reviews: 198,
    cookingTime: 25,
    ingredients: ['Pizza base', 'Tomato sauce', 'Mozzarella', 'Basil'],
    nutritionInfo: { calories: 480, protein: 22, carbs: 52, fat: 20 }
  },

  // Biryani House Products
  {
    id: '8',
    name: 'Hyderabadi Chicken Biryani',
    description: 'Aromatic basmati rice with spiced chicken pieces',
    price: 450,
    originalPrice: 520,
    image: 'https://images.unsplash.com/photo-1563379091339-03246963d51a?w=400&h=300&fit=crop',
    category: 'Biryani',
    businessId: '4',
    isVegetarian: false,
    isSpicy: true,
    isPopular: true,
    rating: 4.9,
    reviews: 567,
    cookingTime: 40,
    ingredients: ['Basmati rice', 'Chicken', 'Saffron', 'Yogurt', 'Spices'],
    nutritionInfo: { calories: 620, protein: 38, carbs: 65, fat: 22 }
  },
  {
    id: '9',
    name: 'Vegetable Biryani',
    description: 'Fragrant rice with mixed vegetables and aromatic spices',
    price: 320,
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&h=300&fit=crop',
    category: 'Biryani',
    businessId: '4',
    isVegetarian: true,
    isSpicy: true,
    isPopular: false,
    rating: 4.4,
    reviews: 234,
    cookingTime: 35,
    ingredients: ['Basmati rice', 'Mixed vegetables', 'Saffron', 'Spices'],
    nutritionInfo: { calories: 480, protein: 12, carbs: 78, fat: 15 }
  }
];

// Demo Orders
export const demoOrders: Order[] = [
  {
    id: '1',
    userId: '1',
    businessId: '1',
    items: [
      { productId: '1', quantity: 1, price: 320, name: 'Butter Chicken' },
      { productId: '3', quantity: 2, price: 80, name: 'Garlic Naan' }
    ],
    status: 'delivered',
    totalAmount: 510,
    deliveryAddress: '123 MG Road, Delhi, 110001',
    deliveryFee: 30,
    estimatedDeliveryTime: '25-35 mins',
    actualDeliveryTime: '28 mins',
    paymentMethod: 'UPI',
    paymentStatus: 'paid',
    createdAt: new Date('2024-01-15T14:30:00'),
    deliveryPartnerId: 'dp1'
  },
  {
    id: '2',
    userId: '1',
    businessId: '4',
    items: [
      { productId: '8', quantity: 1, price: 450, name: 'Hyderabadi Chicken Biryani' }
    ],
    status: 'out_for_delivery',
    totalAmount: 485,
    deliveryAddress: '123 MG Road, Delhi, 110001',
    deliveryFee: 35,
    estimatedDeliveryTime: '35-45 mins',
    paymentMethod: 'Card',
    paymentStatus: 'paid',
    createdAt: new Date('2024-01-20T19:15:00'),
    deliveryPartnerId: 'dp2'
  },
  {
    id: '3',
    userId: '2',
    businessId: '3',
    items: [
      { productId: '6', quantity: 1, price: 380, name: 'Chicken Alfredo Pasta' },
      { productId: '7', quantity: 1, price: 420, name: 'Margherita Pizza' }
    ],
    status: 'preparing',
    totalAmount: 840,
    deliveryAddress: '456 Park Street, Mumbai, 400001',
    deliveryFee: 40,
    estimatedDeliveryTime: '20-30 mins',
    paymentMethod: 'Wallet',
    paymentStatus: 'paid',
    createdAt: new Date('2024-01-22T18:45:00')
  }
];

// Demo Reviews
export const demoReviews: Review[] = [
  {
    id: '1',
    userId: '1',
    businessId: '1',
    productId: '1',
    rating: 5,
    comment: 'Absolutely delicious! The butter chicken was creamy and perfectly spiced.',
    images: ['https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=300&h=200&fit=crop'],
    createdAt: new Date('2024-01-16T10:30:00'),
    helpful: 12,
    isVerifiedPurchase: true
  },
  {
    id: '2',
    userId: '2',
    businessId: '2',
    productId: '4',
    rating: 4,
    comment: 'Great vada pav! Reminded me of authentic Mumbai street food.',
    createdAt: new Date('2024-01-18T15:20:00'),
    helpful: 8,
    isVerifiedPurchase: true
  },
  {
    id: '3',
    userId: '1',
    businessId: '4',
    productId: '8',
    rating: 5,
    comment: 'Best biryani I\'ve had in years! The aroma and taste were exceptional.',
    images: ['https://images.unsplash.com/photo-1563379091339-03246963d51a?w=300&h=200&fit=crop'],
    createdAt: new Date('2024-01-21T20:15:00'),
    helpful: 15,
    isVerifiedPurchase: true
  }
];

// Analytics Demo Data
export const demoAnalytics = {
  totalUsers: 15847,
  totalBusinesses: 342,
  totalOrders: 28567,
  totalRevenue: 1245000,
  monthlyGrowth: {
    users: 12.5,
    orders: 18.3,
    revenue: 22.7
  },
  popularCuisines: [
    { name: 'Indian', orders: 8543, percentage: 29.9 },
    { name: 'Italian', orders: 5421, percentage: 19.0 },
    { name: 'Chinese', orders: 4231, percentage: 14.8 },
    { name: 'Mexican', orders: 3456, percentage: 12.1 },
    { name: 'Thai', orders: 2876, percentage: 10.1 }
  ],
  orderTrends: [
    { month: 'Jan', orders: 2345, revenue: 89000 },
    { month: 'Feb', orders: 2567, revenue: 95000 },
    { month: 'Mar', orders: 2890, revenue: 108000 },
    { month: 'Apr', orders: 3123, revenue: 118000 },
    { month: 'May', orders: 3456, revenue: 129000 },
    { month: 'Jun', orders: 3789, revenue: 142000 }
  ],
  topBusinesses: [
    { name: 'Delhi Delights', orders: 1234, revenue: 45600 },
    { name: 'Mumbai Masala', orders: 987, revenue: 38900 },
    { name: 'Pasta Paradise', orders: 876, revenue: 52100 },
    { name: 'Biryani House', orders: 1456, revenue: 67800 }
  ]
};

// Chat Demo Data
export const demoChatMessages = [
  {
    id: '1',
    senderId: 'support',
    message: 'Hello! How can I help you today?',
    timestamp: new Date(Date.now() - 300000),
    isSupport: true
  },
  {
    id: '2',
    senderId: '1',
    message: 'I have a question about my recent order',
    timestamp: new Date(Date.now() - 240000),
    isSupport: false
  },
  {
    id: '3',
    senderId: 'support',
    message: 'I\'d be happy to help! Can you please share your order ID?',
    timestamp: new Date(Date.now() - 180000),
    isSupport: true
  }
];

// AI Recommendations Demo Data
export const demoRecommendations = {
  personalizedItems: [
    {
      id: '1',
      name: 'Butter Chicken',
      image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400&h=300&fit=crop',
      price: 320,
      rating: 4.6,
      reason: 'Based on your previous orders'
    },
    {
      id: '8',
      name: 'Hyderabadi Chicken Biryani',
      image: 'https://images.unsplash.com/photo-1563379091339-03246963d51a?w=400&h=300&fit=crop',
      price: 450,
      rating: 4.9,
      reason: 'Popular in your area'
    }
  ],
  trendingNow: [
    {
      id: '4',
      name: 'Vada Pav',
      image: 'https://images.unsplash.com/photo-1626132647523-66f1dee50c87?w=400&h=300&fit=crop',
      price: 60,
      rating: 4.5,
      orders: 312
    }
  ],
  similarUsers: [
    {
      id: '6',
      name: 'Chicken Alfredo Pasta',
      image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop',
      price: 380,
      rating: 4.8,
      reason: 'Users like you also ordered'
    }
  ]
};

export default {
  users: demoUsers,
  businesses: demoBusinesses,
  products: demoProducts,
  orders: demoOrders,
  reviews: demoReviews,
  analytics: demoAnalytics,
  chatMessages: demoChatMessages,
  recommendations: demoRecommendations
};
