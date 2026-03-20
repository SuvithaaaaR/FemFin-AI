# Backend Architecture Documentation

## 📁 Project Structure

```
backend/
├── config/                 # Configuration files
│   └── database.js        # MongoDB connection setup
├── controllers/           # Business logic (separated from routes)
│   ├── authController.js
│   ├── fundRecommendationController.js
│   ├── crowdfundingController.js
│   ├── creditScoringController.js
│   └── index.js          # Central export
├── middleware/            # Reusable middleware functions
│   ├── auth.js           # JWT authentication & authorization
│   ├── errorHandler.js   # Global error handling
│   ├── validation.js     # Input validation
│   ├── rateLimiter.js    # API rate limiting
│   ├── logger.js         # Request logging
│   └── index.js          # Central export
├── models/                # MongoDB/Mongoose schemas
│   ├── User.js           # User authentication & profile
│   ├── Business.js       # Business information
│   ├── Campaign.js       # Crowdfunding campaigns
│   ├── CreditScore.js    # Credit scoring data
│   └── index.js          # Central export
├── routes/                # API endpoints (thin layer)
│   ├── auth.js           # Authentication routes
│   ├── fundRecommendation.js
│   ├── crowdfunding.js
│   └── creditScoring.js
├── .env                   # Environment variables (not in Git)
├── .env.example           # Environment template
├── package.json          # Dependencies & scripts
└── server.js             # Main application entry point
```

## 🎯 Architecture Principles

### 1. **Separation of Concerns**

- **Routes**: Define endpoints and apply middleware
- **Controllers**: Handle business logic and data processing
- **Models**: Define data structure and validation
- **Middleware**: Reusable functions for auth, validation, error handling

### 2. **DRY (Don't Repeat Yourself)**

- Centralized middleware for authentication
- Reusable error handling
- Single database connection
- Shared validation logic

### 3. **Single Responsibility**

- Each file has one clear purpose
- Controllers handle one resource
- Middleware functions do one thing well

### 4. **Security First**

- Environment variables for sensitive data
- JWT authentication
- Rate limiting
- Input sanitization
- Password hashing

## 📦 Models (Database Schemas)

### User Model (`models/User.js`)

**Purpose**: Store user authentication and profile information

**Fields**:

- `name`, `email`, `password`, `phoneNumber`
- `role`: entrepreneur | investor | admin
- `profile`: age, location, experience, education
- `creditScore`: Latest credit score (300-900)
- `isVerified`: Email verification status

**Methods**:

- `matchPassword()`: Compare entered password with hashed
- `getSignedJwtToken()`: Generate JWT token

### Business Model (`models/Business.js`)

**Purpose**: Store business details for entrepreneurs

**Fields**:

- `owner`: Reference to User
- `businessName`, `businessIdea`, `industryType`, `businessStage`
- `budgetRequired`: Funding amount needed
- `location`: city, state, country
- `registrationDetails`: type, registration number, GST
- `financials`: revenue, profit margin, bank statements
- `fundingHistory`: Previous funding sources

### Campaign Model (`models/Campaign.js`)

**Purpose**: Crowdfunding campaigns with blockchain integration

**Fields**:

- `creator`: Reference to User
- `business`: Reference to Business
- `title`, `description`, `category`
- `targetAmount`, `currentAmount`, `deadline`
- `milestones`: Array of funding milestones
- `investments`: Array of investor contributions
- `blockchain`: contract address, network, transaction hash
- `status`: Draft | Active | Funded | Closed | Failed

**Virtuals**:

- `fundingPercentage`: Calculated automatically

### CreditScore Model (`models/CreditScore.js`)

**Purpose**: AI credit score without collateral

**Fields**:

- `user`: Reference to User
- `digitalTransactions`: UPI, online payments (25% weight)
- `businessActivity`: Years, revenue, growth (30% weight)
- `socialTrust`: Reviews, social media (20% weight)
- `financialHealth`: Monthly sales, profit margin (25% weight)
- `overallScore`: 300-900 (like CIBIL)
- `loanEligibility`: max amount, interest rate, risk level
- `scoreHistory`: Historical tracking

## 🛡️ Middleware

### Authentication (`middleware/auth.js`)

**1. protect**: Verify JWT token and add user to request

```javascript
// Usage in routes
router.get("/profile", protect, getProfile);
```

**2. authorize(...roles)**: Check if user has required role

```javascript
// Only admins can access
router.delete("/users/:id", protect, authorize("admin"), deleteUser);
```

**3. optionalAuth**: Add user if token exists, but don't require it

```javascript
// Public but personalized if logged in
router.get("/campaigns", optionalAuth, getCampaigns);
```

**4. checkOwnership(Model)**: Verify user owns the resource

```javascript
// User can only edit their own business
router.put("/business/:id", protect, checkOwnership(Business), updateBusiness);
```

### Error Handling (`middleware/errorHandler.js`)

**1. ErrorResponse**: Custom error class with status code

```javascript
throw new ErrorResponse("Not found", 404);
```

**2. errorHandler**: Global error handler (handles all errors)

- Mongoose validation errors
- Duplicate key errors
- Cast errors (invalid ObjectId)
- JWT errors

