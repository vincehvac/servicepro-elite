# ServicePro Elite - Complete Setup Guide

## 🚀 Quick Start (3 Steps)

### Step 1: Clone the Repository
```bash
git clone https://github.com/vincehvac/servicepro-elite.git
cd servicepro-elite
```

### Step 2: Deploy Backend to Vercel
```bash
cd backend
vercel --prod
```
**Note:** Copy the deployment URL (e.g., `https://your-backend.vercel.app`)

### Step 3: Deploy Frontend to Vercel
```bash
cd ../frontend
# Create .env file with your backend URL
echo "REACT_APP_API_URL=https://your-backend.vercel.app" > .env
vercel --prod
```

**That's it! Your ServicePro Elite is now live! 🎉**

---

## 📋 Detailed Setup Instructions

### Prerequisites
- Node.js 18+ installed
- Vercel account (free tier works)
- Git installed

### Backend Deployment

#### Option 1: Vercel (Recommended - Easiest)
1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Navigate to backend folder:
   ```bash
   cd backend
   ```

3. Deploy to Vercel:
   ```bash
   vercel --prod
   ```

4. Follow the prompts:
   - Link to existing project? **No**
   - Project name: **servicepro-backend**
   - Directory: **./backend**
   - Override settings? **No**

5. Copy the deployment URL provided

#### Option 2: Railway
1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select `servicepro-elite` repository
4. Set root directory to `/backend`
5. Add environment variables (see below)
6. Deploy

#### Option 3: Heroku
1. Install Heroku CLI
2. Navigate to backend:
   ```bash
   cd backend
   ```
3. Create Heroku app:
   ```bash
   heroku create servicepro-backend
   ```
4. Deploy:
   ```bash
   git subtree push --prefix backend heroku main
   ```

### Frontend Deployment

#### Option 1: Vercel (Recommended)
1. Navigate to frontend folder:
   ```bash
   cd frontend
   ```

2. Create `.env` file:
   ```bash
   cp .env.example .env
   ```

3. Edit `.env` and add your backend URL:
   ```
   REACT_APP_API_URL=https://your-backend.vercel.app
   ```

4. Deploy:
   ```bash
   vercel --prod
   ```

#### Option 2: Netlify
1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Build the frontend:
   ```bash
   cd frontend
   npm install
   npm run build
   ```

3. Deploy:
   ```bash
   netlify deploy --prod --dir=build
   ```

#### Option 3: GitHub Pages
1. Update `package.json` homepage:
   ```json
   "homepage": "https://yourusername.github.io/servicepro-elite"
   ```

2. Install gh-pages:
   ```bash
   npm install --save-dev gh-pages
   ```

3. Add deploy script to `package.json`:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d build"
   }
   ```

4. Deploy:
   ```bash
   npm run deploy
   ```

### Mobile App Deployment

#### Build for iOS/Android using Expo
1. Navigate to mobile folder:
   ```bash
   cd mobile
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Update API URL in `src/config/api.js`:
   ```javascript
   export const API_URL = 'https://your-backend.vercel.app';
   ```

4. Build for iOS:
   ```bash
   expo build:ios
   ```

5. Build for Android:
   ```bash
   expo build:android
   ```

---

## 🔑 Environment Variables

### Backend Environment Variables

Create a `.env` file in the `backend` folder or add these in your hosting platform:

```env
# Required
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-frontend-domain.com
JWT_SECRET=your-super-secret-jwt-key-change-this

# Database (PostgreSQL) - Optional for now, uses in-memory storage
DATABASE_URL=postgresql://username:password@host:5432/servicepro_elite

# Email Service (Optional)
SENDGRID_API_KEY=your_sendgrid_api_key
EMAIL_FROM=noreply@servicepro.com

# SMS Service (Optional)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Payment Processing (Optional)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key

# Google Maps (Optional)
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### Frontend Environment Variables

Create a `.env` file in the `frontend` folder:

```env
# Required
REACT_APP_API_URL=https://your-backend.vercel.app

# Optional
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

---

## 🔌 Third-Party Integrations Setup

### 1. Google Maps API (For GPS Tracking & Route Optimization)
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable these APIs:
   - Maps JavaScript API
   - Directions API
   - Distance Matrix API
   - Geocoding API
4. Create API credentials
5. Add the API key to your environment variables

