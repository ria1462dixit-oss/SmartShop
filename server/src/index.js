import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import jwt from 'jsonwebtoken'
import { exchangeGoogleCode, requestEmailOtp, verifyEmailOtp } from './auth-service.js'
import { connectDatabase, StoreState } from './db.js'
import { createMailer } from './email.js'
import { createCheckoutSession } from './stripe.js'

dotenv.config()

const app = express()
const PORT = Number(process.env.PORT || 4000)
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173'
const transporter = createMailer(process.env)
const ADMIN_EMAILS = ['admin@smartshop.com', 'ria1462.dixit@gmail.com']

app.use(
  cors({
  origin: [
      'http://localhost:5173',
      'https://smart-shop-phi-roan.vercel.app',
    ],
     credentials: true,
  })
)
app.use(express.json())

function requireAuth(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : ''

  if (!token) {
    return res.status(401).json({ message: 'Login is required.' })
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.user = {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
    }
    next()
  } catch {
    res.status(401).json({ message: 'Session expired. Please login again.' })
  }
}

function requireAdmin(req, res, next) {
  if (!ADMIN_EMAILS.includes(String(req.user?.email || '').trim().toLowerCase())) {
    return res.status(403).json({ message: 'Admin access is required.' })
  }

  next()
}

app.get('/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'smartshop-auth-server',
    clientOrigin: CLIENT_ORIGIN,
  })
})

app.post('/auth/email/request-otp', async (req, res) => {
  try {
    const result = await requestEmailOtp({
      email: req.body?.email,
      transporter,
      env: process.env,
    })
    res.json(result)
  } catch (error) {
    res.status(400).json({ message: error.message || 'Could not request OTP.' })
  }
})

app.post('/auth/email/verify-otp', async (req, res) => {
  try {
    const result = await verifyEmailOtp({
      email: req.body?.email,
      otp: req.body?.otp,
      mode: req.body?.mode,
      jwtSecret: process.env.JWT_SECRET,
    })
    res.json(result)
  } catch (error) {
    res.status(400).json({ message: error.message || 'Could not verify OTP.' })
  }
})

app.post('/auth/google/exchange', async (req, res) => {
  try {
    const result = await exchangeGoogleCode({
      code: req.body?.code,
      redirectUri: req.body?.redirectUri,
      env: process.env,
      jwtSecret: process.env.JWT_SECRET,
    })
    res.json(result)
  } catch (error) {
    console.error('[/auth/google/exchange]', error.message)
    res.status(400).json({ message: error.message || 'Google sign-in failed.' })
  }
})

app.post('/payments/checkout-session', requireAuth, async (req, res) => {
  try {
    const result = await createCheckoutSession({
      env: process.env,
      items: req.body?.items || [],
      successUrl: req.body?.successUrl || `${CLIENT_ORIGIN}/order/confirmed`,
      cancelUrl: req.body?.cancelUrl || `${CLIENT_ORIGIN}/bag`,
      customerEmail: req.body?.customerEmail,
    })
    res.json(result)
  } catch (error) {
    console.error('[/payments/checkout-session]', error.message)
    res.status(400).json({ message: error.message || 'Unable to create Stripe session.' })
  }
})

app.get('/store/state', requireAuth, async (req, res) => {
  const state = await StoreState.findOne({ userId: req.user.id }).lean()

  res.json({
    cartItems: state?.cartItems || [],
    orders: state?.orders || [],
    wishlistItems: state?.wishlistItems || [],
  })
})

app.put('/store/state', requireAuth, async (req, res) => {
  const state = await StoreState.findOneAndUpdate(
    { userId: req.user.id },
    {
      $set: {
        cartItems: Array.isArray(req.body?.cartItems) ? req.body.cartItems : [],
        orders: Array.isArray(req.body?.orders) ? req.body.orders : [],
        wishlistItems: Array.isArray(req.body?.wishlistItems) ? req.body.wishlistItems : [],
      },
    },
    { new: true, upsert: true }
  ).lean()

  res.json({
    cartItems: state.cartItems || [],
    orders: state.orders || [],
    wishlistItems: state.wishlistItems || [],
  })
})

app.get('/admin/store-state', requireAuth, requireAdmin, async (_req, res) => {
  const states = await StoreState.find({}).lean()

  res.json({
    cartItems: states.flatMap((state) => state.cartItems || []),
    orders: states.flatMap((state) => state.orders || []),
    wishlistItems: states.flatMap((state) => state.wishlistItems || []),
  })
})

async function start() {
  await connectDatabase(process.env.MONGODB_URI)
  app.listen(PORT, () => {
    console.log(`SmartShop auth server running on http://localhost:${PORT}`)
    console.log(`Accepting requests from: ${CLIENT_ORIGIN}`)
  })
}

start().catch((error) => {
  console.error('Failed to start auth server:', error)
  process.exit(1)
})
