import { useEffect, useMemo, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import LandingPage from './Pages/LandingPage'
import CategoryPage from './Pages/Category'
import ProductPage from './Pages/ProductPage'
import ProductGridPage from './Pages/ProductGridPage'
import CartPage from './Pages/CartPage'
import CheckoutPage from './Pages/CheckoutPage'
import OrderConfirmedPage from './Pages/OrderConfirmedPage'
import OrderTrackingPage from './Pages/OrderTrackingPage'
import WishlistPage from './Pages/WishlistPage'
import SignInPage from './Pages/SignInPage'
import GoogleAuthCallbackPage from './Pages/GoogleAuthCallbackPage'
import AdminDashboardPage from './Pages/AdminDashboardPage'


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

function App() {
  const [cartItems, setCartItems] = useState(() => readStorage(CART_KEY, []))
  const [orders, setOrders] = useState(() => readStorage(ORDER_KEY, []))
  const [wishlistItems, setWishlistItems] = useState(() => readStorage(WISHLIST_KEY, []))

  useEffect(() => {
    window.localStorage.setItem(CART_KEY, JSON.stringify(cartItems))
  }, [cartItems])

  useEffect(() => {
    window.localStorage.setItem(ORDER_KEY, JSON.stringify(orders))
  }, [orders])

  useEffect(() => {
    window.localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlistItems))
  }, [wishlistItems])

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
  }

  const latestOrder = orders[0] || null

  return (
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
            orders={orders}
            cartItems={cartItems}
            wishlistItems={wishlistItems}
            wishlistCount={wishlistCount}
          />
        }
      />
      <Route path="/login" element={<SignInPage />} />
      <Route path="/auth/google/callback" element={<GoogleAuthCallbackPage />} />
    </Routes>
  )
}

export default App
