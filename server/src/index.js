
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import jwt from 'jsonwebtoken'
import { exchangeGoogleCode, requestEmailOtp, verifyEmailOtp } from './auth-service.js'
import { connectDatabase, User } from './db.js'
import { createMailer } from './email.js'
import { createCheckoutSession } from './stripe.js'

dotenv.config()

const app = express()
const PORT = Number(process.env.PORT || 4000)
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173'
const transporter = createMailer(process.env)

app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }))
app.use(express.json())

//  Auth middleware 

function verifyToken(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return res.status(401).json({ message: 'Authentication required.' })

  try {
    req.jwtPayload = jwt.verify(token, process.env.JWT_SECRET)
    return next()
  } catch {
    return res.status(401).json({ message: 'Session expired. Please sign in again.' })
  }
}

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || 'ria1462.dixit@gmail.com,admin@smartshop.com')
  .split(',')
  .map((e) => e.trim().toLowerCase())

function requireAdmin(req, res, next) {
  const email = String(req.jwtPayload?.email || '').toLowerCase()
  if (!ADMIN_EMAILS.includes(email)) return res.status(403).json({ message: 'Admin access required.' })
  return next()
}

//Health

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'smartshop-auth-server', clientOrigin: CLIENT_ORIGIN })
})

// Auth routes

app.post('/auth/email/request-otp', async (req, res) => {
  try {
    const result = await requestEmailOtp({ email: req.body?.email, transporter, env: process.env })
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

//  Store state (per-user cart / orders / wishlist)

app.get('/store/state', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.jwtPayload.sub).lean()
    if (!user) return res.status(404).json({ message: 'User not found.' })
    const state = user.storeState || {}
    return res.json({
      cartItems: Array.isArray(state.cartItems) ? state.cartItems : [],
      orders: Array.isArray(state.orders) ? state.orders : [],
      wishlistItems: Array.isArray(state.wishlistItems) ? state.wishlistItems : [],
    })
  } catch (error) {
    console.error('[GET /store/state]', error.message)
    res.status(500).json({ message: 'Could not load store state.' })
  }
})

app.put('/store/state', verifyToken, async (req, res) => {
  try {
    const { cartItems = [], orders = [], wishlistItems = [] } = req.body || {}
    await User.findByIdAndUpdate(req.jwtPayload.sub, {
      $set: {
        'storeState.cartItems': Array.isArray(cartItems) ? cartItems : [],
        'storeState.orders': Array.isArray(orders) ? orders : [],
        'storeState.wishlistItems': Array.isArray(wishlistItems) ? wishlistItems : [],
        'storeState.updatedAt': new Date(),
      },
    })
    return res.json({ ok: true })
  } catch (error) {
    console.error('[PUT /store/state]', error.message)
    res.status(500).json({ message: 'Could not save store state.' })
  }
})

//Admin store state

app.get('/admin/store-state', verifyToken, requireAdmin, async (req, res) => {
  try {
    const users = await User.find({ 'storeState.orders.0': { $exists: true } })
      .select('email storeState')
      .lean()

    const allOrders = []
    const allCartItems = []
    const allWishlistItems = []
    const seenOrderIds = new Set()
    const seenWishlistIds = new Set()

    for (const user of users) {
      const state = user.storeState || {}
      ;(state.orders || []).forEach((order) => {
        if (order?.id && !seenOrderIds.has(order.id)) {
          seenOrderIds.add(order.id)
          allOrders.push({ ...order, _userEmail: user.email })
        }
      })
      ;(state.cartItems || []).forEach((item) => { if (item?.id) allCartItems.push(item) })
      ;(state.wishlistItems || []).forEach((item) => {
        if (item?.id && !seenWishlistIds.has(item.id)) {
          seenWishlistIds.add(item.id)
          allWishlistItems.push(item)
        }
      })
    }

    allOrders.sort((a, b) => new Date(b.placedAt || 0) - new Date(a.placedAt || 0))
    return res.json({ cartItems: allCartItems, orders: allOrders, wishlistItems: allWishlistItems })
  } catch (error) {
    console.error('[GET /admin/store-state]', error.message)
    res.status(500).json({ message: 'Could not load admin store state.' })
  }
})

// Payments

app.post('/payments/checkout-session', async (req, res) => {
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

//Start

async function start() {
  await connectDatabase(process.env.MONGODB_URI)
  app.listen(PORT, () => {
    console.log(`SmartShop auth server running on http://localhost:${PORT}`)
    console.log(`Accepting requests from: ${CLIENT_ORIGIN}`)
    console.log(`Admin emails: ${ADMIN_EMAILS.join(', ')}`)
  })
}

start().catch((error) => {
  console.error('Failed to start auth server:', error)
  process.exit(1)
})
