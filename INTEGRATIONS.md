# ServicePro Elite - Third-Party Integrations Guide

## 🔌 Required Integrations for Full Functionality

### 1. Google Maps API (GPS & Route Optimization)

**Purpose:** Real-time GPS tracking, route optimization, traffic-aware navigation

**Setup Steps:**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable the following APIs:
   - Maps JavaScript API
   - Directions API
   - Distance Matrix API
   - Geocoding API
   - Places API
4. Go to "Credentials" → "Create Credentials" → "API Key"
5. Restrict the API key:
   - Application restrictions: HTTP referrers (for frontend)
   - API restrictions: Select the APIs listed above
6. Copy the API key

**Environment Variables:**
```env
# Backend
GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Frontend
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

**Cost:** Free tier includes $200/month credit (~28,000 map loads)

**Features Enabled:**
- ✅ Real-time technician GPS tracking
- ✅ Route optimization with traffic data
- ✅ Automatic address geocoding
- ✅ Distance and time calculations
- ✅ Interactive dispatch map

---

### 2. Stripe (Payment Processing)

**Purpose:** Accept credit card payments, process invoices, manage subscriptions

**Setup Steps:**
1. Sign up at [Stripe Dashboard](https://dashboard.stripe.com)
2. Complete account verification
3. Go to Developers → API keys
4. Copy both keys:
   - Publishable key (starts with `pk_`)
   - Secret key (starts with `sk_`)
5. Set up webhooks:
   - Go to Developers → Webhooks
   - Add endpoint: `https://your-backend.vercel.app/api/webhooks/stripe`
   - Select events: `payment_intent.succeeded`, `invoice.paid`, `customer.subscription.updated`
   - Copy webhook secret

**Environment Variables:**
```env
# Backend
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Frontend
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

**Cost:** 2.9% + $0.30 per successful transaction

**Features Enabled:**
- ✅ Credit card payment processing
- ✅ Invoice payment collection
- ✅ Recurring billing for service agreements
- ✅ Payment history and receipts
- ✅ Refund processing

---

### 3. Twilio (SMS Notifications)

**Purpose:** Send SMS notifications for appointments, job updates, and reminders

**Setup Steps:**
1. Sign up at [Twilio](https://www.twilio.com)
2. Verify your phone number
3. Get a Twilio phone number:
   - Go to Phone Numbers → Buy a Number
   - Select a number with SMS capabilities
4. Copy credentials:
   - Account SID (from dashboard)
   - Auth Token (from dashboard)
   - Your Twilio phone number

**Environment Variables:**
```env
# Backend
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

**Cost:** 
- Phone number: $1/month
- SMS: $0.0075 per message (US)

**Features Enabled:**
- ✅ Appointment reminders
- ✅ Job status updates
- ✅ Technician dispatch notifications
- ✅ Customer communication
- ✅ Two-factor authentication

---

### 4. SendGrid (Email Notifications)

**Purpose:** Send email notifications, invoices, and marketing campaigns

