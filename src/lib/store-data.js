const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || ''

function ensureApiBaseUrl() {
  if (!API_BASE_URL) {
    throw new Error('Set VITE_API_BASE_URL to save shopper data to the backend.')
  }
}

async function requestStoreState(session, options = {}) {
  ensureApiBaseUrl()

  if (!session?.token) {
    throw new Error('Login is required.')
  }

  const response = await fetch(`${API_BASE_URL}/store/state`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.token}`,
      ...(options.headers || {}),
    },
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || 'Could not sync shopper data.')
  }

  return data
}

export function loadStoreState(session) {
  return requestStoreState(session)
}

export function saveStoreState(session, state) {
  return requestStoreState(session, {
    method: 'PUT',
    body: JSON.stringify({
      cartItems: state.cartItems || [],
      orders: state.orders || [],
      wishlistItems: state.wishlistItems || [],
    }),
  })
}

export async function loadAdminStoreState(session) {
  ensureApiBaseUrl()

  if (!session?.token) {
    throw new Error('Login is required.')
  }

  const response = await fetch(`${API_BASE_URL}/admin/store-state`, {
    headers: {
      Authorization: `Bearer ${session.token}`,
    },
  })
  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || 'Could not load admin shopper data.')
  }

  return data
}
