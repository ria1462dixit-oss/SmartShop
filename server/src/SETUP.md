# SmartShop — Production Fix Guide

## What was broken & what was fixed

| # | File | Problem | Fix |
|---|------|---------|-----|
| 1 | `server/src/stripe.js` | `apiVersion: '2026-02-25.clover'` is invalid | Changed to `'2024-06-20'` |
| 2 | `server/.env` | `JWT_SECRET=JWT_SECRET=...` had duplicate prefix | Removed the duplicate |
| 3 | `server/src/email.js` | SMTP vars were commented out in old `.env` | Uncommented; add Gmail App Password (see below) |
| 4 | `frontend/.env.local` | `VITE_API_BASE_URL` pointed to `localhost:4000` | Changed to `https://smartshop-6cz4.onrender.com` |
| 5 | `frontend/.env.local` | `VITE_GOOGLE_REDIRECT_URI` pointed to `localhost:5173` | Changed to your Vercel URL |
| 6 | Google Cloud Console | Redirect URI was for localhost only | Must add the Vercel redirect URI (see below) |

---

## Step 1 — Update Render environment variables

Go to your Render dashboard → smartshop-6cz4 → Environment.

Add / update these variables:

| Key | Value |
|-----|-------|
| `CLIENT_ORIGIN` | `https://smart-shop-phi-roan.vercel.app` |
| `JWT_SECRET` | `smartshop2024xyzSecretKey!@123456` |
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `587` |
| `SMTP_SECURE` | `false` |
| `SMTP_USER` | your Gmail address |
| `SMTP_PASS` | your Gmail App Password (16 chars, no spaces) |
| `SMTP_FROM` | `SmartShop <your-gmail@gmail.com>` |

The other keys (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `MONGODB_URI`, `STRIPE_SECRET_KEY`) are already set correctly in your screenshot.

---

## Step 2 — Get a Gmail App Password (for OTP email)

1. Go to myaccount.google.com
2. Security → 2-Step Verification (must be ON)
3. Security → App Passwords
4. Name it "SmartShop", click Create
5. Copy the 16-character password — paste it as `SMTP_PASS` in Render

---

## Step 3 — Fix Google Cloud Console (for Google Auth)

1. Go to console.cloud.google.com → APIs & Services → Credentials
2. Click your OAuth 2.0 Client ID
3. Under **Authorized redirect URIs**, add:
   ```
   https://smart-shop-phi-roan.vercel.app/auth/google/callback
   ```
   (Keep the localhost one too if you still develop locally)
4. Click Save — changes take ~5 minutes to propagate

---

## Step 4 — Update frontend environment on Vercel

Go to your Vercel project → Settings → Environment Variables.

Add / update:

| Key | Value |
|-----|-------|
| `VITE_API_BASE_URL` | `https://smartshop-6cz4.onrender.com` |
| `VITE_GOOGLE_CLIENT_ID` | `3311802196259-2gmjoqpv34ck783n276a215ik43b7tvl.apps.googleusercontent.com` |
| `VITE_GOOGLE_REDIRECT_URI` | `https://smart-shop-phi-roan.vercel.app/auth/google/callback` |
| `VITE_GOOGLE_SCOPE` | `openid email profile` |

Then **redeploy** the frontend (Vercel → Deployments → Redeploy).

---

## Step 5 — Replace files & redeploy backend

Replace these files in your repo:

```
server/src/stripe.js       ← fixed apiVersion
server/src/email.js        ← cleaner SMTP setup
server/src/auth-service.js ← Google redirect URI uses env
server/src/index.js        ← added error logging
```

Push to GitHub → Render will auto-deploy.

---

## Verify everything works

1. **Health check**: Visit `https://smartshop-6cz4.onrender.com/health` — should return `{ ok: true }`
2. **OTP email**: Try signing in with email — OTP should arrive in your inbox within seconds
3. **Google Auth**: Click "Sign in with Google" — should redirect back and log you in
4. **Stripe**: Add item to cart → checkout → should redirect to Stripe payment page
