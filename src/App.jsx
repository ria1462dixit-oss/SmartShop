import { Suspense, lazy, useEffect, useMemo, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Box, SimpleGrid, Skeleton, Stack } from '@chakra-ui/react'
import { isAdminSession, readSession } from './lib/auth'
import { loadAdminStoreState, loadStoreState, saveStoreState } from './lib/store-data'

const LandingPage = lazy(() => import('./Pages/LandingPage'))
const CategoryPage = lazy(() => import('./Pages/Category'))
const ProductPage = lazy(() => import('./Pages/ProductPage'))
const ProductGridPage = lazy(() => import('./Pages/ProductGridPage'))
const CartPage = lazy(() => import('./Pages/CartPage'))
const CheckoutPage = lazy(() => import('./Pages/CheckoutPage'))
const OrderConfirmedPage = lazy(() => import('./Pages/OrderConfirmedPage'))
const OrderTrackingPage = lazy(() => import('./Pages/OrderTrackingPage'))
const WishlistPage = lazy(() => import('./Pages/WishlistPage'))
const SignInPage = lazy(() => import('./Pages/SignInPage'))
const GoogleAuthCallbackPage = lazy(() => import('./Pages/GoogleAuthCallbackPage'))
const AdminDashboardPage = lazy(() => import('./Pages/AdminDashboardPage'))


// stores cart, wishlist, and order history in localStorage
// calculates cart count
// adds/removes wishlist items
// adds to cart using selected size/color variant logic
// updates/removes cart items
// creates placed orders with ETA and per-item delivery state
// defines all routes



const CART_KEY = 'smartshop-cart'
const ORDER_KEY = 'smartshop-orders'
const WISHLIST_KEY = 'smartshop-wishlist'

function getSessionScope(session) {
  return session?.user?.id || session?.user?.email || 'guest'
}

function scopedKey(key, scope) {
  return `${key}:${scope}`
}

function cartIdentity(item) {
  return `${item.id}-${item.selectedSize}-${item.selectedColor}`
}

function mergeUniqueItems(baseItems = [], incomingItems = [], getIdentity = (item) => item.id) {
  const seen = new Set(baseItems.map(getIdentity))
  const merged = [...baseItems]

  incomingItems.forEach((item) => {
    const key = getIdentity(item)
    if (!seen.has(key)) {
      seen.add(key)
      merged.push(item)
    }
  })

  return merged
}

function readStorage(key, fallback) {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.priceValue * item.quantity, 0)
}

function buildOrderItems(items, etaLabel) {
  return items.map((item, index) => ({
    ...item,
    deliveryStatus: index === 0 ? 'delivered' : 'in_transit',
    deliveryDate: index === 0 ? etaLabel : etaLabel,
    feedback: '',
    rating: null,
  }))
}