**3. asyncHandler**: Wrap async routes (no try-catch needed)

```javascript
exports.getUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.json(users);
});
```

**4. notFound**: Handle 404 for undefined routes

### Rate Limiting (`middleware/rateLimiter.js`)

**1. apiLimiter**: General API (100 req/15min)

```javascript
app.use("/api/", apiLimiter);
```

**2. authLimiter**: Authentication (5 req/15min)

```javascript
router.post("/login", authLimiter, login);
```

**3. createLimiter**: Resource creation (10 req/hour)

```javascript
router.post("/campaigns", createLimiter, createCampaign);
```

**4. aiLimiter**: AI operations (20 req/hour)

```javascript
router.post("/calculate", aiLimiter, calculateScore);
```

### Validation (`middleware/validation.js`)

**1. validate**: Check express-validator results

```javascript
router.post("/register", [body("email").isEmail()], validate, register);
```

**2. requireFields([fields])**: Check required fields exist

```javascript
router.post("/create", requireFields(["title", "amount"]), create);
```

**3. sanitizeInput**: Remove XSS and script tags

### Logging (`middleware/logger.js`)

**1. requestLogger**: Log all HTTP requests with color-coded status

```
[2026-03-11T10:30:45.123Z] GET /api/users - 200 - 45ms
```

**2. addRequestId**: Add unique ID to each request

## 🎮 Controllers

### Authentication (`controllers/authController.js`)

- `register`: Create new user account
- `login`: Authenticate and return JWT
- `getMe`: Get current user profile
- `updateDetails`: Update user information
- `updatePassword`: Change password
- `logout`: Clear authentication

### Fund Recommendation (`controllers/fundRecommendationController.js`)

- `analyzeFunds`: AI analysis of business for funding matches
- `getFundingSources`: List all available funding sources

**Algorithm**: Matches businesses with:

- Government schemes (MUDRA, Startup India)
- Angel investors (Indian Angel Network, Women Entrepreneurs India)
- VC funds (Sequoia, Kalaari)
- Grants (Stand Up India, TREAD)

### Crowdfunding (`controllers/crowdfundingController.js`)

- `getCampaigns`: List all/filtered campaigns
- `getCampaign`: Get single campaign with details
- `createCampaign`: Start new campaign
- `updateCampaign`: Edit campaign (owner only)
- `deleteCampaign`: Remove campaign (owner only)
- `investInCampaign`: Invest money with blockchain integration
- `getMyCampaigns`: User's created campaigns
- `getMyInvestments`: User's investment portfolio

### Credit Scoring (`controllers/creditScoringController.js`)

- `calculateScore`: AI credit score calculation (300-900)
- `getCreditScoreHistory`: User's score over time
- `getLatestScore`: Most recent credit score

**Algorithm**: Weighted scoring system:

- Digital Transactions (25%): UPI, online payments
- Business Activity (30%): Customers, retention, order value
- Social Trust (20%): Reviews, social media, references
- Financial Health (25%): Revenue, consistency, GST registration

## 🛣️ Routes

### Authentication Routes (`/api/auth`)

```
POST   /register        - Create account
POST   /login           - Login and get token
GET    /me              - Get current user (protected)
PUT    /updatedetails   - Update profile (protected)
PUT    /updatepassword  - Change password (protected)
GET    /logout          - Logout (protected)
```

### Fund Recommendations (`/api/fund-recommendations`)

```
POST   /analyze         - Get AI funding recommendations
GET    /sources         - List all funding sources
```

### Crowdfunding (`/api/crowdfunding`)

```
GET    /campaigns                - List all campaigns
POST   /campaigns                - Create campaign (protected, rate limited)
GET    /campaigns/:id            - Get single campaign
PUT    /campaigns/:id            - Update campaign (protected, owner)
DELETE /campaigns/:id            - Delete campaign (protected, owner)
POST   /campaigns/:id/invest     - Invest in campaign (protected)
GET    /my-campaigns             - User's campaigns (protected)
GET    /my-investments           - User's investments (protected)
```

### Credit Scoring (`/api/credit-scoring`)

```
POST   /calculate       - Calculate credit score (rate limited)
GET    /history         - Get score history (protected)
GET    /latest          - Get latest score (protected)
```

## 🔐 Security Features

### 1. **JWT Authentication**

- Tokens expire in 24 hours (configurable)
- Secure password hashing with bcryptjs
- Token stored in client localStorage

### 2. **Rate Limiting**

Prevents abuse and DDoS:

- API: 100 requests per 15 minutes
- Auth: 5 attempts per 15 minutes
- Creation: 10 per hour
- AI: 20 per hour

### 3. **Input Sanitization**

- Remove script tags
- Prevent XSS attacks
- Validate all inputs

### 4. **Environment Variables**

- Database credentials
- JWT secret
- API keys
- Never committed to Git

### 5. **Error Handling**

- Detailed errors in development
- Generic errors in production
- Proper status codes
- Stack traces hidden in production

## 🗄️ Database Configuration

### Connection (`config/database.js`)

