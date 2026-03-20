# 🔐 FemFin AI - Authentication System Documentation

Complete internal documentation of how the login and registration system works.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Registration Flow](#registration-flow)
3. [Login Flow](#login-flow)
4. [Password Security](#password-security)
5. [JWT Token System](#jwt-token-system)
6. [Authentication Context](#authentication-context)
7. [Protected Routes](#protected-routes)
8. [Security Features](#security-features)
9. [File Structure](#file-structure)
10. [API Endpoints](#api-endpoints)

---

## Overview

FemFin AI uses a **JWT (JSON Web Token) based authentication system** with the following components:

- **Frontend**: React with Mantine UI, React Router, AuthContext
- **Backend**: Node.js/Express with MongoDB/Mongoose
- **Authentication**: JWT tokens with bcrypt password hashing
- **Security**: Rate limiting, helmet headers, input validation, CORS

---

## Registration Flow

### Step-by-Step Process

#### **Step 1: User Fills Registration Form**

**File**: `frontend/src/pages/Register.js`

```javascript
const form = useForm({
  initialValues: {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    role: "entrepreneur",
  },
  validate: {
    email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    password: (value) =>
      value.length < 6 ? "Password must be at least 6 characters" : null,
    confirmPassword: (value, values) =>
      value !== values.password ? "Passwords do not match" : null,
  },
});
```

**What Happens:**

- User enters: name, email, password, confirmPassword, phoneNumber, role
- Form validates input on **client-side** before sending to server
- Checks email format, password length (min 6 chars), password match
- If validation fails → Shows error, doesn't send request
- If validation passes → Proceeds to Step 2

---

#### **Step 2: Submit Registration Data**

**File**: `frontend/src/pages/Register.js`

```javascript
const handleSubmit = async (values) => {
  setLoading(true);
  setError("");

  try {
    // Remove confirmPassword (not needed in backend)
    const { confirmPassword, ...registerData } = values;

    // Call authService.register()
    const response = await authService.register(registerData);

    // Update global auth state
    login(response.user, response.token);

    // Show success notification
    notifications.show({
      title: "Success",
      message: "Account created successfully!",
      color: "green",
    });

    // Navigate to dashboard
    navigate("/dashboard");
  } catch (err) {
    setError(err.response?.data?.message);
  }
};
```

**What Happens:**

1. Removes `confirmPassword` (only needed for client validation)
2. Sends data: `{ name, email, password, phoneNumber, role }`
3. Calls `authService.register(registerData)`

---

#### **Step 3: AuthService Sends HTTP Request**

**File**: `frontend/src/services/authService.js`

```javascript
register: async (userData) => {
  // POST request to backend API
  const response = await apiClient.post("/auth/register", userData);

  if (response.data.token) {
    // Store JWT token in localStorage
    localStorage.setItem("token", response.data.token);
    // Store user data in localStorage
    localStorage.setItem("user", JSON.stringify(response.data.user));
  }

  return response.data;
};
```

**What Happens:**

1. Sends `POST /api/auth/register` with user data
2. Request goes through `apiClient` → Axios interceptor adds headers
3. Backend receives request at `backend/routes/auth.js`

**Request Format:**

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "password123",
  "phoneNumber": "1234567890",
  "role": "entrepreneur"
}
```

---

#### **Step 4: Backend Route Validation**

**File**: `backend/routes/auth.js`

```javascript
router.post(
  "/register",
  authLimiter, // Rate limiting: Max 5 requests per 15 minutes
  [
    // Server-side validation using express-validator
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("phoneNumber")
      .optional()
      .matches(/^[0-9]{10}$/)
      .withMessage("Please provide a valid 10-digit phone number"),
  ],
  validate, // Middleware checks validation results
  auth.register, // Controller function
);
```

**What Happens:**

1. **Rate Limiter**: Prevents brute-force attacks (max 5 registrations per 15 min from same IP)
2. **Validation Middleware**: Checks all fields match requirements
3. If validation fails → Returns 400 error with validation messages
4. If validation passes → Calls `auth.register` controller

---

#### **Step 5: Create User in Database**

**File**: `backend/controllers/authController.js`

```javascript
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, phoneNumber, role } = req.body;

  // Create user in MongoDB
  const user = await User.create({
    name,
    email,
    password, // Plain text password (will be hashed in User model)
    phoneNumber,
    role: role || "entrepreneur",
  });

  // Generate JWT token
  const token = user.getSignedJwtToken();

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});
```

**What Happens:**

1. Extracts data from request body
2. Calls `User.create()` → Triggers Mongoose model pre-save hook (Step 6)
3. After user created → Generates JWT token (Step 7)
4. Sends response back to frontend with token and user data

---

#### **Step 6: Password Hashing (Mongoose Pre-Save Hook)**

**File**: `backend/models/User.js`

```javascript
// Hash password before saving
userSchema.pre("save", async function (next) {
  // Only hash if password was modified (new user or password change)
  if (!this.isModified("password")) {
    next();
  }

  // Generate salt (random string added to password)
  const salt = await bcrypt.genSalt(10);

  // Hash password with salt
  this.password = await bcrypt.hash(this.password, salt);
});
```

**What Happens:**

1. Before saving user to MongoDB, this hook runs automatically
2. **Salt generation**: Creates random 10-character string
   - Example: `$2a$10$N9qo8uLO`
3. **Hash password**: Combines password + salt → one-way encryption
   - Plain password: `"password123"`
   - Hashed password: `"$2a$10$N9qo8uLOkoZb.PuVJCa5z.W5TjJz1Xz5.X5.X5.X5"`
4. Original password is now **unreadable and irreversible**
5. Hashed password saved to database
6. Returns control to Step 5

**Security Note:** Even if database is compromised, attackers cannot retrieve original passwords.

---

#### **Step 7: Generate JWT Token**

**File**: `backend/models/User.js`

```javascript
userSchema.methods.getSignedJwtToken = function () {
  const jwt = require("jsonwebtoken");

  return jwt.sign(
    { id: this._id }, // Payload: User ID
    process.env.JWT_SECRET, // Secret key from .env
    { expiresIn: process.env.JWT_EXPIRE || "24h" }, // Token expires in 24 hours
  );
};
```

**What Happens:**

1. **Creates JWT with 3 parts:**
   - **Header**: `{ "alg": "HS256", "typ": "JWT" }`
   - **Payload**: `{ "id": "69b10fdc64c352c0f41b324c", "iat": 1773211612, "exp": 1773298012 }`
   - **Signature**: Created by hashing Header + Payload + JWT_SECRET

2. **Example JWT:**

   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5YjEwZmRjNjRjMzUyYzBmNDFiMzI0YyIsImlhdCI6MTc3MzIxMTYxMiwiZXhwIjoxNzczMjk4MDEyfQ.lQ09LqL021TNkqbGhLW9txTpGq4tVBNe9dk3SqS0fpg
   ```

3. **Token contains:**
   - `id`: User's MongoDB ID
   - `iat`: Issued at timestamp
   - `exp`: Expiration timestamp (24 hours from now)

4. Token returned to Step 5, sent in response to frontend

---

#### **Step 8: Store Token & Update UI**

**Files**: `frontend/src/services/authService.js`, `frontend/src/pages/Register.js`

```javascript
// authService stores token
localStorage.setItem("token", response.data.token);
localStorage.setItem("user", JSON.stringify(response.data.user));

// Register.js updates global auth state
login(response.user, response.token); // Updates AuthContext

// Shows notification
notifications.show({
  title: "Success",
  message: "Account created successfully!",
  color: "green",
});

// Redirects to dashboard
navigate("/dashboard");
```

**What Happens:**

1. **localStorage** saves token and user data (persists across page reloads)
2. **AuthContext** updates global state → Header shows user name
3. **Notification** displays success message
4. **Navigation** redirects to protected `/dashboard` route
5. **User is now logged in!**

**Response Format:**

```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGci...",
  "user": {
    "id": "69b10fdc64c352c0f41b324c",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "entrepreneur"
  }
}
```

---

## Login Flow

### Step-by-Step Process

#### **Steps 1-4: Similar to Registration**

1. User enters email & password
2. Form validates → Calls `authService.login()`
3. Sends `POST /api/auth/login`
4. Backend validates → Calls `auth.login` controller

---

#### **Step 5: Find User & Verify Password**

**File**: `backend/controllers/authController.js`

```javascript
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate inputs
  if (!email || !password) {
    return next(new ErrorResponse("Please provide email and password", 400));
  }

  // Find user by email (include password field - normally hidden)
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  // Generate token
  const token = user.getSignedJwtToken();

  res.status(200).json({
    success: true,
    message: "Login successful",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      creditScore: user.creditScore,
    },
  });
});
```

**What Happens:**

1. Searches MongoDB for user with matching email
2. `.select("+password")` → Forces MongoDB to include password field (normally hidden for security)
3. Calls `user.matchPassword(password)` → See Step 6
4. If password match → Generate JWT token
5. Send token + user data back to frontend

---

#### **Step 6: Password Comparison**

**File**: `backend/models/User.js`

```javascript
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
```

**What Happens:**

1. **Input**: Plain text password from login form: `"password123"`
2. **Database**: Hashed password: `"$2a$10$N9qo8uLOkoZb..."`
3. **bcrypt.compare()**:
   - Takes entered password
   - Hashes it with same salt from stored password
   - Compares hashed result with stored hash
4. **Returns**: `true` if match, `false` if no match
5. **Security**: Never reveals actual password, only confirms match

---

## Password Security

### Hashing Process

#### **1. Plain Text Password**

```
User Input: "password123"
```

#### **2. Salt Generation**

```javascript
const salt = await bcrypt.genSalt(10);
// Result: "$2a$10$N9qo8uLOkoZb"
```

#### **3. Hashing**

```javascript
const hash = await bcrypt.hash(password, salt);
// Result: "$2a$10$N9qo8uLOkoZb.PuVJCa5z.W5TjJz1Xz5X5X5X5"
```

#### **4. Stored in Database**

```javascript
{
  _id: "69b10fdc64c352c0f41b324c",
  email: "jane@example.com",
  password: "$2a$10$N9qo8uLOkoZb.PuVJCa5z.W5TjJz1Xz5X5X5X5",
  ...
}
```

### Why This Is Secure

✅ **One-way encryption** - Cannot reverse hash to get original password  
✅ **Unique salt per user** - Same password creates different hashes for different users  
✅ **Slow hashing** - bcrypt is intentionally slow to prevent brute-force attacks  
✅ **Cost factor** - Can increase hashing complexity over time

### Password Comparison Process

```javascript
// Login attempt
enteredPassword = "password123";
storedHash = "$2a$10$N9qo8uLOkoZb.PuVJCa5z.W5TjJz1Xz5X5X5X5";

// bcrypt extracts salt from stored hash
salt = "$2a$10$N9qo8uLOkoZb";

// Hash entered password with same salt
newHash = bcrypt.hash("password123", salt);

// Compare hashes
if (newHash === storedHash) {
  return true; // Password correct
}
```

---

## JWT Token System

### Token Structure

A JWT token has 3 parts separated by dots (`.`):

```
eyJhbGci...  .  eyJpZCI...  .  lQ09LqL...
   HEADER         PAYLOAD      SIGNATURE
```

### 1. Header (Base64 Encoded)

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

### 2. Payload (Base64 Encoded)

```json
{
  "id": "69b10fdc64c352c0f41b324c",
  "iat": 1773211612,
  "exp": 1773298012
}
```

- `id`: User's MongoDB ObjectId
- `iat`: Issued At (timestamp)
- `exp`: Expiration (timestamp - 24 hours later)

### 3. Signature (HMAC SHA256)

```javascript
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  JWT_SECRET,
);
```

### Token Generation

**File**: `backend/models/User.js`

```javascript
userSchema.methods.getSignedJwtToken = function () {
  const jwt = require("jsonwebtoken");
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
};
```

### Token Verification

**File**: `backend/middleware/auth.js`

```javascript
const decoded = jwt.verify(token, process.env.JWT_SECRET);
// If successful: { id: "69b10fdc64c352c0f41b324c", iat: ..., exp: ... }
// If expired or invalid: throws error
```

### Why JWT Is Secure

✅ **Tamper-proof** - Any change to header/payload invalidates signature  
✅ **Stateless** - Server doesn't need to store sessions  
✅ **Expiring** - Token automatically expires after 24 hours  
✅ **Self-contained** - Contains all user info needed for authorization

---

## Authentication Context

### Global State Management

**File**: `frontend/src/contexts/AuthContext.js`

```javascript
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On app load: Check if user logged in
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    setUser(userData); // Updates state → All components re-render
  };

  const logout = () => {
    authService.logout(); // Clears localStorage
    setUser(null); // Updates state → Components re-render
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated: !!user, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}
```

### Using AuthContext in Components

```javascript
import { useAuth } from "../contexts/AuthContext";

function MyComponent() {
  const { user, login, logout, isAuthenticated, loading } = useAuth();

  if (loading) return <Loader />;

  if (isAuthenticated) {
    return <div>Welcome, {user.name}!</div>;
  }

  return <div>Please login</div>;
}
```

### What Happens on App Load

1. **App.js renders** → Wrapped in `<AuthProvider>`
2. **AuthProvider mounts** → Runs `useEffect`
3. **Checks localStorage** → Looks for saved token and user
4. **If token exists** → Sets `user` state, `isAuthenticated = true`
5. **If no token** → Keeps `user = null`, `isAuthenticated = false`
6. **All child components** can access auth state via `useAuth()`

### What Happens on Login

1. User submits login form
2. Backend returns token + user data
3. `authService.login()` saves to localStorage
4. Component calls `login(userData, token)` from AuthContext
5. AuthContext updates `user` state
6. **All components re-render** with new auth state
7. Header shows user name, protected routes become accessible

### What Happens on Logout

1. User clicks logout button
2. Component calls `logout()` from AuthContext
3. AuthContext clears localStorage and sets `user = null`
4. **All components re-render** with cleared auth state
5. Header shows login/register buttons
6. Protected routes redirect to login

---

## Protected Routes

### Frontend Protection

**File**: `frontend/src/components/ProtectedRoute.js`

```javascript
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <Center>
        <Loader size="lg" />
      </Center>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
```

**Usage**: `frontend/src/App.js`

```javascript
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

**Flow:**

1. User tries to access `/dashboard`
2. `ProtectedRoute` checks `isAuthenticated` from AuthContext
3. **If loading** → Shows spinner while checking auth
4. **If not authenticated** → Redirects to `/login`
5. **If authenticated** → Renders `<Dashboard />` component

---

### Backend Protection

**File**: `backend/middleware/auth.js`

```javascript
exports.protect = async (req, res, next) => {
  let token;

  // Extract token from Authorization header
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      message: "Not authorized. Please login.",
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({
        message: "User not found. Token invalid.",
      });
    }

    next(); // Continue to controller
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token.",
    });
  }
};
```

**Usage**: `backend/routes/auth.js`

```javascript
router.get("/me", protect, authController.getMe);
```

**Flow:**

1. Client sends request with header: `Authorization: Bearer eyJhbGci...`
2. Middleware extracts token from header
3. **Verifies token:**
   - Decodes JWT using `JWT_SECRET`
   - Checks if token expired
   - Extracts user ID from payload
4. **Fetches user from database** using decoded ID
5. **Attaches user to request:** `req.user = userData`
6. Controller can now access `req.user` for current user info

---

### Request Flow with Authentication

#### **Request Without Token:**

```http
GET /api/auth/me
```

**Response**: 401 Unauthorized

```json
{
  "success": false,
  "message": "Not authorized. Please login."
}
```

#### **Request With Token:**

```http
GET /api/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response**: 200 OK

```json
{
  "success": true,
  "data": {
    "_id": "69b10fdc64c352c0f41b324c",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "entrepreneur",
    ...
  }
}
```

---

## Security Features

### 1. Rate Limiting

**File**: `backend/middleware/rateLimiter.js`

```javascript
// Auth routes: 5 requests per 15 minutes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Max 5 requests
  message: "Too many requests. Please try again later.",
});
```

**Purpose**: Prevents brute-force login attacks

---

### 2. Helmet Security Headers

**File**: `backend/server.js`

```javascript
const helmet = require("helmet");
app.use(helmet());
```

**Headers Added:**

- `Content-Security-Policy` - Prevents XSS attacks
- `X-Frame-Options` - Prevents clickjacking
- `X-Content-Type-Options` - Prevents MIME sniffing
- `Strict-Transport-Security` - Forces HTTPS
- And 11 more security headers

---

### 3. Input Validation

**Client-Side**: `@mantine/form` validation
**Server-Side**: `express-validator`

```javascript
// Route validation
(body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  body("phoneNumber")
    .optional()
    .matches(/^[0-9]{10}$/));
```

---

### 4. Password Security

- ✅ Hashed with **bcrypt** (cost factor 10)
- ✅ Unique salt per user
- ✅ Never stored as plain text
- ✅ Never sent in API responses (`select: false`)

---

### 5. CORS Protection

**File**: `backend/server.js`

```javascript
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  }),
);
```

**Purpose**: Only frontend at `localhost:3000` can access API

---

### 6. Token Expiration

- JWT tokens expire after **24 hours**
- User must login again after expiration
- Prevents indefinite access with stolen token

---

### 7. XSS Prevention

**File**: `backend/middleware/validation.js`

```javascript
const sanitizeInput = (req, res, next) => {
  // Remove HTML tags from all string inputs
  // Prevents script injection
};
```

---

## File Structure

### Frontend Files

```
frontend/src/
├── pages/
│   ├── Register.js          # Registration form
│   ├── Login.js             # Login form
│   └── Dashboard.js         # Protected dashboard
├── components/
│   ├── ProtectedRoute.js    # Protected route wrapper
│   └── Layout/
│       └── Header.js        # Header with auth UI
├── contexts/
│   └── AuthContext.js       # Global auth state
└── services/
    ├── api.js               # Axios client with interceptors
    └── authService.js       # Auth API calls
```

### Backend Files

```
backend/
├── models/
│   └── User.js              # User schema with password hashing
├── controllers/
│   └── authController.js    # Register & login logic
├── middleware/
│   ├── auth.js              # JWT verification (protect middleware)
│   ├── errorHandler.js      # Error handling
│   ├── validation.js        # Input sanitization
│   ├── rateLimiter.js       # Rate limiting
│   └── logger.js            # Request logging
├── routes/
│   └── auth.js              # Auth routes with validation
├── config/
│   └── database.js          # MongoDB connection
└── server.js                # Main server file
```

---

## API Endpoints

### Public Endpoints (No Authentication Required)

#### **Register**

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "password123",
  "phoneNumber": "1234567890",
  "role": "entrepreneur"
}
```

**Response:**

```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGci...",
  "user": {
    "id": "69b10fdc...",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "entrepreneur"
  }
}
```

---

#### **Login**

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "jane@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGci...",
  "user": {
    "id": "69b10fdc...",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "entrepreneur",
    "creditScore": null
  }
}
```

