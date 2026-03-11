# Environment Variables Configuration Guide

## Overview

FemFin AI uses environment variables to manage configuration across different environments (development, staging, production). This guide explains how to set up and use them properly.

## 📁 File Structure

```
FemFin-AI/
├── server/
│   ├── .env                    # Server environment variables (not in git)
│   ├── .env.example            # Example template for development
│   └── .env.production.example # Example template for production
└── client/
    ├── .env                    # Client environment variables (not in git)
    ├── .env.example            # Example template for development
    └── .env.production.example # Example template for production
```

## 🔐 Security Best Practices

### DO ✅

- Keep `.env` files in `.gitignore` (already configured)
- Use `.env.example` files to share structure without values
- Use strong, unique secrets for JWT and API keys
- Rotate secrets regularly in production
- Use different values for development and production
- Store production secrets in secure vault services (AWS Secrets Manager, Azure Key Vault, etc.)

### DON'T ❌

- Never commit `.env` files to git
- Never use default/example values in production
- Never expose sensitive keys in client-side code
- Never share production credentials via insecure channels

## 🖥️ Server Environment Variables

### Required Variables

```bash
PORT=5000                        # Server port
NODE_ENV=development             # Environment: development/production
CLIENT_URL=http://localhost:3000 # Client URL for CORS
JWT_SECRET=your_secret_here      # Secret for JWT tokens
```

### Optional Variables

```bash
# Database
MONGODB_URI=mongodb://localhost:27017/femfin-ai

# API Keys
OPENAI_API_KEY=your_key_here
BLOCKCHAIN_API_KEY=your_key_here
INFURA_PROJECT_ID=your_id_here

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_password

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
```

## 💻 Client Environment Variables

### Important Notes

- All client variables **MUST** start with `REACT_APP_`
- Changes require restarting the dev server
- Only variables starting with `REACT_APP_` are embedded in the build

### Available Variables

```bash
# API Configuration
REACT_APP_API_URL=http://localhost:5000/api

# App Configuration
REACT_APP_NAME=FemFin AI
REACT_APP_VERSION=1.0.0

# Feature Flags
REACT_APP_ENABLE_DARK_MODE=true
REACT_APP_ENABLE_ANALYTICS=false

# External Services (client-safe keys only!)
REACT_APP_GOOGLE_ANALYTICS_ID=your_ga_id
REACT_APP_SENTRY_DSN=your_sentry_dsn
REACT_APP_GOOGLE_MAPS_API_KEY=your_maps_key
```

## 🚀 Setup Instructions

### Development Setup

1. **Server Setup**

   ```bash
   cd server
   cp .env.example .env
   # Edit .env with your values
   nano .env
   ```

2. **Client Setup**

   ```bash
   cd client
   cp .env.example .env
   # Edit .env with your values
   nano .env
   ```

3. **Verify Configuration**

   ```bash
   # Start server
   cd server
   npm run dev

   # Start client (in another terminal)
   cd client
   npm start
   ```

### Production Setup

1. **Server**

   ```bash
   # Use production template
   cp .env.production.example .env

   # Set strong values
   JWT_SECRET=$(openssl rand -base64 32)

   # Add to your deployment platform
   # Heroku: heroku config:set KEY=value
   # Vercel: vercel env add KEY
   # AWS: Use AWS Secrets Manager
   ```

2. **Client**

   ```bash
   # Create production .env
   cp .env.production.example .env.production

   # Edit with production values
   REACT_APP_API_URL=https://api.yourdomain.com/api

   # Build
   npm run build
   ```

## 🔍 Using Environment Variables in Code

### Server-side (Node.js)

```javascript
// Access variables directly
const port = process.env.PORT || 5000;
const jwtSecret = process.env.JWT_SECRET;
const mongoUri = process.env.MONGODB_URI;

// Check if required variables exist
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is required");
}
```

### Client-side (React)

```javascript
// Access variables with REACT_APP_ prefix
const apiUrl = process.env.REACT_APP_API_URL;
const appName = process.env.REACT_APP_NAME;
const isDarkModeEnabled = process.env.REACT_APP_ENABLE_DARK_MODE === "true";

// Check availability
console.log("Available env vars:", {
  apiUrl: process.env.REACT_APP_API_URL,
  appName: process.env.REACT_APP_NAME,
});
```

## 🌍 Different Environments

### Local Development

```bash
# Server
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# Client
REACT_APP_API_URL=http://localhost:5000/api
```

### Staging

```bash
# Server
PORT=5000
NODE_ENV=staging
CLIENT_URL=https://staging.yourdomain.com

# Client
REACT_APP_API_URL=https://api-staging.yourdomain.com/api
```

### Production

```bash
# Server
PORT=5000
NODE_ENV=production
CLIENT_URL=https://yourdomain.com
MONGODB_URI=mongodb+srv://...

# Client
REACT_APP_API_URL=https://api.yourdomain.com/api
REACT_APP_ENABLE_ANALYTICS=true
```

## 🔧 Common Issues & Solutions

### Issue: Changes not reflecting

**Solution:** Restart the development server after .env changes

```bash
# Stop server (Ctrl+C)
npm start
```

### Issue: Variables undefined in React

**Problem:** Variable doesn't start with `REACT_APP_`
**Solution:** Rename the variable

```bash
# Wrong
API_URL=http://localhost:5000

# Correct
REACT_APP_API_URL=http://localhost:5000
```

### Issue: CORS errors

**Problem:** CLIENT_URL doesn't match actual client URL
**Solution:** Update server .env

```bash
CLIENT_URL=http://localhost:3000
```

### Issue: API calls failing

**Problem:** Wrong API URL in client
**Solution:** Check and update client .env

```bash
REACT_APP_API_URL=http://localhost:5000/api
```

## 📝 Deployment Platforms

### Heroku

```bash
heroku config:set PORT=5000
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_secret
```

### Vercel

```bash
vercel env add REACT_APP_API_URL production
vercel env add REACT_APP_NAME production
```

### Netlify

Add in Netlify dashboard: Site settings → Build & deploy → Environment variables

### Railway

Add in Railway dashboard: Variables tab

### AWS

Use AWS Secrets Manager or Parameter Store

## 🧪 Testing Configuration

```bash
# Test server env
curl http://localhost:5000/api/health

# Test client env
# Check browser console for process.env values
console.log(process.env.REACT_APP_API_URL)
```

## 📚 References

- [dotenv documentation](https://github.com/motdotla/dotenv)
- [Create React App - Environment Variables](https://create-react-app.dev/docs/adding-custom-environment-variables/)
- [Node.js Best Practices - Environment Variables](https://github.com/goldbergyoni/nodebestpractices)

## ⚠️ Important Reminders

1. **Never commit `.env` files** - they're in `.gitignore` for a reason
2. **Use `.env.example` files** - to show structure without exposing secrets
3. **Rotate secrets regularly** - especially JWT_SECRET in production
4. **Use different secrets** - for development and production
5. **Client variables are public** - never put sensitive data in REACT*APP* variables
6. **Restart after changes** - environment variables are loaded at startup

## 🎯 Quick Reference

```bash
# Copy example files
cp server/.env.example server/.env
cp client/.env.example client/.env

# Generate secure JWT secret
openssl rand -base64 32

# Test configuration
npm run dev  # in server directory
npm start    # in client directory
```

---

**Your environment variables are now properly configured!** 🎉
