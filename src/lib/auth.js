const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || ''
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
const GOOGLE_REDIRECT_URI =
  import.meta.env.VITE_GOOGLE_REDIRECT_URI || `${window.location.origin}/auth/google/callback`
const GOOGLE_SCOPE = import.meta.env.VITE_GOOGLE_SCOPE || 'openid email profile'
const ADMIN_EMAILS = ['admin@smartshop.com', 'ria1462.dixit@gmail.com']
export const TEST_ACCOUNTS = {
  admin: {
    token: 'smartshop-test-admin-token',
    user: {
      id: 'admin-test-user',
      name: 'Riya Admin',
      email: 'ria1462.dixit@gmail.com',
      avatarUrl: '',
    },
  },
  shopper: {
    token: 'smartshop-test-shopper-token',
    user: {
      id: 'shopper-test-user',
      name: 'Aarav Shopper',
      email: 'aarav.shopper@smartshop.com',
      avatarUrl: '',
    },
  },
}

function ensureApiBaseUrl() {
  if (!API_BASE_URL) {
    throw new Error('Set VITE_API_BASE_URL to enable OTP and Google sign-in.')
  }
}

function validateSessionPayload(data) {
  if (!data?.token || !data?.user?.email) {
    throw new Error('Backend auth response is missing token or user.email.')
  }

  return data
}

async function postJson(path, payload) {
  ensureApiBaseUrl()

  let response

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch {
    throw new Error('Cannot reach the auth server. Check VITE_API_BASE_URL and start your backend first.')
  }

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
  const data = await postJson('/auth/email/verify-otp', { email, otp, mode })
  return validateSessionPayload(data)
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
  const data = await postJson('/auth/google/exchange', {
    code,
    redirectUri: GOOGLE_REDIRECT_URI,
  })
  return validateSessionPayload(data)
}

export function persistSession(payload) {
  if (!payload) return
  const safePayload = validateSessionPayload(payload)
  window.localStorage.setItem('smartshop.session', JSON.stringify(safePayload))
  window.dispatchEvent(new Event('smartshop-session-change'))
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
  window.dispatchEvent(new Event('smartshop-session-change'))
}

export function isAdminSession(session) {
  const email = session?.user?.email || session?.email || ''
  return ADMIN_EMAILS.includes(String(email).trim().toLowerCase())
}

export function createTestSession(type = 'shopper') {
  const payload = TEST_ACCOUNTS[type] || TEST_ACCOUNTS.shopper
  persistSession(payload)
  return payload
}
