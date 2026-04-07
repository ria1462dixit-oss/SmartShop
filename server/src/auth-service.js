import crypto from 'node:crypto'
import jwt from 'jsonwebtoken'
import { OtpCode, User } from './db.js'
import { sendOtpEmail } from './email.js'

function createOtpCode() {
  return String(crypto.randomInt(100000, 999999))
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase()
}

function isValidEmail(email) {
  return /\S+@\S+\.\S+/.test(email)
}

function buildSessionPayload(user, jwtSecret) {
  if (!jwtSecret) {
    throw new Error('Set JWT_SECRET in server/.env before verifying auth.')
  }

  const token = jwt.sign(
    {
      sub: user._id.toString(),
      email: user.email,
      name: user.name,
    },
    jwtSecret,
    { expiresIn: '7d' }
  )

  return {
    token,
    user: {
      id: user._id.toString(),
      name: user.name || user.email.split('@')[0],
      email: user.email,
      avatarUrl: user.avatarUrl || '',
    },
  }
}

export async function requestEmailOtp({ email, transporter, env }) {
  const normalizedEmail = normalizeEmail(email)

  if (!isValidEmail(normalizedEmail)) {
    throw new Error('Enter a valid email address before requesting an OTP.')
  }

  await OtpCode.updateMany({ email: normalizedEmail, used: false }, { $set: { used: true } })

  const code = createOtpCode()
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

  await OtpCode.create({
    email: normalizedEmail,
    code,
    expiresAt,
  })

  const mailResult = await sendOtpEmail({
    transporter,
    env,
    email: normalizedEmail,
    code,
  })

  return {
    success: true,
    message: mailResult.delivered
      ? `OTP sent to ${normalizedEmail}.`
      : `SMTP not configured. Using local development OTP for ${normalizedEmail}.`,
    ...(mailResult.delivered ? {} : { devOtp: code }),
  }
}

export async function verifyEmailOtp({ email, otp, mode, jwtSecret }) {
  const normalizedEmail = normalizeEmail(email)

  if (!isValidEmail(normalizedEmail)) {
    throw new Error('Enter a valid email address before entering OTP.')
  }

  if (!String(otp || '').trim()) {
    throw new Error('Enter the OTP you received.')
  }

  const otpRecord = await OtpCode.findOne({
    email: normalizedEmail,
    code: String(otp).trim(),
    used: false,
    expiresAt: { $gt: new Date() },
  }).sort({ createdAt: -1 })

  if (!otpRecord) {
    throw new Error('Invalid or expired OTP. Please request a new code.')
  }

  otpRecord.used = true
  await otpRecord.save()

  let user = await User.findOne({ email: normalizedEmail })

  if (!user) {
    user = await User.create({
      email: normalizedEmail,
      name: mode === 'signup' ? normalizedEmail.split('@')[0] : normalizedEmail.split('@')[0],
      provider: 'email-otp',
    })
  }

  return buildSessionPayload(user, jwtSecret)
}

async function exchangeCodeForGoogleTokens({ code, redirectUri, env }) {
  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) {
    throw new Error('Google auth is not configured on the server.')
  }

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.error_description || 'Google code exchange failed.')
  }

  return data
}

async function fetchGoogleProfile(accessToken) {
  const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok || !data.email) {
    throw new Error('Could not read your Google profile.')
  }

  return data
}

export async function exchangeGoogleCode({ code, redirectUri, env, jwtSecret }) {
  if (!code) {
    throw new Error('Missing Google authorization code.')
  }

  const tokenData = await exchangeCodeForGoogleTokens({ code, redirectUri, env })
  const profile = await fetchGoogleProfile(tokenData.access_token)

  let user = await User.findOne({ email: normalizeEmail(profile.email) })

  if (!user) {
    user = await User.create({
      email: normalizeEmail(profile.email),
      name: profile.name || profile.email.split('@')[0],
      avatarUrl: profile.picture || '',
      provider: 'google',
      googleId: profile.id || '',
    })
  } else {
    user.name = profile.name || user.name
    user.avatarUrl = profile.picture || user.avatarUrl
    user.provider = 'google'
    user.googleId = profile.id || user.googleId
    await user.save()
  }

  return buildSessionPayload(user, jwtSecret)
}