- Graceful connection with retry logic
- Works without database (falls back to mock data)
- Auto-reconnect on disconnect
- Graceful shutdown on termination

### Setup MongoDB:

```bash
# Local MongoDB
MONGODB_URI=mongodb://localhost:27017/femfin-ai

# MongoDB Atlas (cloud)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/femfin-ai
```

## 🚀 Running the Application

### Development

```bash
cd backend
npm run dev
```

### Production

```bash
cd backend
npm start
```

### With Database

```bash
# Add to .env
MONGODB_URI=your_mongodb_connection_string

# App will automatically connect
npm run dev
```

### Without Database

- App runs with in-memory mock data
- Perfect for development and testing
- Just don't set MONGODB_URI

## 📚 API Usage Examples

### 1. Register User

```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "Priya Sharma",
  "email": "priya@example.com",
  "password": "secure123",
  "phoneNumber": "9876543210"
}
```

### 2. Login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "priya@example.com",
  "password": "secure123"
}

Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { ... }
}
```

### 3. Get Fund Recommendations (with token)

```bash
POST /api/fund-recommendations/analyze
Authorization: Bearer <token>
Content-Type: application/json

{
  "businessIdea": "E-commerce platform for handmade goods",
  "budgetRequired": 2000000,
  "industryType": "Technology",
  "businessStage": "Early Stage"
}
```

### 4. Create Crowdfunding Campaign

```bash
POST /api/crowdfunding/campaigns
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Eco-Friendly Women's Fashion",
  "description": "Sustainable clothing line",
  "targetAmount": 500000,
  "category": "Retail",
  "deadline": "2026-12-31"
}
```

### 5. Calculate Credit Score

```bash
POST /api/credit-scoring/calculate
Content-Type: application/json

{
  "yearsInBusiness": 3,
  "monthlyRevenue": 150000,
  "annualRevenue": 1800000,
  "upiTransactions": 400,
  "digitalPayments": 75,
  "activeCustomers": 350,
  "socialMediaPresence": "Strong",
  "googleRating": 4.5
}
```

## 🧪 Testing

### Health Check

```bash
curl http://localhost:5000/api/health
```

### API Documentation

```bash
curl http://localhost:5000/api
```

### Check Database Connection

```bash
# Health endpoint shows database status
curl http://localhost:5000/api/health | jq .database
```

## 📈 Scalability Considerations

### Current Structure Supports:

✅ Horizontal scaling (multiple server instances)  
✅ Load balancing (stateless JWT auth)  
✅ Microservices migration (separated concerns)  
✅ Database sharding (Mongoose schemas)  
✅ API versioning (route organization)  
✅ Caching layers (Redis ready)

### Future Enhancements:

- WebSocket support for real-time updates
- Message queues for async processing
- Distributed caching (Redis)
- API versioning (/api/v1/, /api/v2/)
- GraphQL endpoint
- Swagger/OpenAPI documentation

## 🎓 Best Practices Implemented

1. **Async/Await**: All async operations use modern syntax
2. **Error Handling**: Centralized with custom error class
3. **Validation**: Input validation at multiple layers
4. **Security**: Rate limiting, JWT, sanitization
5. **Logging**: Request logging with timestamps
6. **Documentation**: JSDoc comments on all functions
7. **DRY**: No repeated code, reusable functions
8. **RESTful**: Proper HTTP methods and status codes
9. **Modularity**: Easy to add new features
10. **Configuration**: Environment-based settings

## 📖 Code Examples

### Adding a New Protected Route

```javascript
// 1. Create controller (controllers/newFeatureController.js)
exports.getItems = asyncHandler(async (req, res) => {
  const items = await Item.find({ user: req.user.id });
  res.json({ success: true, data: items });
});

// 2. Create route (routes/newFeature.js)
const router = require("express").Router();
const { protect } = require("../middleware");
const controller = require("../controllers/newFeatureController");

router.get("/", protect, controller.getItems);

module.exports = router;

// 3. Add to server.js
app.use("/api/new-feature", require("./routes/newFeature"));
```

### Adding a New Model

```javascript
// models/NewModel.js
const mongoose = require("mongoose");

const newSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // ... other fields
  },
  { timestamps: true },
);

module.exports = mongoose.model("NewModel", newSchema);

// models/index.js (add export)
module.exports = {
  // ... existing models
  NewModel: require("./NewModel"),
};
```

## 🐛 Debugging

### Common Issues

**1. "MongoDB URI not found"**

- Add MONGODB_URI to .env file
- App works without it using mock data

**2. "JWT_SECRET is not defined"**

- Required for authentication
- Add to .env: JWT_SECRET=random_secret_string

**3. "Rate limit exceeded"**

- Wait 15 minutes or
- Disable: ENABLE_RATE_LIMIT=false in .env

**4. "Unauthorized"**

- Check JWT token in Authorization header
- Token format: `Bearer <token>`

## 📞 Support

For questions or issues with the backend architecture:

1. Check this documentation
2. Review code comments (JSDoc)
3. Check error messages in console
4. Enable development mode: NODE_ENV=development

---

**Architecture Version**: 1.0.0  
**Last Updated**: March 11, 2026  
**Author**: FemFin AI Development Team
