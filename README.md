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

1. Install all dependencies:

   ```bash
   npm run install-all
   ```

2. Set up environment variables (create .env files in client and server folders)

3. Run the application:
   ```bash
   npm run dev
   ```

## Project Structure

```
FemFin-AI/
├── client/          # React frontend
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       └── App.js
├── server/          # Express backend
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   └── server.js
└── package.json
```

## Development

- Client runs on: http://localhost:3000
- Server runs on: http://localhost:5000
