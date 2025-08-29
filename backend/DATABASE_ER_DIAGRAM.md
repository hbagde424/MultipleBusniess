# 🗃️ **Multi-Business Platform - Entity Relationship Diagram**

## 📊 **Database ER Diagram**

```
                    ┌─────────────────────────────────────────────────────────────────────────────────────┐
                    │                          MULTI-BUSINESS PLATFORM                                   │
                    │                           DATABASE ER DIAGRAM                                      │
                    └─────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────┐         ┌─────────────────────┐         ┌─────────────────────┐
│       USER          │         │      BUSINESS       │         │      PRODUCT        │
├─────────────────────┤         ├─────────────────────┤         ├─────────────────────┤
│ PK _id: ObjectId    │────────▷│ PK _id: ObjectId    │────────▷│ PK _id: ObjectId    │
│    name: String     │    1:N  │    name: String     │    1:N  │    name: String     │
│    email: String*   │         │    description: Text│         │    description: Text│
│    password: String │         │    category: Enum   │         │    price: Number    │
│    address: String  │         │ FK owner: ObjectId  │         │    discountPrice: #  │
│    phone: String    │         │    address: String  │         │    category: Enum   │
│    role: Enum       │         │    phone: String    │         │ FK business: ObjId  │
│    googleId: String │         │    email: String    │         │    ingredients: []  │
│    facebookId: Str  │         │    logo: String     │         │    images: [String] │
│    profileImage: St │         │    images: [String] │         │    available: Bool  │
│    loginMethod: Enum│         │    businessHours: []│         │    stock: Number    │
│    isEmailVerified │         │    deliveryRadius: #│         │    unit: String     │
│    preferences: {}  │         │    minOrderAmount: #│         │    minQuantity: #   │
│    isActive: Bool   │         │    deliveryCharge: #│         │    maxQuantity: #   │
│    lastLogin: Date  │         │    rating: Number   │         │    preparationTime  │
│    createdAt: Date  │         │    totalReviews: #  │         │    tags: [String]   │
│    updatedAt: Date  │         │    isVerified: Bool │         │    nutritionInfo: {}│
└─────────────────────┘         │    isActive: Bool   │         │    bulkPricing: []  │
           │                    │    createdAt: Date  │         │    rating: Number   │
           │                    └─────────────────────┘         │    totalReviews: #  │
           │                                                    │    totalSold: #     │
           │                                                    │    isSpecial: Bool  │
           │                                                    │    createdAt: Date  │
           │                                                    └─────────────────────┘
           │                                                               │
           │                                                               │
           ▼                                                               ▼
┌─────────────────────┐         ┌─────────────────────┐         ┌─────────────────────┐
│       ORDER         │         │       REVIEW        │         │      WISHLIST       │
├─────────────────────┤         ├─────────────────────┤         ├─────────────────────┤
│ PK _id: ObjectId    │         │ PK _id: ObjectId    │         │ PK _id: ObjectId    │
│    orderNumber: Str*│         │ FK user: ObjectId   │         │ FK user: ObjectId   │
│ FK user: ObjectId   │         │ FK product: ObjId   │         │ FK product: ObjId   │
│ FK business: ObjId  │         │ FK business: ObjId  │         │    addedAt: Date    │
│    items: [         │         │    rating: Number   │         └─────────────────────┘
│      {              │         │    comment: Text    │
│        product: Obj │         │    images: [String] │
│        quantity: #  │         │    isVerified: Bool │         ┌─────────────────────┐
│        price: #     │         │    helpfulVotes: #  │         │        CART         │
│      }              │         │    createdAt: Date  │         ├─────────────────────┤
│    ]                │         └─────────────────────┘         │ PK _id: ObjectId    │
│    subtotal: Number │                                         │ FK user: ObjectId   │
│    deliveryCharge:#│                                         │ FK business: ObjId  │
│    promoDiscount: # │                                         │    items: [         │
│    totalAmount: #   │                                         │      {              │
│    paymentMethod: E │                                         │        product: Obj │
│    paymentStatus: E │                                         │        quantity: #  │
│    paymentDetails:{}│                                         │        price: #     │
│    status: Enum     │                                         │      }              │
│    deliveryType: E  │                                         │    ]                │
│    deliveryAddress │                                         │    subtotal: Number │
│    phone: String    │                                         │    totalAmount: #   │
│    statusHistory: []│                                         │    createdAt: Date  │
│    loyaltyPointsEar │                                         │    updatedAt: Date  │
│    loyaltyPointsUse │                                         └─────────────────────┘
│    orderDate: Date  │
│    deliveryDate: D  │
│    createdAt: Date  │
└─────────────────────┘


┌─────────────────────┐         ┌─────────────────────┐         ┌─────────────────────┐
│     PROMOCODE       │         │   LOYALTYPOINT      │         │   NOTIFICATION      │
├─────────────────────┤         ├─────────────────────┤         ├─────────────────────┤
│ PK _id: ObjectId    │         │ PK _id: ObjectId    │         │ PK _id: ObjectId    │
│    code: String*    │         │ FK user: ObjectId   │         │ FK user: ObjectId   │
│    description: Text│         │    points: Number   │         │    title: String    │
│    discountType: E  │         │    type: Enum       │         │    message: Text    │
│    discountValue: # │         │    reason: String   │         │    type: Enum       │
│    minOrderAmount:# │         │ FK order: ObjectId  │         │    relatedTo: {     │
│    maxDiscountAmt:# │         │    expiresAt: Date  │         │      type: String   │
│    validFrom: Date  │         │    isUsed: Boolean  │         │      id: ObjectId   │
│    validTill: Date  │         │    createdAt: Date  │         │    }                │
│    usageLimit: #    │         └─────────────────────┘         │    isRead: Boolean  │
│    usedCount: #     │                                         │    priority: Enum   │
│    applicableTo: E  │                                         │    createdAt: Date  │
│    applicableBusine │                                         │    expiresAt: Date  │
│    applicableCateg  │                                         └─────────────────────┘
│    applicableProdu  │
│    isActive: Bool   │
│ FK createdBy: ObjId │         ┌─────────────────────┐
│    createdAt: Date  │         │   SUBSCRIPTION      │
└─────────────────────┘         ├─────────────────────┤
                                │ PK _id: ObjectId    │
                                │ FK user: ObjectId   │
                                │ FK business: ObjId  │
                                │    subscriptionName │
                                │    items: [         │
                                │      {              │
                                │        product: Obj │
                                │        quantity: #  │
                                │        price: #     │
                                │      }              │
                                │    ]                │
                                │    frequency: Enum  │
                                │    startDate: Date  │
                                │    endDate: Date    │
                                │    totalAmount: #   │
                                │    deliveryAddress  │
                                │    deliveryTime: {  │
                                │      startTime: Str │
                                │      endTime: Str   │
                                │    }                │
                                │    deliveryDays: [] │
                                │    paymentMethod: E │
                                │    nextDeliveryDate │
                                │    pausedUntil: Date│
                                │    isActive: Bool   │
                                │    createdAt: Date  │
                                │    updatedAt: Date  │
                                └─────────────────────┘
```