---

### Protected Endpoints (Require Authentication)

#### **Get Current User**

```http
GET /api/auth/me
Authorization: Bearer eyJhbGci...
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "69b10fdc...",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "entrepreneur",
    "creditScore": null,
    "isVerified": false,
    "createdAt": "2026-03-11T06:46:52.188Z",
    "updatedAt": "2026-03-11T06:46:52.188Z"
  }
}
```

---

#### **Update User Details**

```http
PUT /api/auth/updatedetails
Authorization: Bearer eyJhbGci...
Content-Type: application/json

{
  "name": "Jane Smith",
  "phoneNumber": "9876543210"
}
```

---

#### **Update Password**

```http
PUT /api/auth/updatepassword
Authorization: Bearer eyJhbGci...
Content-Type: application/json

{
  "currentPassword": "password123",
  "newPassword": "newpassword456"
}
```

---

#### **Logout**

```http
GET /api/auth/logout
Authorization: Bearer eyJhbGci...
```

**Response:**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Complete Authentication Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         REGISTRATION FLOW                        │
└─────────────────────────────────────────────────────────────────┘

1. User fills form → Client-side validation
2. Submit → authService.register(data)
3. POST /api/auth/register → Rate limiter → Server validation
4. Controller → User.create() → Pre-save hook → Password hashing
5. Save to MongoDB → Generate JWT token
6. Response → Store in localStorage → Update AuthContext
7. Navigate to /dashboard → User logged in ✅

