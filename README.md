# 🚀 TradingSignals Pro - AI-Powered Trading Platform

A comprehensive web application that provides AI-powered trading signals with subscription-based access control, real-time charts, and advanced analytics.

## ✨ Features

### 🎯 Core Features
- **AI-Powered Trading Signals** - Advanced prediction engine with 78% accuracy
- **Interactive Charts** - Professional-grade charts with technical indicators
- **Real-time Alerts** - Instant notifications for new signals and entry points
- **Risk Management** - Built-in stop-loss and take-profit levels
- **Multi-timeframe Analysis** - 15M, 1H, 4H, 1D timeframes

### 👥 User Management
- **Role-based Access Control** - Free, Pro, and Elite tiers
- **Firebase Authentication** - Secure user registration and login
- **Subscription Management** - Stripe-powered billing system
- **Usage Tracking** - Monitor prediction usage and limits

### 📊 Dashboard Features
- **Live Trading Signals** - Real-time buy/sell recommendations
- **Performance Metrics** - Success rate and profit tracking
- **User Statistics** - Usage analytics and account overview
- **Responsive Design** - Mobile-friendly interface

### 💳 Subscription Tiers

| Feature | Free | Pro ($19/mo) | Elite ($49/mo) |
|---------|------|--------------|----------------|
| Daily Predictions | 2 | Unlimited | Unlimited |
| Currency Pairs | 5 | 25+ | 25+ |
| Real-time Alerts | ❌ | ✅ | ✅ |
| Advanced Charts | ❌ | ✅ | ✅ |
| Risk Management | ❌ | ✅ | ✅ |
| Discord Access | ❌ | ✅ | ✅ |
| Priority Support | ❌ | ❌ | ✅ |
| Custom Filters | ❌ | ❌ | ✅ |
| Weekly Strategy Calls | ❌ | ❌ | ✅ |

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Lightweight Charts** - Professional trading charts
- **React Hot Toast** - User notifications

### Backend & Services
- **Firebase** - Authentication and Firestore database
- **Stripe** - Payment processing and subscriptions
- **Vercel** - Deployment and hosting
- **Polygon.io** - Market data API (optional)

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase project
- Stripe account

### 1. Clone the Repository
```bash
git clone <repository-url>
cd trading-signals-app
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Setup
```bash
cp .env.local.example .env.local
```

Fill in your environment variables:
```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Application Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 4. Firebase Setup
1. Create a new Firebase project
2. Enable Authentication (Email/Password)
3. Create Firestore database
4. Set up security rules
5. Add your Firebase config to `.env.local`

### 5. Stripe Setup
1. Create a Stripe account
2. Get your API keys from the dashboard
3. Create products and prices for Pro ($19) and Elite ($49) plans
4. Set up webhook endpoint: `https://your-domain.com/api/webhooks/stripe`
5. Add webhook events: `customer.subscription.*`, `invoice.payment_*`

### 6. Run Development Server
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard page
│   ├── login/            # Login page
│   ├── signup/           # Signup page
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Landing page
├── components/           # React components
│   ├── providers/        # Context providers
│   ├── ChartComponent.tsx
│   ├── PricingCard.tsx
│   ├── TradingSignalCard.tsx
│   └── ...
├── lib/                  # Utility libraries
│   └── firebase.ts       # Firebase configuration
├── public/              # Static assets
└── package.json         # Dependencies and scripts
```

## 🔧 Configuration

### Firebase Security Rules
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

### Stripe Webhook Events
Configure these events in your Stripe webhook:
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

## 🚀 Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production
```env
NEXT_PUBLIC_BASE_URL=https://your-domain.com
STRIPE_WEBHOOK_SECRET=whsec_production_webhook_secret
```

## 🔒 Security Features

- **Firebase Authentication** - Secure user management
- **Role-based Access Control** - Feature gating by subscription
- **Stripe Webhook Verification** - Secure payment processing
- **Input Validation** - Form validation and sanitization
- **CORS Protection** - API route protection

## 📈 Performance Optimizations

- **Next.js App Router** - Server-side rendering and optimization
- **Image Optimization** - Automatic image optimization
- **Code Splitting** - Automatic bundle splitting
- **Caching** - Static generation and caching
- **CDN** - Global content delivery

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@tradingsignalspro.com or join our Discord community.

## 🔮 Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced AI models
- [ ] Social trading features
- [ ] Portfolio tracking
- [ ] Educational content
- [ ] API for third-party integrations

---

**Built with ❤️ by the TradingSignals Pro team**









   
