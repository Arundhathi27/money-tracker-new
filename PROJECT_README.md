# Money Tracker - Full Stack Application

A complete money tracking application with React frontend and Node.js Express backend, integrated with MongoDB.

## 🏗️ Architecture

```
money-tracker/
├── frontend/                 # React application (existing)
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── views/           # Page components
│   │   ├── services/        # API service layer
│   │   └── ...
│   └── package.json
├── backend/                 # Node.js Express API
│   ├── config/             # Database configuration
│   ├── middleware/         # Authentication & security
│   ├── routes/             # API endpoints
│   ├── .env               # Environment variables
│   └── server.js          # Main server file
└── start-dev.bat          # Development startup script
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Git

### 1. Clone and Setup
```bash
# Navigate to the project directory
cd money-tracker

# Install frontend dependencies (if not already installed)
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Configure Environment
Update `backend/.env` with your MongoDB connection:
```env
MONGODB_URI=mongodb://localhost:27017/money-tracker
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/money-tracker
```

### 3. Start Development Servers

#### Option A: Use the startup script (Windows)
```bash
start-dev.bat
```

#### Option B: Manual startup
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
npm start
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## 🔐 Authentication

### Demo Credentials
- **Email**: demo@example.com
- **Password**: password123

### API Authentication
The backend uses JWT tokens. Include in requests:
```
Authorization: Bearer <your-jwt-token>
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Dashboard
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/dashboard/charts/sales` - Sales chart data
- `GET /api/dashboard/overview` - Complete overview

### Transactions
- `GET /api/transactions` - List transactions (with pagination)
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction
- `GET /api/transactions/stats/summary` - Transaction statistics

### Invoices
- `GET /api/invoices` - List invoices (with pagination)
- `POST /api/invoices` - Create invoice
- `PUT /api/invoices/:id` - Update invoice
- `DELETE /api/invoices/:id` - Delete invoice
- `GET /api/invoices/stats/summary` - Invoice statistics

### Billing
- `GET /api/billing/info` - Billing information
- `GET /api/billing/payment-methods` - Payment methods
- `GET /api/billing/history` - Payment history
- `GET /api/billing/summary` - Billing summary

### Users
- `GET /api/users/profile` - User profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/settings` - User settings
- `PUT /api/users/settings` - Update settings

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 17.0.2
- **UI Library**: Chakra UI
- **Routing**: React Router DOM
- **Charts**: ApexCharts
- **HTTP Client**: Axios
- **State Management**: React Hooks

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS, Rate Limiting
- **Password Hashing**: bcryptjs

## 🔧 Development

### Backend Development
```bash
cd backend

# Start with nodemon (auto-restart)
npm run dev

# Start production mode
npm start

# Test API endpoints
node test-api.js
```

### Frontend Development
```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

## 📊 Features

### Dashboard
- Real-time statistics
- Interactive charts
- Recent activity feed
- Page visits analytics
- Social traffic data

### Transaction Management
- CRUD operations
- Filtering and pagination
- Transaction categories
- Status tracking
- Statistics and summaries

### Invoice System
- Invoice creation and management
- Client information
- Item-based billing
- Status tracking (draft, pending, paid, overdue)
- PDF format support

### Billing Management
- Multiple payment methods
- Billing information storage
- Payment history
- Billing summaries

### User Management
- User profiles
- Settings management
- Authentication system
- Secure password handling

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Rate limiting (100 requests/15 minutes)
- Security headers with Helmet
- Input validation
- Error handling

## 🗄️ Database

### MongoDB Setup
The application connects to MongoDB but doesn't create models automatically. To use with real data:

1. **Local MongoDB**:
   ```bash
   # Install MongoDB locally
   # Update MONGODB_URI in backend/.env
   MONGODB_URI=mongodb://localhost:27017/money-tracker
   ```

2. **MongoDB Atlas** (Cloud):
   ```bash
   # Create account at mongodb.com/atlas
   # Get connection string and update .env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/money-tracker
   ```

### Current Data
- Uses demo data for development
- Ready for database integration
- No models created (as per requirements)

## 🧪 Testing

### API Testing
```bash
cd backend
node test-api.js
```

### Manual Testing
1. Start both servers
2. Open http://localhost:3000
3. Use demo credentials to login
4. Test all features in the UI

## 📝 Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/money-tracker
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🚀 Deployment

### Backend Deployment
1. Set production environment variables
2. Use process manager (PM2)
3. Configure reverse proxy (Nginx)
4. Set up SSL certificate

### Frontend Deployment
1. Build production bundle: `npm run build`
2. Serve static files
3. Configure routing for SPA

## 🤝 Contributing

1. Follow existing code patterns
2. Add proper error handling
3. Include input validation
4. Update documentation
5. Test all changes

## 📄 License

MIT License

## 🆘 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Check MongoDB is running
   - Verify connection string in .env
   - Check network connectivity

2. **CORS Errors**
   - Verify FRONTEND_URL in backend .env
   - Check if both servers are running

3. **Authentication Issues**
   - Use demo credentials: demo@example.com / password123
   - Check JWT_SECRET is set
   - Verify token in localStorage

4. **Port Conflicts**
   - Backend: Change PORT in .env
   - Frontend: Set PORT=3001 in frontend .env

### Support
- Check the TODO.md for implementation status
- Review backend/README.md for API details
- Test API endpoints with backend/test-api.js
