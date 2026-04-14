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

  if (API_BASE_URL && session?.token) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/store-state`, {
        headers: { Authorization: `Bearer ${session.token}` },
      })

      if (response.ok) {
        const data = await response.json().catch(() => null)
        if (data && (Array.isArray(data.orders) || Array.isArray(data.cartItems))) {
          return {
            cartItems: Array.isArray(data.cartItems) ? data.cartItems : [],
            orders: Array.isArray(data.orders) ? data.orders : [],
            wishlistItems: Array.isArray(data.wishlistItems) ? data.wishlistItems : [],
          }
        }
      }
    } catch { 
      // Backend not reachable here
    }
  }
  // data from every user who has shopped on this device/browser.
  const allOrders = []
  const allCartItems = []
  const allWishlistItems = []
  const seenOrderIds = new Set()
  const seenCartKeys = new Set()
  const seenWishlistIds = new Set()

  try {
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i)
      if (!key) continue

      let parsed
      try {
        parsed = JSON.parse(window.localStorage.getItem(key) || 'null')
      } catch {
        continue
      }

      if (!Array.isArray(parsed)) continue

      if (key.startsWith('smartshop-orders:') && !key.endsWith(':guest')) {
        parsed.forEach((order) => {
          if (order?.id && !seenOrderIds.has(order.id)) {
            seenOrderIds.add(order.id)
            allOrders.push(order)
          }
        })
      }

      if (key.startsWith('smartshop-cart:') && !key.endsWith(':guest')) {
        parsed.forEach((item) => {
          const itemKey = `${item?.id}-${item?.selectedSize}-${item?.selectedColor}`
          if (item?.id && !seenCartKeys.has(itemKey)) {
            seenCartKeys.add(itemKey)
            allCartItems.push(item)
          }
        })
      }

      if (key.startsWith('smartshop-wishlist:') && !key.endsWith(':guest')) {
        parsed.forEach((item) => {
          if (item?.id && !seenWishlistIds.has(item.id)) {
            seenWishlistIds.add(item.id)
            allWishlistItems.push(item)
          }
        })
      }
    }
  } catch {
    // localStorage access denied — return empty
  }

  // Sorting done here - orders newest-first
  allOrders.sort((a, b) => new Date(b.placedAt || 0) - new Date(a.placedAt || 0))

  return {
    cartItems: allCartItems,
    orders: allOrders,
    wishlistItems: allWishlistItems,
  }
}
