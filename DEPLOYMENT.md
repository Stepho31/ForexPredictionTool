# 🚀 Vercel Deployment Guide

## Quick Deploy to Vercel

### Option 1: Deploy with Vercel CLI (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **Follow the prompts:**
   - Link to existing project? → No
   - Project name → trading-signals-pro
   - Directory → ./
   - Override settings? → No

### Option 2: Deploy via GitHub

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure project settings

## 🔑 Required API Keys Setup

### 1. Firebase Setup (REQUIRED)

1. **Create Firebase Project:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project"
   - Name: `trading-signals-pro`
   - Enable Google Analytics (optional)

2. **Enable Authentication:**
   - Go to Authentication → Sign-in method
   - Enable Email/Password
   - Save

3. **Create Firestore Database:**
   - Go to Firestore Database
   - Click "Create database"
   - Start in test mode
   - Choose location (closest to your users)

4. **Get Web App Config:**
   - Go to Project Settings → General
   - Scroll to "Your apps"
   - Click "Add app" → Web
   - Register app with name: `trading-signals-web`
   - Copy the config object

5. **Set Firestore Rules:**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       match /signals/{signalId} {
         allow read: if request.auth != null;
       }
     }
   }
   ```

### 2. Stripe Setup (REQUIRED FOR PAYMENTS)

1. **Create Stripe Account:**
   - Go to [Stripe Dashboard](https://dashboard.stripe.com/)
   - Sign up for free account
   - Complete account verification

2. **Get API Keys:**
   - Go to Developers → API keys
   - Copy "Publishable key" and "Secret key"
   - Keep these secure!

3. **Create Products:**
   - Go to Products → Add product
   - Create "Pro Plan":
     - Name: Pro Plan
     - Price: $19.00/month
     - Billing: Recurring
   - Create "Elite Plan":
     - Name: Elite Plan
     - Price: $49.00/month
     - Billing: Recurring

4. **Set Up Webhook:**
   - Go to Developers → Webhooks
   - Click "Add endpoint"
   - URL: `https://your-domain.vercel.app/api/webhooks/stripe`
   - Events to send:
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`
   - Copy the webhook signing secret

### 3. Polygon.io Setup (OPTIONAL)

1. **Sign Up:**
   - Go to [Polygon.io](https://polygon.io/)
   - Create free account
   - Get API key

## ⚙️ Environment Variables Setup

### In Vercel Dashboard:

1. **Go to your project in Vercel**
2. **Settings → Environment Variables**
3. **Add these variables:**

```env
# Firebase (REQUIRED)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Stripe (REQUIRED FOR PAYMENTS)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Application
NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app

# Optional: Market Data
POLYGON_API_KEY=your_polygon_api_key
```

### Environment Variable Details:

- **Production:** Add to "Production" environment
- **Preview:** Add to "Preview" environment (for testing)
- **Development:** Add to "Development" environment

## 🚀 Deploy Steps

### Step 1: Prepare Your Code

1. **Clone/Download the project**
2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Test locally:**
   ```bash
   npm run dev
   ```

### Step 2: Deploy to Vercel

1. **Deploy:**
   ```bash
   vercel --prod
   ```

2. **Get your domain** (e.g., `https://trading-signals-pro.vercel.app`)

### Step 3: Configure Webhooks

1. **Update Stripe webhook URL:**
   - Go to Stripe Dashboard → Developers → Webhooks
   - Update endpoint URL to your Vercel domain
   - URL: `https://your-domain.vercel.app/api/webhooks/stripe`

2. **Update environment variable:**
   - In Vercel: Settings → Environment Variables
   - Update `NEXT_PUBLIC_BASE_URL` to your domain

### Step 4: Test Your Deployment

1. **Visit your domain**
2. **Test signup/login**
3. **Test subscription flow**
4. **Check webhook events in Stripe dashboard**

## 🔧 Troubleshooting

### Common Issues:

1. **Build fails:**
   - Check environment variables are set
   - Ensure all dependencies are in package.json

2. **Authentication not working:**
   - Verify Firebase config
   - Check Firestore rules

3. **Payments not working:**
   - Verify Stripe keys
   - Check webhook URL
   - Test with Stripe test cards

4. **API errors:**
   - Check browser console
   - Verify API routes are working

### Support:

- **Vercel Docs:** [vercel.com/docs](https://vercel.com/docs)
- **Firebase Docs:** [firebase.google.com/docs](https://firebase.google.com/docs)
- **Stripe Docs:** [stripe.com/docs](https://stripe.com/docs)

## 🎉 Success!

Your trading signals platform is now live at:
`https://your-domain.vercel.app`

### Next Steps:

1. **Customize branding** (logo, colors, text)
2. **Set up analytics** (Google Analytics, Vercel Analytics)
3. **Configure email notifications**
4. **Set up Discord/Telegram integration**
5. **Start marketing your platform!**

### Revenue Generation:

- **Free tier:** Lead generation
- **Pro tier ($19/mo):** Main revenue stream
- **Elite tier ($49/mo):** Premium features

**Estimated monthly revenue potential:**
- 100 Pro users = $1,900/month
- 50 Elite users = $2,450/month
- **Total: $4,350/month**

Happy trading! 🚀