# Multiple Business Tiffin Service Platform

A comprehensive full-stack web application for managing multiple tiffin service businesses with features for customers, business owners, and administrators.

## 🚀 Features

### For Customers
- **User Registration & Authentication** - Secure signup/login with JWT
- **Browse Businesses** - Discover multiple tiffin service providers
- **Product Catalog** - View detailed tiffin menus with prices and descriptions
- **Shopping Cart** - Add/remove items, manage quantities
- **Order Management** - Place orders, track delivery status
- **Subscription Plans** - Weekly/monthly tiffin subscriptions
- **Reviews & Ratings** - Rate and review businesses and products
- **Wishlist** - Save favorite items for later
- **Loyalty Points** - Earn and redeem loyalty rewards
- **Promo Codes** - Apply discount codes and offers
- **Advanced Search** - Filter by location, cuisine, price range

### For Business Owners
- **Business Dashboard** - Comprehensive analytics and insights
- **Product Management** - Add, edit, delete tiffin items
- **Order Management** - Process and track customer orders
- **Customer Management** - View customer profiles and order history
- **Notification System** - Send updates to customers
- **Promo Code Creation** - Create discount campaigns
- **Business Profile** - Manage business information and settings

### For Administrators
- **Admin Dashboard** - System-wide analytics and reporting
- **Business Approval** - Review and approve new business registrations
- **User Management** - Manage customer and business accounts
- **Content Moderation** - Monitor reviews and ratings
- **System Configuration** - Manage platform settings

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Passport.js** - Authentication middleware
- **Nodemailer** - Email service
- **bcrypt** - Password hashing

### Frontend
- **React.js** - Frontend library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling framework
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Axios** - HTTP client

## 📁 Project Structure

```
├── backend/                 # Node.js backend application
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── services/          # Business logic services
│   └── server.js          # Entry point
├── frontend/               # React frontend application
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── contexts/      # React contexts
│   │   ├── hooks/         # Custom hooks
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── store/         # Redux store
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # Utility functions
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/hbagde424/MultipleBusniess.git
   cd MultipleBusniess
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Create .env file and add your environment variables
   cp .env.example .env
   
   # Start the backend server
   npm start
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   
   # Start the React development server
   npm start
   ```

### Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/tiffin-service
JWT_SECRET=your_jwt_secret_key
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```

## 📚 API Documentation

The backend provides RESTful APIs for all functionality. Key endpoints include:

- **Authentication**: `/api/auth/*`
- **Users**: `/api/users/*`
- **Businesses**: `/api/businesses/*`
- **Products**: `/api/products/*`
- **Orders**: `/api/orders/*`
- **Cart**: `/api/cart/*`
- **Reviews**: `/api/reviews/*`
- **Admin**: `/api/admin/*`

## 🔧 Development

### Backend Development
```bash
cd backend
npm run dev  # Start with nodemon for auto-restart
```

### Frontend Development
```bash
cd frontend
npm start    # Start React development server
```

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📱 Mobile Responsiveness

The application is fully responsive and works seamlessly across:
- Desktop computers
- Tablets
- Mobile phones

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS protection
- Rate limiting
- SQL injection protection

## 🚀 Deployment

### Backend Deployment (Heroku/Railway)
1. Set up environment variables
2. Configure MongoDB Atlas
3. Deploy using Git or Docker

### Frontend Deployment (Netlify/Vercel)
1. Build the React app: `npm run build`
2. Deploy the build folder
3. Configure API endpoints

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Thanks to all contributors who helped build this platform
- Special thanks to the open-source community for the amazing tools and libraries

## 📞 Contact

For questions or support, please reach out:
- GitHub: [@hbagde424](https://github.com/hbagde424)
- Email: [your-email@example.com]

---

**Built with ❤️ for the tiffin service community**