**Cost:** Free tier includes $200/month credit

### 2. Stripe (For Payment Processing)
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Get your API keys from Developers → API keys
3. Add both publishable and secret keys to environment variables
4. Set up webhooks for payment events

**Cost:** 2.9% + $0.30 per transaction

### 3. Twilio (For SMS Notifications)
1. Sign up at [Twilio](https://www.twilio.com)
2. Get a phone number
3. Copy Account SID and Auth Token
4. Add to environment variables

**Cost:** $1/month per phone number + $0.0075 per SMS

### 4. SendGrid (For Email Notifications)
1. Sign up at [SendGrid](https://sendgrid.com)
2. Create an API key
3. Verify sender email
4. Add API key to environment variables

**Cost:** Free tier includes 100 emails/day

### 5. PostgreSQL Database (Optional - Currently uses in-memory)
1. Sign up at [Supabase](https://supabase.com) (Free tier available)
2. Create a new project
3. Copy the connection string
4. Add to `DATABASE_URL` environment variable

**Cost:** Free tier available, $25/month for production

---

## 🧪 Testing Your Deployment

### Test Backend API
```bash
curl https://your-backend.vercel.app/health
```
Expected response:
```json
{"status":"OK","timestamp":"2025-10-13T21:40:00.000Z"}
```

### Test Frontend
1. Open your frontend URL in a browser
2. Try logging in with demo credentials:
   - Email: `admin@servicepro.com`
   - Password: `password123`

### Test Mobile App
1. Open Expo Go app on your phone
2. Scan the QR code from `expo start`
3. Test login and features

---

## 🐛 Troubleshooting

### Backend Issues

**Problem:** 404 errors on API routes
- **Solution:** Ensure `vercel.json` is in the backend folder
- Check that routes start with `/api/`

**Problem:** CORS errors
- **Solution:** Add your frontend URL to `FRONTEND_URL` environment variable

**Problem:** Database connection errors
- **Solution:** The app uses in-memory storage by default. To use PostgreSQL, add `DATABASE_URL` to environment variables

### Frontend Issues

**Problem:** Blank page after deployment
- **Solution:** Check browser console for errors
- Ensure `REACT_APP_API_URL` is set correctly
- Verify backend is accessible

**Problem:** API calls failing
- **Solution:** Check that backend URL in `.env` is correct
- Ensure backend is deployed and running

### Mobile App Issues

**Problem:** Can't connect to API
- **Solution:** Update API URL in `src/config/api.js`
- Ensure your phone and computer are on the same network (for local testing)

---

## 📊 Monitoring & Maintenance

### Vercel Dashboard
- Monitor deployments at [vercel.com/dashboard](https://vercel.com/dashboard)
- View logs and analytics
- Set up custom domains

### Database Backups (When using PostgreSQL)
```bash
# Backup
pg_dump $DATABASE_URL > backup.sql

# Restore
psql $DATABASE_URL < backup.sql
```

### Update Deployment
```bash
# Backend
cd backend
vercel --prod

# Frontend
cd frontend
vercel --prod
```

---

## 🎯 Next Steps

1. **Set up custom domain** in Vercel dashboard
2. **Enable SSL** (automatic with Vercel)
3. **Configure integrations** (Stripe, Twilio, SendGrid)
4. **Set up database** (Supabase or Railway)
5. **Deploy mobile apps** to App Store and Google Play
6. **Set up monitoring** (Sentry for error tracking)
7. **Configure backups** for database

---

## 💡 Tips for Production

1. **Use environment-specific configs** - Different settings for dev/staging/prod
2. **Enable rate limiting** - Already configured in backend
3. **Set up monitoring** - Use Sentry or LogRocket
4. **Regular backups** - Automate database backups
5. **Security audits** - Run `npm audit` regularly
6. **Performance monitoring** - Use Vercel Analytics
7. **User feedback** - Implement feedback collection

---

## 📞 Support

- **Documentation:** Check all `.md` files in the repository
- **Issues:** Open an issue on GitHub
- **Email:** support@servicepro.com (update with your email)

---

## 🎉 Congratulations!

Your ServicePro Elite field service management platform is now live and ready to use!

**Demo Credentials:**
- Email: `admin@servicepro.com`
- Password: `password123`

**Remember to change these credentials in production!**