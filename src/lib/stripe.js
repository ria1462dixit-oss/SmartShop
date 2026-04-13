import { readSession } from './auth'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || ''

function ensureApiBaseUrl() {
  if (!API_BASE_URL) {
    throw new Error('Set VITE_API_BASE_URL to enable Stripe payments.')
  }
}

export async function createStripeCheckoutSession(payload) {
  ensureApiBaseUrl()
  const session = readSession()

  const response = await fetch(`${API_BASE_URL}/payments/checkout-session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(session?.token ? { Authorization: `Bearer ${session.token}` } : {}),
    },
    body: JSON.stringify(payload),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || 'Stripe checkout failed.')
  }

  if (!data?.url) {
    throw new Error('Stripe checkout URL missing.')
  }

  return data
}
