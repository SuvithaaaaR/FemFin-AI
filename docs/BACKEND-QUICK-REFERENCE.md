# Backend Quick Reference Guide

## 🏗️ New Structure

```
backend/
├── config/          # Database setup
├── controllers/     # Business logic
├── middleware/      # Auth, validation, errors
├── models/          # Database schemas
└── routes/          # API endpoints
```

## ✅ What Changed

### Before (Old Structure)

```
backend/
├── routes/          # Everything in routes
└── server.js        # Basic setup
```

❌ All logic mixed in routes  
❌ No authentication  
❌ No database schemas  
❌ Basic error handling

### After (New Structure)

```
backend/
├── config/          # ✅ Database connection
├── controllers/     # ✅ Separated business logic
├── middleware/      # ✅ Auth, validation, rate limiting
├── models/          # ✅ MongoDB schemas
└── routes/          # ✅ Clean endpoint definitions
```

## 🎯 Key Benefits

1. **Organized**: Each file has one purpose
2. **Secure**: JWT auth, rate limiting, input sanitization
3. **Scalable**: Easy to add features
4. **Maintainable**: Clean code, no repetition
5. **Database Ready**: MongoDB integration with schemas

## 🚀 Quick Start

### Without Database (Mock Data)

```bash
cd backend
npm run dev
```

✅ Works immediately - no database needed!

### With Database

```bash
# Add to backend/.env
MONGODB_URI=mongodb://localhost:27017/femfin-ai

# Then start
npm run dev
```

## 📝 New Features

### 1. User Authentication

```javascript
// Register
POST /api/auth/register
{
  "name": "Priya",
  "email": "priya@example.com",
  "password": "secure123"
}

// Login
POST /api/auth/login
{
  "email": "priya@example.com",
  "password": "secure123"
}
// Returns JWT token
```

### 2. Protected Routes

```javascript
// Use token in headers
Authorization: Bearer <
  your_token_here >
  // Example: Get my profile
  GET / api / auth / me;
```

### 3. Rate Limiting

- API calls: 100 per 15 minutes
- Login attempts: 5 per 15 minutes
- AI operations: 20 per hour

### 4. Better Error Handling

```json
{
  "success": false,
  "message": "Descriptive error message",
  "errors": [...]
}
```

## 📚 Models (Database Schemas)

### User

- Authentication (email/password)
- Profile (name, phone, location)
- Role (entrepreneur/investor/admin)
- Credit score

### Business

- Business details
- Owner reference
- Financials
- Registration info

### Campaign (Crowdfunding)

- Creator
- Target/current amounts
- Milestones
- Investments
- Blockchain integration

### CreditScore

- AI scoring algorithm
- Score history
- Loan eligibility
- Breakdown by category

## 🛡️ Middleware Features

### Authentication

- `protect`: Verify JWT token
- `authorize(role)`: Check user role
- `optionalAuth`: Add user if logged in

### Security

- Rate limiting
- Input sanitization
- Password hashing
- Error masking in production

### Logging

- All requests logged with timestamp
- Color-coded status codes
- Request IDs for tracking

## 🎮 Controllers

Located in `controllers/` directory:

1. **authController**: Login, register, profile
2. **fundRecommendationController**: AI fund matching
3. **crowdfundingController**: Campaign management
4. **creditScoringController**: Credit score calculation

Each controller uses `asyncHandler` - no try-catch needed!

## 📍 All API Endpoints

### Authentication (`/api/auth`)

- `POST /register` - Create account
- `POST /login` - Get JWT token
- `GET /me` - Current user (protected)
- `PUT /updatedetails` - Update profile (protected)
- `PUT /updatepassword` - Change password (protected)

### Fund Recommendations (`/api/fund-recommendations`)

- `POST /analyze` - Get funding matches
- `GET /sources` - List funding sources

### Crowdfunding (`/api/crowdfunding`)

- `GET /campaigns` - List all
- `POST /campaigns` - Create (protected)
- `GET /campaigns/:id` - View one
- `PUT /campaigns/:id` - Update (owner only)
- `DELETE /campaigns/:id` - Delete (owner only)
- `POST /campaigns/:id/invest` - Invest (protected)
- `GET /my-campaigns` - My created campaigns
- `GET /my-investments` - My investments

### Credit Scoring (`/api/credit-scoring`)

- `POST /calculate` - Calculate score
- `GET /history` - Score over time (protected)
- `GET /latest` - Latest score (protected)

## 🔧 Environment Variables

Required in `backend/.env`:

```bash
# Server
PORT=5000
NODE_ENV=development

# Security
JWT_SECRET=your_random_secret

# Database (optional)
MONGODB_URI=mongodb://localhost:27017/femfin-ai

# Client
CLIENT_URL=http://localhost:3000

# Rate Limiting
ENABLE_RATE_LIMIT=true
RATE_LIMIT_MAX=100
```

## 📖 Example Usage

### 1. Register and Login

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"test123"}'

# Login (saves token)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```

### 2. Use Protected Route

```bash
# Get my profile
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 3. Calculate Credit Score

```bash
curl -X POST http://localhost:5000/api/credit-scoring/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "yearsInBusiness": 2,
    "monthlyRevenue": 100000,
    "annualRevenue": 1200000,
    "upiTransactions": 300,
    "digitalPayments": 70,
    "activeCustomers": 200,
    "socialMediaPresence": "Strong"
  }'
```

## ⚠️ Important Notes

### Database Not Required

- App works without MongoDB
- Uses mock data automatically
- Add MONGODB_URI to enable database

### JWT Required for Protected Routes

- Register or login to get token
- Add to Authorization header: `Bearer <token>`
- Token expires in 24 hours

### Rate Limits Apply

- Don't make too many requests
- Wait if you hit limit
- Disable in .env: `ENABLE_RATE_LIMIT=false`

## 🐛 Common Issues

**"JWT_SECRET not defined"**

```bash
# Add to .env
JWT_SECRET=any_random_string_here
```

**"Unauthorized"**

```bash
# Include token in header
Authorization: Bearer <your_token>
```

**"Rate limit exceeded"**

```bash
# Wait 15 minutes or disable
ENABLE_RATE_LIMIT=false
```

**"MongoDB not connected"**

```bash
# Optional - app works without it
# Or add to .env:
MONGODB_URI=mongodb://localhost:27017/femfin-ai
```

## 📂 File Locations

- **Add auth logic**: `middleware/auth.js`
- **Add business logic**: `controllers/`
- **Add validation**: `middleware/validation.js`
- **Add model**: `models/`
- **Add route**: `routes/`
- **Configure database**: `config/database.js`

## 🎓 Next Steps

1. ✅ **Structure is complete** - organized and professional
2. 📝 **Add database**: Set MONGODB_URI in .env
3. 🔐 **Test auth**: Register → Login → Use token
4. 🚀 **Deploy**: Ready for production

## 📞 Help

- Full docs: See `BACKEND-ARCHITECTURE.md`
- Check logs: Look at terminal output
- Test endpoint: `curl http://localhost:5000/api/health`
- API list: `curl http://localhost:5000/api`

---

**Your backend now follows industry best practices!** 🎉
