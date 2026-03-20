# FemFin AI - Women Entrepreneur Funding Platform

A comprehensive AI-powered platform for women entrepreneurs to access funding through multiple channels:

## Features

### 1. AI-Based Fund Recommendation

- User registration with business details
- AI analysis of business idea, budget, industry, and stage
- Personalized recommendations for:
  - Government schemes
  - Angel investors
  - Venture capital funds
  - Women entrepreneur grants

### 2. Blockchain-Based Crowdfunding

- Direct funding from investors to entrepreneurs
- Smart contract integration
- Milestone-based fund release
- Transparent and secure transactions

### 3. AI Credit Scoring (No Collateral)

- Alternative credit assessment without property collateral
- Evaluation based on:
  - Digital transactions
  - Business activity
  - Social trust score
  - Customer reviews
  - Sales data

## Tech Stack

- **Frontend**: React.js with Mantine UI Framework
- **Backend**: Node.js with Express
- **Database**: MongoDB
- **Blockchain**: Smart contracts for crowdfunding

## Installation

1. Install dependencies:

  ```bash
  cd frontend
  npm install
  cd ../backend
  npm install
  ```

2. Set up environment variables (create/update `.env` files in `frontend` and `backend`)

3. Run the application in two terminals:
  ```bash
  cd backend
  npm run dev
  ```
  ```bash
  cd frontend
  npm start
  ```

## Project Structure

```
FemFin-AI/
├── frontend/          # React frontend
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       └── App.js
├── backend/          # Express backend
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   └── server.js
└── docs/
```

## Development

- Frontend runs on: http://localhost:3000
- Backend runs on: http://localhost:5000

## Deployment

- Frontend deploys to GitHub Pages using `frontend/package.json` script: `npm run deploy`
- Backend is configured for Render in `backend/render.yaml`
