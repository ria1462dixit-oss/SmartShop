# SmartShop Auth Backend Contract

This frontend already expects the backend routes below.

## Frontend env

Create `C:\Users\admin\Desktop\SmartShop\SmartShopFrontend\.env` with:

```env
VITE_API_BASE_URL=http://localhost:4000
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_GOOGLE_REDIRECT_URI=http://localhost:5173/auth/google/callback
VITE_GOOGLE_SCOPE=openid email profile
```

## Required backend routes

### 1. Request OTP

`POST /auth/email/request-otp`

Request:

```json
{
  "email": "user@example.com"
}
```

Success response:

```json
{
  "ok": true,
  "message": "OTP sent successfully."
}
```

Optional local-dev response:

```json
{
  "ok": true,
  "message": "OTP generated in local mode.",
  "devOtp": "123456"
}
```

Error response:

```json
{
  "message": "Enter a valid email address."
}
```

### 2. Verify OTP

`POST /auth/email/verify-otp`

Request:

```json
{
  "email": "user@example.com",
  "otp": "123456",
  "mode": "login"
}
```

`mode` can be:
- `login`
- `signup`

Success response:

```json
{
  "token": "jwt-or-session-token",
  "user": {
    "id": "user-id",
    "name": "Riya Singh",
    "email": "user@example.com",
    "avatarUrl": "https://...",
    "provider": "email"
  }
}
```

### 3. Exchange Google code

`POST /auth/google/exchange`

Request:

```json
{
  "code": "google-authorization-code",
  "redirectUri": "http://localhost:5173/auth/google/callback"
}
```

Success response:

```json
{
  "token": "jwt-or-session-token",
  "user": {
    "id": "user-id",
    "name": "Riya Singh",
    "email": "user@example.com",
    "avatarUrl": "https://...",
    "provider": "google"
  }
}
```

## Google Console settings

Your Google OAuth client must allow this exact redirect URI:

```text
http://localhost:5173/auth/google/callback
```

## What the frontend stores

After a successful backend response, the frontend stores this payload in:

```text
localStorage["smartshop.session"]
```

Minimum required structure:

```json
{
  "token": "jwt-or-session-token",
  "user": {
    "id": "user-id",
    "name": "User Name",
    "email": "user@example.com"
  }
}
```

## Stripe checkout session

`POST /payments/checkout-session`

Request:

```json
{
  "items": [
    {
      "name": "Product name",
      "title": "Optional subtitle",
      "amount": 1899,
      "quantity": 1,
      "image": "https://..."
    }
  ],
  "customerEmail": "name@example.com",
  "successUrl": "https://your-site.com/order/confirmed",
  "cancelUrl": "https://your-site.com/bag"
}
```

Success response:

```json
{
  "id": "cs_test_...",
  "url": "https://checkout.stripe.com/..."
}
```
