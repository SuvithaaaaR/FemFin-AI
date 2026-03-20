# FemFin AI - Setup Guide

## Quick Start

Follow these steps to get the application running on your local machine:

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Git

### Installation Steps

1. **Install dependencies**

   ```bash
   cd frontend
   npm install

   cd ../backend
   npm install
   ```

2. **Configure Environment Variables**

   The server `.env` file is already created at `backend/.env`. You can modify it if needed:

   ```
   PORT=5000
   NODE_ENV=development
   ```

3. **Run the Application**

   In one terminal (Backend):

   ```bash
   cd backend
   npm run dev
   ```

   In another terminal (Frontend):

   ```bash
   cd frontend
   npm start
   ```

4. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - API Health Check: http://localhost:5000/api/health

## Application Features

### 1. AI Fund Recommendations

- Navigate to `/fund-recommendation` or click "Fund Recommendations" in the header
- Fill in your business details in the multi-step form
- Get personalized recommendations for:
  - Government Schemes
  - Angel Investors
  - Venture Capital Funds
  - Women Entrepreneur Grants

### 2. Blockchain Crowdfunding

- Navigate to `/crowdfunding` or click "Crowdfunding" in the header
- Browse active campaigns
- Create your own campaign with milestone-based funding
- Invest in campaigns using secure blockchain contracts

### 3. AI Credit Scoring

- Navigate to `/credit-scoring` or click "Credit Scoring" in the header
- Enter your business and financial details
- Get an AI-powered credit score (0-900)
- View loan eligibility without collateral
- Based on:
  - Digital transactions
  - Business activity
  - Social trust score
  - Financial health

### 4. Dashboard

- Navigate to `/dashboard` or click "Dashboard" in the header
- View overview of all your activities
- Quick stats and recent activity
- Access all features from one place

## Project Structure

```
FemFin-AI/
├── frontend/                 # React Frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   └── Layout/
│   │   │       └── Header.js
│   │   ├── pages/
│   │   │   ├── HomePage.js
│   │   │   ├── FundRecommendation.js
│   │   │   ├── Crowdfunding.js
│   │   │   ├── CreditScoring.js
│   │   │   └── Dashboard.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
├── backend/                 # Express Backend
│   ├── routes/
│   │   ├── fundRecommendation.js
│   │   ├── crowdfunding.js
│   │   └── creditScoring.js
│   ├── .env
│   ├── server.js
│   └── package.json
│
└── docs/
```

## API Endpoints

### Fund Recommendations

- `POST /api/fund-recommendations/analyze` - Analyze business and get recommendations

### Crowdfunding

- `POST /api/crowdfunding/create` - Create a new campaign
- `GET /api/crowdfunding/campaigns` - Get all active campaigns
- `POST /api/crowdfunding/invest/:campaignId` - Invest in a campaign
- `GET /api/crowdfunding/campaign/:campaignId` - Get campaign details

### Credit Scoring

- `POST /api/credit-scoring/analyze` - Calculate credit score
- `GET /api/credit-scoring/loan-eligibility/:score` - Get loan eligibility

## Technology Stack

### Frontend

- **React 18** - UI library
- **Mantine UI 7** - Component library
- **React Router** - Routing
- **Axios** - HTTP client
- **Tabler Icons** - Icon library

### Backend

- **Node.js** - Runtime
- **Express** - Web framework
- **Cors** - Cross-origin resource sharing
- **dotenv** - Environment variables

## Development

### Code Structure

- **Components**: Reusable UI components in `frontend/src/components/`
- **Pages**: Main page components in `frontend/src/pages/`
- **Routes**: API routes in `backend/routes/`
- **Services**: API service layer in `frontend/src/services/`

### Adding New Features

1. Create new page component in `frontend/src/pages/`
2. Add route in `frontend/src/App.js`
3. Create API route in `backend/routes/`
4. Add route to `backend/server.js`

## Troubleshooting

### Port Already in Use

If port 3000 or 5000 is already in use:

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill
```

### Dependencies Issues

```bash
# Clear cache and reinstall
rm -rf frontend/node_modules backend/node_modules
cd frontend && npm install
cd ../backend && npm install
```

### API Connection Issues

- Ensure server is running on port 5000
- Check `frontend/package.json` has proxy configured
- Verify CORS is enabled in server

## Next Steps

### Deployment

1. Frontend (GitHub Pages)
2. From `frontend/`, run `npm run deploy`
3. Ensure `homepage` in `frontend/package.json` points to your Pages/custom domain

1. Backend (Render)
2. Create a Web Service with Root Directory set to `backend`
3. Build command: `npm install`
4. Start command: `npm start`
5. Add env vars from `backend/.env.example`

### For Production Deployment:

1. Set up MongoDB database
2. Add user authentication (JWT)
3. Integrate actual AI/ML models
4. Implement blockchain smart contracts
5. Add payment gateway integration
6. Set up CI/CD pipeline

### Future Enhancements:

- User authentication and profiles
- Database integration
- Real blockchain integration
- AI/ML model integration
- Payment processing
- Email notifications
- File upload for documents
- Advanced analytics
- Mobile app (React Native)

## Support

For issues or questions:

- Check the README.md
- Review the code comments
- Test API endpoints using the health check

## License

MIT License