┌─────────────────────────────────────────────────────────────────┐
│                           LOGIN FLOW                             │
└─────────────────────────────────────────────────────────────────┘

1. User enters email & password → Client validation
2. Submit → authService.login(credentials)
3. POST /api/auth/login → Rate limiter → Server validation
4. Controller → Find user by email → Compare password (bcrypt)
5. If match → Generate JWT token
6. Response → Store in localStorage → Update AuthContext
7. Navigate to /dashboard → User logged in ✅

┌─────────────────────────────────────────────────────────────────┐
│                      PROTECTED ROUTE ACCESS                      │
└─────────────────────────────────────────────────────────────────┘

FRONTEND:
1. User navigates to /dashboard
2. ProtectedRoute checks isAuthenticated
3. If no token → Redirect to /login ❌
4. If token exists → Render <Dashboard /> ✅

BACKEND:
1. Client sends API request with Authorization header
2. Middleware extracts token → Verify with JWT_SECRET
3. If invalid/expired → 401 Unauthorized ❌
4. If valid → Decode user ID → Fetch user from DB → Attach to req.user
5. Controller accesses req.user → Process request ✅

┌─────────────────────────────────────────────────────────────────┐
│                          LOGOUT FLOW                             │
└─────────────────────────────────────────────────────────────────┘