## 🔗 **Relationships & Cardinalities**

### **Primary Relationships:**

1. **USER ↔ BUSINESS** (1:N)
   - One User can own multiple Businesses
   - Each Business has one Owner (User)

2. **BUSINESS ↔ PRODUCT** (1:N)  
   - One Business can have multiple Products
   - Each Product belongs to one Business

3. **USER ↔ ORDER** (1:N)
   - One User can place multiple Orders
   - Each Order belongs to one User

4. **BUSINESS ↔ ORDER** (1:N)
   - One Business can receive multiple Orders  
   - Each Order is placed with one Business

5. **PRODUCT ↔ ORDER** (M:N)
   - Products can be in multiple Orders
   - Orders can contain multiple Products
   - *Relationship through ORDER.items array*

6. **USER ↔ REVIEW** (1:N)
   - One User can write multiple Reviews
   - Each Review is written by one User

7. **PRODUCT ↔ REVIEW** (1:N)
   - One Product can have multiple Reviews
   - Each Review is for one Product

8. **USER ↔ WISHLIST** (1:N)
   - One User can have multiple Wishlist items
   - Each Wishlist item belongs to one User

9. **PRODUCT ↔ WISHLIST** (1:N)
   - One Product can be in multiple Wishlists
   - Each Wishlist item contains one Product

