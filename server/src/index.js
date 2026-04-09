import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { exchangeGoogleCode, requestEmailOtp, verifyEmailOtp } from './auth-service.js'
import { connectDatabase } from './db.js'
import { createMailer } from './email.js'
import { createCheckoutSession } from './stripe.js'

dotenv.config()

const app = express()
const PORT = Number(process.env.PORT || 4000)
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173'
const transporter = createMailer(process.env)

app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
  })
)
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'smartshop-auth-server',
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
    res.status(400).json({ message: error.message || 'Google sign-in failed.' })
  }
})

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
    res.status(400).json({ message: error.message || 'Unable to create Stripe session.' })
  }
})

async function start() {
  await connectDatabase(process.env.MONGODB_URI)
  app.listen(PORT, () => {
    console.log(`SmartShop auth server running on http://localhost:${PORT}`)
  })
}

start().catch((error) => {
  console.error('Failed to start auth server:', error)
  process.exit(1)
})