1. User clicks logout
2. authContext.logout() → authService.logout()
3. Clear localStorage (token + user)
4. Update AuthContext state (user = null)
5. All components re-render → Header shows login/register
6. Protected routes redirect to /login
7. User logged out ✅
```

---

## Environment Variables

**File**: `backend/.env`

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/

# JWT Configuration
JWT_SECRET=mySuperSecretKeyThatNobodyCanGuess12345678Min32Chars
JWT_EXPIRE=24h

# Client URL (for CORS)
CLIENT_URL=http://localhost:3000
```

**Security Notes:**

- ✅ `JWT_SECRET` must be at least 32 characters long
- ✅ Never commit `.env` file to version control
- ✅ Use different secrets for development/production
- ✅ Rotate JWT_SECRET regularly in production

---

## Testing the System

### Test Registration

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "entrepreneur"
  }'
```

### Test Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Test Protected Route

```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Common Issues & Solutions

### Issue: "Invalid token" error

**Solution**: Token expired (24 hours). User must login again.

### Issue: Routes not protected

**Solution**: Ensure `ProtectedRoute` wrapper in App.js and `protect` middleware in backend routes.

### Issue: Password comparison fails

**Solution**: Check if bcrypt version consistent between registration and login.

### Issue: CORS errors

**Solution**: Verify `CLIENT_URL` in `.env` matches frontend URL.

