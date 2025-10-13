# ServicePro Elite - Quick Start Guide

## 🚀 Fastest Way to Deploy (5 Minutes)

### Prerequisites
- GitHub account
- Vercel account (free) - [Sign up here](https://vercel.com/signup)

---

## Method 1: One-Click Deploy (Easiest)

### Backend Deployment
1. Click this button: [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vincehvac/servicepro-elite/tree/main/backend)
2. Connect your GitHub account
3. Click "Deploy"
4. Copy the deployment URL (e.g., `https://servicepro-backend.vercel.app`)

### Frontend Deployment
1. Click this button: [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vincehvac/servicepro-elite/tree/main/frontend)
2. Add environment variable:
   - Name: `REACT_APP_API_URL`
   - Value: Your backend URL from step 1
3. Click "Deploy"
4. Your app is live! 🎉

---

## Method 2: CLI Deploy (Recommended)

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Clone Repository
```bash
git clone https://github.com/vincehvac/servicepro-elite.git
cd servicepro-elite
```

### Step 3: Deploy Backend
```bash
cd backend
vercel --prod
```
- When prompted, press Enter to accept defaults
- Copy the deployment URL

### Step 4: Deploy Frontend
```bash
cd ../frontend
echo "REACT_APP_API_URL=https://your-backend-url.vercel.app" > .env
vercel --prod
```

### Step 5: Access Your App
Open the frontend URL provided by Vercel!

**Demo Login:**
- Email: `admin@servicepro.com`
- Password: `password123`

---

## Method 3: Docker Deploy (For Self-Hosting)

### Prerequisites
- Docker installed
- Docker Compose installed

### Step 1: Clone Repository
```bash
git clone https://github.com/vincehvac/servicepro-elite.git
cd servicepro-elite
```

### Step 2: Configure Environment
```bash
# Backend
cd backend
cp .env.example .env
# Edit .env with your settings

# Frontend
cd ../frontend
cp .env.example .env
# Edit .env with your settings
```

### Step 3: Start Services
```bash
cd ..
docker-compose up -d
```

### Step 4: Access Your App
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

---

## 🔧 Post-Deployment Setup

### 1. Change Default Password
```bash
# Login with default credentials
# Go to Settings → Change Password
# Update to a secure password
```

### 2. Add Your Company Info
```bash
# Go to Settings → Company Profile
# Add your company name, logo, and details
```

### 3. Configure Integrations (Optional)
See [INTEGRATIONS.md](INTEGRATIONS.md) for:
- Google Maps API (for GPS tracking)
- Stripe (for payments)
- Twilio (for SMS)
- SendGrid (for emails)

---

## 📱 Mobile App Setup

### Step 1: Install Expo Go
- iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)
- Android: [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)

### Step 2: Update API URL
```bash
cd mobile
# Edit src/config/api.js
export const API_URL = 'https://your-backend-url.vercel.app';
```

### Step 3: Start Development Server
```bash
npm install
expo start
```

### Step 4: Scan QR Code
- Open Expo Go app
- Scan the QR code displayed in terminal
- App will load on your phone!

---

## ✅ Verify Everything Works

### Test Backend
```bash
curl https://your-backend-url.vercel.app/health
```
Expected: `{"status":"OK","timestamp":"..."}`

### Test Frontend
1. Open your frontend URL
2. Login with demo credentials
3. Check that dashboard loads
4. Verify you can see customers, jobs, etc.

### Test Mobile
1. Open app in Expo Go
2. Login with same credentials
3. Check that jobs load
4. Test GPS tracking (if enabled)

---

## 🆘 Troubleshooting

### Backend Issues

**Problem:** 404 errors
```bash
# Solution: Ensure vercel.json exists in backend folder
cd backend
cat vercel.json
```

**Problem:** CORS errors
```bash
# Solution: Add frontend URL to backend environment variables
# In Vercel dashboard: Settings → Environment Variables
# Add: FRONTEND_URL = https://your-frontend-url.vercel.app
```

### Frontend Issues

**Problem:** Blank page
```bash
# Solution: Check browser console for errors
# Ensure REACT_APP_API_URL is set correctly
# Verify backend is accessible
```

**Problem:** API calls failing
```bash
# Solution: Check .env file
cat frontend/.env
# Should contain: REACT_APP_API_URL=https://your-backend-url.vercel.app
```

### Mobile Issues

**Problem:** Can't connect to API
```bash
# Solution: Update API URL in mobile/src/config/api.js
# Ensure backend URL is correct and accessible
```

---

## 🎯 Next Steps

1. **Customize Branding**
   - Update logo in `frontend/public/logo.png`
   - Change colors in `frontend/src/styles/theme.js`

2. **Add Users**
   - Go to Settings → Users
   - Add technicians, dispatchers, etc.

3. **Import Customers**
   - Go to Customers → Import
   - Upload CSV file with customer data

4. **Configure Integrations**
   - See [INTEGRATIONS.md](INTEGRATIONS.md)
   - Start with Google Maps for GPS tracking

5. **Train Your Team**
   - Share login credentials
   - Provide mobile app access
   - Review features together

---

## 💡 Pro Tips

1. **Use Vercel for hosting** - It's free and easy
2. **Start with minimum integrations** - Add more as needed
3. **Test with demo data first** - Before importing real data
4. **Enable 2FA** - For admin accounts
5. **Set up backups** - If using database
6. **Monitor usage** - Check Vercel analytics

---

## 📞 Need Help?

- **Documentation:** Check [SETUP.md](SETUP.md) for detailed instructions
- **Integrations:** See [INTEGRATIONS.md](INTEGRATIONS.md)
- **Issues:** [Open an issue on GitHub](https://github.com/vincehvac/servicepro-elite/issues)

---

## 🎉 You're All Set!

Your ServicePro Elite is now live and ready to use!

**What you have:**
- ✅ Full CRM system
- ✅ Scheduling and dispatch
- ✅ Mobile app for technicians
- ✅ Real-time updates
- ✅ Invoice management
- ✅ Reporting and analytics

**Total setup time:** ~5 minutes
**Total cost:** $0 (with free tiers)

**Start managing your field service business like a pro! 🚀**