function PageSkeleton() {
  return (
    <Box minH="100vh" bg="#fff8fb" px={{ base: 3, md: 8 }} py={{ base: 3, md: 6 }}>
      <Stack gap={{ base: 5, md: 8 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" gap={4}>
          <Skeleton height="34px" width={{ base: '132px', md: '190px' }} borderRadius="8px" />
          <Box display={{ base: 'none', md: 'flex' }} gap={3} flex="1" justifyContent="center">
            {[0, 1, 2, 3, 4].map((item) => (
              <Skeleton key={item} height="32px" width="82px" borderRadius="8px" />
            ))}
          </Box>
          <Box display="flex" gap={2}>
            {[0, 1, 2].map((item) => (
              <Skeleton key={item} boxSize={{ base: '34px', md: '38px' }} borderRadius="8px" />
            ))}
          </Box>
        </Box>

        <SimpleGrid columns={{ base: 1, lg: 2 }} gap={{ base: 5, md: 8 }} alignItems="center">
          <Skeleton height={{ base: '260px', md: '420px' }} borderRadius="8px" />
          <Stack gap={4}>
            <Skeleton height="18px" width="42%" borderRadius="8px" />
            <Skeleton height={{ base: '48px', md: '70px' }} width="80%" borderRadius="8px" />
            <Skeleton height="18px" width="92%" borderRadius="8px" />
            <Skeleton height="18px" width="68%" borderRadius="8px" />
            <Box display="flex" gap={3} flexWrap="wrap">
              {[0, 1, 2, 3].map((item) => (
                <Skeleton key={item} height="38px" width={{ base: '44%', md: '110px' }} borderRadius="8px" />
              ))}
            </Box>
          </Stack>
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={4}>
          {[0, 1, 2, 3].map((item) => (
            <Stack key={item} gap={3}>
              <Skeleton height={{ base: '220px', md: '260px' }} borderRadius="8px" />
              <Skeleton height="18px" width="80%" borderRadius="8px" />
              <Skeleton height="16px" width="60%" borderRadius="8px" />
            </Stack>
          ))}
        </SimpleGrid>
      </Stack>
    </Box>
  )
}

function App() {
  const [session, setSession] = useState(() => readSession())
  const [storeHydrated, setStoreHydrated] = useState(false)
  const [cartItems, setCartItems] = useState(() => readStorage(scopedKey(CART_KEY, getSessionScope(readSession())), []))
  const [orders, setOrders] = useState(() => readStorage(scopedKey(ORDER_KEY, getSessionScope(readSession())), []))
  const [wishlistItems, setWishlistItems] = useState(() => readStorage(scopedKey(WISHLIST_KEY, getSessionScope(readSession())), []))
  const [adminStoreState, setAdminStoreState] = useState({ cartItems: [], orders: [], wishlistItems: [] })

  const sessionScope = useMemo(() => getSessionScope(session), [session])
  const isLoggedIn = Boolean(session?.token && session?.user?.email)
  const adminEnabled = isAdminSession(session)

  useEffect(() => {
    const syncSession = () => setSession(readSession())
    window.addEventListener('storage', syncSession)
    window.addEventListener('smartshop-session-change', syncSession)
    syncSession()

    return () => {
      window.removeEventListener('storage', syncSession)
      window.removeEventListener('smartshop-session-change', syncSession)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    setStoreHydrated(false)

    const fallbackState = {
      cartItems: readStorage(scopedKey(CART_KEY, sessionScope), []),
      orders: readStorage(scopedKey(ORDER_KEY, sessionScope), []),
      wishlistItems: readStorage(scopedKey(WISHLIST_KEY, sessionScope), []),
    }

    const guestState = {
      cartItems: readStorage(scopedKey(CART_KEY, 'guest'), []),
      wishlistItems: readStorage(scopedKey(WISHLIST_KEY, 'guest'), []),
    }

    const withGuestItems = (state) => {
      if (!isLoggedIn || sessionScope === 'guest') return state

      return {
        ...state,
        cartItems: mergeUniqueItems(state.cartItems || [], guestState.cartItems, cartIdentity),
        wishlistItems: mergeUniqueItems(state.wishlistItems || [], guestState.wishlistItems),
      }
    }

    const applyState = (state) => {
      if (cancelled) return
      const nextState = withGuestItems(state)
      setCartItems(Array.isArray(nextState.cartItems) ? nextState.cartItems : [])
      setOrders(Array.isArray(nextState.orders) ? nextState.orders : [])
      setWishlistItems(Array.isArray(nextState.wishlistItems) ? nextState.wishlistItems : [])
      if (isLoggedIn && sessionScope !== 'guest') {
        window.localStorage.removeItem(scopedKey(CART_KEY, 'guest'))
        window.localStorage.removeItem(scopedKey(WISHLIST_KEY, 'guest'))
      }
      setStoreHydrated(true)
    }

    if (!isLoggedIn) {
      applyState(fallbackState)
      return () => {
        cancelled = true
      }
    }

    loadStoreState(session)
      .then((state) => applyState(state))
      .catch(() => applyState(fallbackState))

    return () => {
      cancelled = true
    }
  }, [isLoggedIn, session, sessionScope])

  useEffect(() => {
    if (!storeHydrated) return

    const state = { cartItems, orders, wishlistItems }
    window.localStorage.setItem(scopedKey(CART_KEY, sessionScope), JSON.stringify(cartItems))
    window.localStorage.setItem(scopedKey(ORDER_KEY, sessionScope), JSON.stringify(orders))
    window.localStorage.setItem(scopedKey(WISHLIST_KEY, sessionScope), JSON.stringify(wishlistItems))

    if (isLoggedIn) {
      saveStoreState(session, state).catch(() => {})
    }
  }, [cartItems, isLoggedIn, orders, session, sessionScope, storeHydrated, wishlistItems])

  useEffect(() => {
    if (!adminEnabled || !session?.token) {
      setAdminStoreState({ cartItems: [], orders: [], wishlistItems: [] })
      return
    }

    loadAdminStoreState(session)
      .then((state) => {
        setAdminStoreState({
          cartItems: Array.isArray(state.cartItems) ? state.cartItems : [],
          orders: Array.isArray(state.orders) ? state.orders : [],
          wishlistItems: Array.isArray(state.wishlistItems) ? state.wishlistItems : [],
        })
      })
      .catch(() => {
        setAdminStoreState({ cartItems, orders, wishlistItems })
      })
  }, [adminEnabled, cartItems, orders, session, wishlistItems])

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems],
  )

  const wishlistCount = wishlistItems.length

  const isWishlisted = (productId) => wishlistItems.some((item) => item.id === productId)
  const isInCart = (productId, selectedSize, selectedColor) =>
    cartItems.some(
      (item) =>
        item.id === productId &&
        item.selectedSize === selectedSize &&
        item.selectedColor === selectedColor,
    )

  const toggleWishlist = (product) => {
    if (!product) return

    setWishlistItems((current) => {
      const exists = current.some((item) => item.id === product.id)
      return exists ? current.filter((item) => item.id !== product.id) : [product, ...current]
    })
  }

  const removeWishlistItem = (productId) => {
    setWishlistItems((current) => current.filter((item) => item.id !== productId))
  }

  const addToCart = (product, options = {}) => {
    setCartItems((current) => {
      const existingIndex = current.findIndex(
        (item) =>
          item.id === product.id &&
          item.selectedSize === options.selectedSize &&
          item.selectedColor === options.selectedColor,
      )

      if (existingIndex >= 0) {
        return current.map((item, index) =>
          index === existingIndex ? { ...item, quantity: item.quantity + 1 } : item,
        )
      }

      return [
        {
          ...product,
          quantity: 1,
          selectedSize: options.selectedSize || product.sizes?.[0] || 'One Size',
          selectedColor: options.selectedColor || product.colors?.[0]?.name || 'Default',
        },
        ...current,
      ]
    })
  }

  const updateCartItem = (productId, updater) => {
    setCartItems((current) =>
      current
        .map((item) => (item.id === productId ? updater(item) : item))
        .filter((item) => item.quantity > 0),
    )
  }

  const removeCartItem = (productId) => {
    setCartItems((current) => current.filter((item) => item.id !== productId))
  }

  const updateOrderItemReview = (orderId, itemKey, patch) => {
    setOrders((current) =>
      current.map((order) => {
        if (order.id !== orderId) return order

        return {
          ...order,
          items: (order.items || []).map((item) => {
            const currentKey = `${order.id}-${item.id}-${item.selectedSize}-${item.selectedColor}`
            return currentKey === itemKey ? { ...item, ...patch } : item
          }),
        }
      }),
    )
  }

  const placeOrder = (checkoutDetails) => {
    if (!isLoggedIn) return null

    const etaDate = new Date()
    etaDate.setDate(etaDate.getDate() + 1)
    const etaLabel = etaDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    const orderedItems = buildOrderItems(cartItems, etaLabel)
    const order = {
      id: `SS-${Date.now().toString().slice(-6)}`,
      placedAt: new Date().toISOString(),
      eta: etaLabel,
      items: orderedItems,
      total: calculateTotal(cartItems),
      customer: checkoutDetails,
      tracking: [
        { label: 'Order confirmed', status: 'done', note: 'Your order has been placed successfully.' },
        { label: 'Packed at warehouse', status: 'done', note: 'Your items are packed and ready to move.' },
        { label: 'Shipped', status: 'done', note: `One item has already been delivered by ${etaLabel}.` },
        { label: 'Out for delivery', status: 'current', note: `Remaining items are expected by ${etaLabel}.` },
      ],
    }

    setOrders((current) => [order, ...current])
    setCartItems([])
    return order
  }

  const latestOrder = orders[0] || null

  return (
    <Suspense fallback={<PageSkeleton />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/category"
          element={
            <CategoryPage
              cartCount={cartCount}
              wishlistCount={wishlistCount}
              isWishlisted={isWishlisted}
              onToggleWishlist={toggleWishlist}
            />
          }
        />
        <Route
          path="/shop/:categoryId"
          element={
            <ProductGridPage
              cartCount={cartCount}
              wishlistCount={wishlistCount}
              isWishlisted={isWishlisted}
              onToggleWishlist={toggleWishlist}
            />
          }
        />
        <Route
          path="/product/:productId"
          element={
            <ProductPage
              onAddToCart={addToCart}
              cartCount={cartCount}
              wishlistCount={wishlistCount}
              isInCart={isInCart}
              isWishlisted={isWishlisted}
              onToggleWishlist={toggleWishlist}
            />
          }
        />
        <Route
          path="/wishlist"
          element={
            <WishlistPage
              wishlistItems={wishlistItems}
              cartCount={cartCount}
              wishlistCount={wishlistCount}
              isInCart={isInCart}
              onToggleWishlist={toggleWishlist}
              onRemoveWishlistItem={removeWishlistItem}
              onAddToCart={addToCart}
            />
          }
        />
        <Route
          path="/bag"
          element={
            <CartPage
              cartItems={cartItems}
              onUpdateItem={updateCartItem}
              onRemoveItem={removeCartItem}
              wishlistCount={wishlistCount}
            />
          }
        />
        <Route
          path="/checkout"
          element={
            <CheckoutPage
              cartItems={cartItems}
              onPlaceOrder={placeOrder}
              onUpdateItem={updateCartItem}
              onRemoveItem={removeCartItem}
              wishlistCount={wishlistCount}
              isLoggedIn={isLoggedIn}
            />
          }
        />
        <Route
          path="/order/confirmed"
          element={<OrderConfirmedPage order={latestOrder} wishlistCount={wishlistCount} />}
        />
        <Route
          path="/order/tracking"
          element={
            <OrderTrackingPage
              orders={orders}
              wishlistCount={wishlistCount}
              onUpdateOrderItemReview={updateOrderItemReview}
            />
          }
        />
        <Route
          path="/admin"
          element={
            <AdminDashboardPage
              orders={adminEnabled ? adminStoreState.orders : orders}
              cartItems={adminEnabled ? adminStoreState.cartItems : cartItems}
              wishlistItems={adminEnabled ? adminStoreState.wishlistItems : wishlistItems}
              wishlistCount={wishlistCount}
            />
          }
        />
        <Route path="/login" element={<SignInPage />} />
        <Route path="/auth/google/callback" element={<GoogleAuthCallbackPage />} />
      </Routes>
    </Suspense>
  )
}

export default App
