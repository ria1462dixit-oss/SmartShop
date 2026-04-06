const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || ''
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
const GOOGLE_REDIRECT_URI =
  import.meta.env.VITE_GOOGLE_REDIRECT_URI || `${window.location.origin}/auth/google/callback`
const GOOGLE_SCOPE = import.meta.env.VITE_GOOGLE_SCOPE || 'openid email profile'

function ensureApiBaseUrl() {
  if (!API_BASE_URL) {
    throw new Error('Set VITE_API_BASE_URL to enable OTP and Google sign-in.')
  }
}

async function postJson(path, payload) {
  ensureApiBaseUrl()

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || 'Request failed. Please try again.')
  }

  return data
}

export async function requestEmailOtp(email) {
  return postJson('/auth/email/request-otp', { email })
}

export async function verifyEmailOtp({ email, otp, mode }) {
  return postJson('/auth/email/verify-otp', { email, otp, mode })
}

export function beginGoogleOAuth() {
  if (!GOOGLE_CLIENT_ID) {
    throw new Error('Set VITE_GOOGLE_CLIENT_ID to enable Google OAuth.')
  }

  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: GOOGLE_REDIRECT_URI,
    response_type: 'code',
    scope: GOOGLE_SCOPE,
    access_type: 'offline',
    prompt: 'consent',
  })

  window.location.assign(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`)
}

export async function exchangeGoogleCode(code) {
  return postJson('/auth/google/exchange', {
    code,
    redirectUri: GOOGLE_REDIRECT_URI,
  })
}

export function persistSession(payload) {
  if (payload) {
    window.localStorage.setItem('smartshop.session', JSON.stringify(payload))
  }
}

export function readSession() {
  try {
    const raw = window.localStorage.getItem('smartshop.session')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function clearSession() {
  window.localStorage.removeItem('smartshop.session')
}
