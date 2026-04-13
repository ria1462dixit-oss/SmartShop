# SmartShop — Setup Guide

## 1. Fill in your keys

### server/.env
| Key | Where to get it |
|-----|----------------|
| `MONGODB_URI` | MongoDB Atlas → Connect → Drivers |
| `JWT_SECRET` | Any random 32+ char string |
| `GOOGLE_CLIENT_ID` | console.cloud.google.com → APIs → Credentials |
| `GOOGLE_CLIENT_SECRET` | Same as above |
| `STRIPE_SECRET_KEY` | dashboard.stripe.com → Developers → API keys |

### .env.local (frontend root)
| Key | Value |
|-----|-------|
| `VITE_API_BASE_URL` | `http://localhost:4000` |
| `VITE_GOOGLE_CLIENT_ID` | Same as server `GOOGLE_CLIENT_ID` |
| `VITE_GOOGLE_REDIRECT_URI` | `http://localhost:5173/auth/google/callback` |

## 2. Google Cloud Console
1. Go to console.cloud.google.com → APIs & Services → Credentials
2. Create OAuth 2.0 Client ID (Web application)
3. Add Authorized redirect URI: `http://localhost:5173/auth/google/callback`
4. Copy Client ID and Secret into both `.env` files above

## 3. Install & run

```bash
# Terminal 1 — backend
cd server
npm install
npm run dev

# Terminal 2 — frontend
cd ..
npm install
npm run dev
```

## 4. What each backend route does

| Route | Purpose |
|-------|---------|
| `POST /auth/email/request-otp` | Generates OTP, stores in MongoDB, emails it |
| `POST /auth/email/verify-otp` | Validates OTP, creates/finds user, returns JWT |
| `POST /auth/google/exchange` | Exchanges Google code for profile, creates/finds user, returns JWT |
| `POST /payments/checkout-session` | Creates Stripe Checkout session, returns redirect URL |

## 5. Email OTP without SMTP

If you don't set SMTP vars, the OTP is returned in the API response as `devOtp` and shown on the login screen — perfect for local testing.

## 6. Files changed from original
- `server/src/stripe.js` — fixed Stripe apiVersion from `2026-02-25.clover` → `2024-06-20`
- `server/.env` — created (was missing)
- `.env.local` — created (was missing)