**Setup Steps:**
1. Sign up at [SendGrid](https://sendgrid.com)
2. Verify your sender email:
   - Go to Settings → Sender Authentication
   - Verify a single sender email
3. Create API key:
   - Go to Settings → API Keys
   - Create API Key with "Full Access"
   - Copy the API key (shown only once)
4. Set up email templates (optional):
   - Go to Email API → Dynamic Templates
   - Create templates for invoices, reminders, etc.

**Environment Variables:**
```env
# Backend
EMAIL_SERVICE=sendgrid
SENDGRID_API_KEY=your_sendgrid_api_key
EMAIL_FROM=noreply@servicepro.com
EMAIL_FROM_NAME=ServicePro Elite
```

**Cost:** Free tier includes 100 emails/day, $19.95/month for 50,000 emails

**Features Enabled:**
- ✅ Invoice delivery via email
- ✅ Appointment confirmations
- ✅ Job completion notifications
- ✅ Marketing campaigns
- ✅ Password reset emails

---

### 5. PostgreSQL Database (Production Data Storage)

**Purpose:** Persistent data storage for production environment

**Setup Steps (Using Supabase - Recommended):**
1. Sign up at [Supabase](https://supabase.com)
2. Create a new project
3. Wait for database to provision (~2 minutes)
4. Go to Settings → Database
5. Copy the connection string (URI format)
6. Run migrations:
   ```bash
   cd backend
   npm install
   npm run migrate
   ```

**Alternative Options:**
- **Railway:** [railway.app](https://railway.app) - $5/month
- **Heroku Postgres:** [heroku.com](https://heroku.com) - $9/month
- **AWS RDS:** [aws.amazon.com/rds](https://aws.amazon.com/rds) - Variable pricing

**Environment Variables:**
```env
# Backend
DATABASE_URL=postgresql://username:password@host:5432/servicepro_elite
```

**Cost:** 
- Supabase: Free tier (500MB), $25/month (8GB)
- Railway: $5/month
- Heroku: $9/month

**Features Enabled:**
- ✅ Persistent data storage
- ✅ Customer records
- ✅ Job history
- ✅ Invoice records
- ✅ User accounts

---

## 🔧 Optional Integrations

### 6. QuickBooks (Accounting Integration)

**Purpose:** Sync invoices, expenses, and financial data

**Setup Steps:**
1. Go to [QuickBooks Developer](https://developer.intuit.com)
2. Create an app
3. Get Client ID and Client Secret
4. Set redirect URI: `https://your-backend.vercel.app/api/integrations/quickbooks/callback`

**Environment Variables:**
```env
QUICKBOOKS_CLIENT_ID=your_quickbooks_client_id
QUICKBOOKS_CLIENT_SECRET=your_quickbooks_client_secret
QUICKBOOKS_REDIRECT_URI=https://your-backend.vercel.app/api/integrations/quickbooks/callback
```

**Cost:** Free for development, varies for production

---

### 7. AWS S3 (File Storage)

**Purpose:** Store photos, documents, and attachments

**Setup Steps:**
1. Sign up at [AWS](https://aws.amazon.com)
2. Create an S3 bucket
3. Create IAM user with S3 access
4. Copy access keys

**Environment Variables:**
```env
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=servicepro-uploads
```

**Cost:** $0.023 per GB/month + transfer costs

---

### 8. Sentry (Error Tracking)

**Purpose:** Monitor errors and performance issues

**Setup Steps:**
1. Sign up at [Sentry](https://sentry.io)
2. Create a new project
3. Copy the DSN

**Environment Variables:**
```env
# Frontend
REACT_APP_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
```

**Cost:** Free tier available, $26/month for team

---

### 9. Google Analytics (Usage Analytics)

**Purpose:** Track user behavior and app usage

**Setup Steps:**
1. Go to [Google Analytics](https://analytics.google.com)
2. Create a new property
3. Copy the Measurement ID

**Environment Variables:**
```env
# Frontend
REACT_APP_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

**Cost:** Free

---

## 📋 Integration Checklist

### Minimum Required for Basic Functionality
- [ ] Google Maps API (for GPS tracking)
- [ ] PostgreSQL Database (for data persistence)

### Recommended for Full Functionality
- [ ] Stripe (for payment processing)
- [ ] Twilio (for SMS notifications)
- [ ] SendGrid (for email notifications)

### Optional but Valuable
- [ ] QuickBooks (for accounting)
- [ ] AWS S3 (for file storage)
- [ ] Sentry (for error tracking)
- [ ] Google Analytics (for usage tracking)

---

## 🔐 Security Best Practices

1. **Never commit API keys to Git**
   - Use `.env` files (already in `.gitignore`)
   - Use environment variables in hosting platforms

2. **Restrict API keys**
   - Google Maps: Restrict by HTTP referrer and API
   - Stripe: Use separate keys for test and production

3. **Rotate keys regularly**
   - Change API keys every 90 days
   - Immediately rotate if compromised

4. **Use webhook secrets**
   - Verify webhook signatures (Stripe)
   - Validate incoming requests

5. **Monitor usage**
   - Set up billing alerts
   - Monitor API usage dashboards

---

## 💰 Total Cost Estimate

### Minimum Setup (Basic Functionality)
- Google Maps: Free ($200 credit/month)
- PostgreSQL (Supabase): Free tier
- **Total: $0/month**

### Recommended Setup (Full Functionality)
- Google Maps: Free ($200 credit/month)
- PostgreSQL (Supabase): $25/month
- Stripe: 2.9% + $0.30 per transaction
- Twilio: $1/month + $0.0075 per SMS
- SendGrid: $19.95/month (50k emails)
- **Total: ~$46/month + transaction fees**

### Enterprise Setup (All Features)
- All above integrations
- QuickBooks: $30/month
- AWS S3: ~$10/month
- Sentry: $26/month
- **Total: ~$112/month + transaction fees**

---

## 🚀 Quick Setup Script

Save this as `setup-integrations.sh`:

```bash
#!/bin/bash

echo "ServicePro Elite - Integration Setup"
echo "===================================="
echo ""

# Backend .env
cd backend
cp .env.example .env
echo "✅ Created backend/.env"

# Frontend .env
cd ../frontend
cp .env.example .env
echo "✅ Created frontend/.env"

echo ""
echo "Next steps:"
echo "1. Edit backend/.env with your API keys"
echo "2. Edit frontend/.env with your API keys"
echo "3. Deploy backend: cd backend && vercel --prod"
echo "4. Deploy frontend: cd frontend && vercel --prod"
echo ""
echo "See INTEGRATIONS.md for detailed setup instructions"
```

Run with:
```bash
chmod +x setup-integrations.sh
./setup-integrations.sh
```

---

## 📞 Support

For integration issues:
1. Check the official documentation for each service
2. Review error logs in Vercel dashboard
3. Open an issue on GitHub with integration details

---

## ✅ Integration Testing

After setting up integrations, test each one:

```bash
# Test Google Maps
curl "https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=YOUR_API_KEY"

# Test Stripe
curl https://api.stripe.com/v1/charges \
  -u sk_test_YOUR_SECRET_KEY: \
  -d amount=2000 \
  -d currency=usd \
  -d source=tok_visa

# Test Twilio
curl -X POST https://api.twilio.com/2010-04-01/Accounts/YOUR_ACCOUNT_SID/Messages.json \
  --data-urlencode "Body=Test message" \
  --data-urlencode "From=+1234567890" \
  --data-urlencode "To=+1234567890" \
  -u YOUR_ACCOUNT_SID:YOUR_AUTH_TOKEN

# Test SendGrid
curl --request POST \
  --url https://api.sendgrid.com/v3/mail/send \
  --header "Authorization: Bearer YOUR_API_KEY" \
  --header "Content-Type: application/json" \
  --data '{"personalizations":[{"to":[{"email":"test@example.com"}]}],"from":{"email":"noreply@servicepro.com"},"subject":"Test","content":[{"type":"text/plain","value":"Test email"}]}'
```

---

**Remember:** Start with the minimum required integrations and add more as your business grows!