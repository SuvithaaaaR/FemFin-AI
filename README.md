# FemFin AI

FemFin AI is an AI-driven funding platform focused on women entrepreneurs. It combines recommendation intelligence, credit scoring, crowdfunding workflows, and AI assistance in one product.

## What This Project Includes

1. Authentication and user profiles
2. Fund recommendation workflows
3. Credit scoring flows
4. Crowdfunding campaign management and investments
5. AI assistance endpoints (financial advice, business plan analysis, chat)
6. Sentiment and trust analysis endpoints
7. Production-ready frontend deployment flow (GitHub Pages)
8. Production-ready backend deployment flow (Render)

## Current Architecture

1. Frontend: React 18 + Mantine + React Router + Axios
2. Backend: Node.js + Express + middleware-based architecture
3. Database: Supabase (PostgreSQL via Supabase client)
4. Auth: JWT-based API authentication
5. AI Provider Layer:
   1. xAI model support
   2. Ollama fallback/local support

## Important Current Status

1. Face authentication has been removed from active backend routes and frontend login/register UI.
2. Active login is standard email + password auth.

## Repository Structure

```text
FemFin-AI/
  backend/
    config/
    controllers/
    data/
    middleware/
    models/
    routes/
    services/
    supabase/migrations/
    server.js
    package.json
  frontend/
    public/
    src/
      components/
      contexts/
      pages/
      services/
      utils/
      App.js
    build/
    package.json
  docs/
    README.md
    SETUP.md
    BACKEND-ARCHITECTURE.md
    BACKEND-QUICK-REFERENCE.md
    PROJECT-STRUCTURE.md
```

## Prerequisites

1. Node.js 20.x recommended
2. npm
3. Supabase project (URL + service role key)
4. Optional for AI local mode: Ollama running locally

## Environment Configuration

### Backend (`backend/.env`)

Minimum required:

```env
PORT=5000
NODE_ENV=development
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
JWT_SECRET=your_strong_jwt_secret_min_32_chars
CLIENT_URL=http://localhost:3000
```

AI settings:

```env
AI_PROVIDER=ollama
OLLAMA_URL=http://127.0.0.1:11434
OLLAMA_MODEL=llama3.1:latest
XAI_MODEL=grok-2-latest
XAI_API_KEY=your_xai_api_key
AI_TIMEOUT_MS=120000
```

Rate limiting:

```env
ENABLE_RATE_LIMIT=true
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
AUTH_RATE_LIMIT_WINDOW=15
AUTH_RATE_LIMIT_MAX=20
```

Crowdfunding payment/blockchain (optional but recommended):

```env
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
BLOCKCHAIN_RPC_URL=https://sepolia.infura.io/v3/your_project_id
BLOCKCHAIN_PRIVATE_KEY=your_wallet_private_key
BLOCKCHAIN_NETWORK=sepolia
BLOCKCHAIN_EXPLORER_BASE_URL=https://sepolia.etherscan.io/tx/
INVESTMENT_AGREEMENT_VERSION=v1.0
```

### Frontend (`frontend/.env.production`)

```env
REACT_APP_API_URL=https://femfin-ai.onrender.com/api
REACT_APP_NAME=FemFin AI
REACT_APP_VERSION=1.0.0
REACT_APP_ENABLE_DARK_MODE=true
REACT_APP_ENABLE_ANALYTICS=false
```

## Local Development

1. Install dependencies

```bash
cd frontend
npm install
cd ../backend
npm install
```

2. Run backend

```bash
cd backend
npm run dev
```

3. Run frontend (new terminal)

```bash
cd frontend
npm start
```

4. Open app
   1. Frontend: http://localhost:3000
   2. Backend health: http://localhost:5000/api/health
   3. API index: http://localhost:5000/api

## Core API Endpoints

### Auth

1. `POST /api/auth/register`
2. `POST /api/auth/login`
3. `GET /api/auth/me` (protected)
4. `PUT /api/auth/updatedetails` (protected)
5. `PUT /api/auth/updatepassword` (protected)
6. `GET /api/auth/logout` (protected)