### Issue: User not updating in Header after login

**Solution**: Ensure `login()` called from AuthContext after successful login.

---

## Production Deployment Checklist

- [ ] Change `JWT_SECRET` to strong random string (64+ chars)
- [ ] Set `NODE_ENV=production`
- [ ] Enable HTTPS/SSL
- [ ] Update `CLIENT_URL` to production domain
- [ ] Set up MongoDB Atlas with IP whitelist
- [ ] Enable MongoDB authentication
- [ ] Implement refresh tokens for better security
- [ ] Add email verification for new users
- [ ] Add password reset functionality
- [ ] Increase bcrypt cost factor to 12
- [ ] Enable API rate limiting for all routes
- [ ] Set up monitoring for failed login attempts
- [ ] Add logging for security events

---

## Summary

FemFin AI uses a **production-grade JWT-based authentication system** with:

✅ **Secure password hashing** with bcrypt  
✅ **Stateless JWT tokens** with 24-hour expiration  
✅ **Protected routes** on frontend and backend  
✅ **Global auth state** with React Context  
✅ **Rate limiting** to prevent brute-force attacks  
✅ **Input validation** on frontend and backend  
✅ **Security headers** with helmet  
✅ **CORS protection** for API access  
✅ **XSS prevention** with input sanitization

This system is **scalable, secure, and maintainable** for production use.

---

**Last Updated**: March 11, 2026  
**Version**: 1.0.0  
**Author**: FemFin AI Development Team