10. **USER ↔ CART** (1:1)
    - One User has one Cart per Business
    - Each Cart belongs to one User

11. **BUSINESS ↔ CART** (1:N)
    - One Business can have multiple Carts
    - Each Cart is for one Business

12. **USER ↔ LOYALTYPOINT** (1:N)
    - One User can have multiple Loyalty Point transactions
    - Each transaction belongs to one User

13. **USER ↔ NOTIFICATION** (1:N)
    - One User can receive multiple Notifications
    - Each Notification is sent to one User

14. **USER ↔ SUBSCRIPTION** (1:N)
    - One User can have multiple Subscriptions
    - Each Subscription belongs to one User

15. **BUSINESS ↔ SUBSCRIPTION** (1:N)
    - One Business can have multiple Subscriptions
    - Each Subscription is with one Business

## 🔑 **Key Constraints & Indexes**

### **Unique Constraints:**
- `USER.email` - Unique
- `PROMOCODE.code` - Unique  
- `ORDER.orderNumber` - Unique

### **Enum Values:**
- `USER.role`: ['customer', 'business_owner', 'admin']
- `USER.loginMethod`: ['email', 'google', 'facebook']
- `BUSINESS.category`: ['food', 'tiffin', 'bakery', 'pickles', 'sweets', 'restaurant', 'grocery', 'other']
- `PRODUCT.category`: ['tiffin', 'cake', 'pickle', 'sweet', 'snack', 'beverage', 'main-course', 'dessert', 'other']
- `ORDER.paymentMethod`: ['COD', 'online', 'wallet']
- `ORDER.paymentStatus`: ['pending', 'paid', 'failed', 'refunded']
- `ORDER.status`: ['pending', 'confirmed', 'preparing', 'ready', 'picked_up', 'delivered', 'cancelled']
- `PROMOCODE.discountType`: ['percentage', 'fixed']
- `LOYALTYPOINT.type`: ['earned', 'redeemed', 'expired']
- `NOTIFICATION.type`: ['order', 'promo', 'business', 'system', 'payment']
- `SUBSCRIPTION.frequency`: ['daily', 'weekly', 'monthly']

### **Foreign Key References:**
- `BUSINESS.owner` → `USER._id`
- `PRODUCT.business` → `BUSINESS._id`
- `ORDER.user` → `USER._id`
- `ORDER.business` → `BUSINESS._id`
- `ORDER.items.product` → `PRODUCT._id`
- `REVIEW.user` → `USER._id`
- `REVIEW.product` → `PRODUCT._id`
- `REVIEW.business` → `BUSINESS._id`
- `WISHLIST.user` → `USER._id`
- `WISHLIST.product` → `PRODUCT._id`
- `CART.user` → `USER._id`
- `CART.business` → `BUSINESS._id`
- `CART.items.product` → `PRODUCT._id`
- `LOYALTYPOINT.user` → `USER._id`
- `LOYALTYPOINT.order` → `ORDER._id`
- `NOTIFICATION.user` → `USER._id`
- `SUBSCRIPTION.user` → `USER._id`
- `SUBSCRIPTION.business` → `BUSINESS._id`
- `SUBSCRIPTION.items.product` → `PRODUCT._id`

---

**Legend:**
- `PK` = Primary Key
- `FK` = Foreign Key  
- `*` = Unique Index
- `#` = Number
- `E` = Enum
- `[]` = Array
- `{}` = Object
- `→` = References
- `1:N` = One to Many
- `M:N` = Many to Many