### Fund Recommendations

1. `POST /api/fund-recommendations/analyze`
2. `GET /api/fund-recommendations/sources`
3. `GET /api/fund-recommendations/history` (protected)

### Crowdfunding

1. `GET /api/crowdfunding/campaigns`
2. `POST /api/crowdfunding/campaigns` (protected)
3. `GET /api/crowdfunding/campaigns/:id`
4. `PUT /api/crowdfunding/campaigns/:id` (protected)
5. `DELETE /api/crowdfunding/campaigns/:id` (protected)
6. `POST /api/crowdfunding/campaigns/:id/invest` (protected)
7. `POST /api/crowdfunding/campaigns/:id/investments/order` (protected)
8. `POST /api/crowdfunding/campaigns/:id/investments/verify` (protected)
9. `GET /api/crowdfunding/my-campaigns` (protected)
10. `GET /api/crowdfunding/my-investments` (protected)

### Credit Scoring

1. `POST /api/credit-scoring/calculate`
2. `GET /api/credit-scoring/history` (protected)
3. `GET /api/credit-scoring/latest` (protected)

### AI

1. `GET /api/ai/status`
2. `POST /api/ai/query` (public)
3. `POST /api/ai/financial-advice` (protected)
4. `POST /api/ai/analyze-business-plan` (protected)
5. `POST /api/ai/fund-recommendations` (protected)
6. `POST /api/ai/credit-score-tips` (protected)
7. `POST /api/ai/analyze-pitch` (protected)
8. `POST /api/ai/chat` (protected)

### Sentiment

1. `POST /api/sentiment/analyze` (protected)
2. `POST /api/sentiment/analyze-reviews` (protected)
3. `POST /api/sentiment/trust-score` (protected)
4. `POST /api/sentiment/campaign-description` (protected)
5. `POST /api/sentiment/investor-feedback` (protected)

### Funds

1. `GET /api/funds`
2. `GET /api/funds/categories`
3. `GET /api/funds/:id`
4. `POST /api/funds/seed` (protected)
5. `POST /api/funds` (protected)
6. `PUT /api/funds/:id` (protected)
7. `DELETE /api/funds/:id` (protected)

## Frontend Routes

Public:

1. `/`
2. `/register`
3. `/login`
4. `/fund-details`

Protected:

1. `/fund-recommendation`
2. `/pitch-deck`
3. `/investor-details`
4. `/recommendation-history`
5. `/crowdfunding`
6. `/credit-scoring`
7. `/dashboard`

## Deployment

### Frontend (GitHub Pages)

```bash
cd frontend
npm run deploy
```

### Backend (Render)

1. Connect repository in Render
2. Set root directory to `backend`
3. Build command: `npm install`
4. Start command: `npm start`
5. Add backend environment variables

## Security and Middleware Highlights

1. Helmet for secure HTTP headers
2. CORS allowlist logic using `CLIENT_URL`
3. API and auth rate limiting
4. Request sanitization middleware
5. JWT auth middleware for protected endpoints
6. Centralized async error handling

## Troubleshooting

1. `Failed to fetch` on frontend:
   1. Verify backend URL in `REACT_APP_API_URL`
   2. Check backend is running and healthy
   3. Confirm CORS allowlist includes frontend origin
2. `Too many auth attempts`:
   1. Wait for auth window reset
   2. Tune `AUTH_RATE_LIMIT_WINDOW` and `AUTH_RATE_LIMIT_MAX`
3. Supabase connection errors:
   1. Recheck `SUPABASE_URL`
   2. Recheck `SUPABASE_SERVICE_ROLE_KEY`

## Additional Documentation

1. `docs/README.md`
2. `docs/SETUP.md`
3. `docs/BACKEND-ARCHITECTURE.md`
4. `docs/BACKEND-QUICK-REFERENCE.md`
5. `docs/PROJECT-STRUCTURE.md`
6. `docs/GROK-AI-INTEGRATION.md`

## License

MIT
