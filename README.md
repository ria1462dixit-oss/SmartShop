# SmartShop

SmartShop is a React + Vite e-commerce frontend with category exploration, product browsing, wishlist, cart, checkout, order tracking, and sign-in flows.

## Features

- landing page with carousel and featured products
- rotating category wheel and category collection pages
- product detail pages with size and color selection
- wishlist and cart flows
- checkout, confirmation, and order tracking
- Google OAuth and email OTP frontend hooks

## Run locally

```bash
npm install
npm run dev
```

## Auth setup

Copy `.env.example` to `.env` and fill in your backend/API values.

The frontend expects:

- `POST /auth/email/request-otp`
- `POST /auth/email/verify-otp`
- `POST /auth/google/exchange`
- `POST /payments/checkout-session`

Detailed request/response shapes are documented in [AUTH_BACKEND_CONTRACT.md](C:/Users/admin/Desktop/SmartShop/SmartShopFrontend/AUTH_BACKEND_CONTRACT.md).

## Local auth server

A MongoDB auth server scaffold now lives in `server/`.

1. Start MongoDB locally.
2. Install the backend dependencies:
   `cd server && npm install`
3. Start the backend:
   `npm run dev`
4. Set `VITE_API_BASE_URL` in `.env` (example in `.env.example`).

Notes:
- OTP email sending works only after SMTP values are filled in `server/.env`.
- Until SMTP is configured, the backend returns `devOtp` for local testing.
- Google OAuth requires both frontend and server Google client values to be filled.

## Build

```bash
npm run build
```
