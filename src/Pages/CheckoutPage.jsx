// Chakra UI form for name, email, address, city, etc.
// editable address block
// quantity controls also available here
// pricing summary based on cart contents
// place order action


import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Checkbox, Input, SimpleGrid, Stack, Text, Textarea } from '@chakra-ui/react'
import { FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi'
import StoreNavbar from '../components/StoreNavbar'
import { createStripeCheckoutSession } from '../lib/stripe'
import './orderflow.css'

function formatPrice(value) {
  return new Intl.NumberFormat('en-IN').format(value)
}

export default function CheckoutPage({
  cartItems,
  onPlaceOrder,
  onUpdateItem,
  onRemoveItem,
  wishlistCount = 0,
  isLoggedIn = false,
  onClearCart,
  onMoveToWishlist,
}) {
  const navigate = useNavigate()
  const [editingAddress, setEditingAddress] = useState(false)
  const [stripeLoading, setStripeLoading] = useState(false)
  const [stripeError, setStripeError] = useState('')
  const [form, setForm] = useState({
    fullName: 'Riya',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    saveAddress: true,
  })

  const total = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.priceValue * item.quantity, 0),
    [cartItems],
  )
  const mrp = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.mrpValue * item.quantity, 0),
    [cartItems],
  )
  const deliveryDate = useMemo(() => {
    const date = new Date()
    date.setDate(date.getDate() + 1)
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  }, [])

  const updateField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!isLoggedIn) {
      window.alert('Kindly login to place an order.')
      navigate('/login?next=/checkout')
      return
    }

    const order = onPlaceOrder(form)
    if (!order) return
    navigate('/order/confirmed')
  }

  const handleStripeCheckout = async () => {
    if (!isLoggedIn) {
      window.alert('Kindly login to place an order.')
      navigate('/login?next=/checkout')
      return
    }

    setStripeError('')
    setStripeLoading(true)

    try {
      const payload = await createStripeCheckoutSession({
        items: cartItems.map((item) => ({
          name: item.name,
          title: item.title,
          amount: item.priceValue,
          quantity: item.quantity,
        })),
        customerEmail: form.email,
        successUrl: `${window.location.origin}/order/confirmed`,
        cancelUrl: `${window.location.origin}/bag`,
      })
      // window.location.assign(payload.url)
      window.open(payload.url, '_self')
    } catch (error) {
      setStripeError(error.message)
    } finally {
      setStripeLoading(false)
    }
  }

  return (
    <div className="order-page-shell">
      <StoreNavbar
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        wishlistCount={wishlistCount}
      />
      <div className="order-page-panel">
        <div className="order-top-steps">
          <span>Bag</span>
          <span className="active">Address</span>
          <span>Payment</span>
        </div>

        <div className="order-layout">
          <form className="checkout-form-wrap" onSubmit={handleSubmit}>
            <Box className="checkout-address-card">
              <div className="checkout-address-head">
                <div>
                  <p>Deliver to <strong>{form.fullName || 'Riya'}, abcabc</strong></p>
                  <span>{form.address || 'Click on the edit address button and enter details in form.'}</span>
                </div>
                <button
                  type="button"
                  className="small-address-btn"
                  onClick={() => setEditingAddress((value) => !value)}
                >
                  {editingAddress ? 'Save address' : 'Click to edit address'}
                </button>
              </div>

              <Stack gap="14px" mt="18px" display={editingAddress ? 'grid' : 'none'}>
                <Input placeholder="Full name" value={form.fullName} onChange={(e) => updateField('fullName', e.target.value)} size="lg" />
                <SimpleGrid columns={{ base: 1, md: 2 }} gap="14px">
                  <Input placeholder="Email address" value={form.email} onChange={(e) => updateField('email', e.target.value)} size="lg" />
                  <Input placeholder="Phone number" value={form.phone} onChange={(e) => updateField('phone', e.target.value)} size="lg" />
                </SimpleGrid>
                <Textarea placeholder="Address" value={form.address} onChange={(e) => updateField('address', e.target.value)} minH="110px" resize="vertical" />
                <SimpleGrid columns={{ base: 1, md: 3 }} gap="14px">
                  <Input placeholder="City" value={form.city} onChange={(e) => updateField('city', e.target.value)} size="lg" />
                  <Input placeholder="State" value={form.state} onChange={(e) => updateField('state', e.target.value)} size="lg" />
                  <Input placeholder="Pincode" value={form.pincode} onChange={(e) => updateField('pincode', e.target.value)} size="lg" />
                </SimpleGrid>
                <Checkbox.Root checked={form.saveAddress} onCheckedChange={(details) => updateField('saveAddress', !!details.checked)}>
                  <Checkbox.HiddenInput />
                  <Checkbox.Control />
                  <Checkbox.Label>Save this address for future orders</Checkbox.Label>
                </Checkbox.Root>
              </Stack>
            </Box>

            <div className="cart-offer-card">
              <strong>Available Offers</strong>
              <p>10% instant discount on selected cards on minimum order values.</p>
              <button type="button">Show More</button>
            </div>

            <div className="cart-banner-card">
              <strong>{cartItems.length}/{cartItems.length} items selected</strong>
              <div className="cart-toolbar-actions">
                <button type="button" onClick={() => onClearCart?.()}>Remove</button>
                <button type="button" onClick={() => onMoveToWishlist?.()}>Move to wishlist</button>
              </div>
            </div>

            <div className="cart-list">
              {cartItems.map((item) => (
                <article key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="cart-item-card">
                  <div className="cart-item-media">
                    <img src={item.images[0]} alt={item.name} />
                  </div>

                  <div className="cart-item-copy">
                    <div className="cart-item-head">
                      <div>
                        <p className="cart-item-brand">{item.brand}</p>
                        <h2>{item.name}</h2>
                        <p className="cart-item-title">{item.title}</p>
                      </div>
                      <button type="button" className="cart-remove" onClick={() => onRemoveItem(item.id)}>
                        <FiTrash2 />
                      </button>
                    </div>

                    <div className="cart-item-meta">
                      <span>Size: {item.selectedSize}</span>
                      <span>Color: {item.selectedColor}</span>
                    </div>

                    <div className="cart-item-price">
                      <strong>Rs. {item.price}</strong>
                      <span>Rs. {item.mrp}</span>
                      <em>{item.discount} OFF</em>
                    </div>

                    <div className="cart-item-footer">
                      <div className="qty-stepper">
                        <button type="button" onClick={() => onUpdateItem(item.id, (current) => ({ ...current, quantity: current.quantity - 1 }))}>
                          <FiMinus />
                        </button>
                        <span>{item.quantity}</span>
                        <button type="button" onClick={() => onUpdateItem(item.id, (current) => ({ ...current, quantity: current.quantity + 1 }))}>
                          <FiPlus />
                        </button>
                      </div>
                      <p>Delivery by {deliveryDate}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </form>

          <aside className="order-summary-card">
            <div className="coupon-block">
              <h4>Coupons</h4>
              <div className="coupon-apply-row">
                <span>Apply Coupons</span>
                <button type="button">Apply</button>
              </div>
              <label className="donation-row">
                <input type="checkbox" />
                <span>Donate and make a difference</span>
              </label>
              <div className="donation-pills">
                <span>10</span>
                <span>20</span>
                <span>50</span>
                <span>100</span>
              </div>
            </div>

            <h3>Price details</h3>
            <div className="summary-row">
              <span>Total MRP</span>
              <strong>Rs. {formatPrice(mrp)}</strong>
            </div>
            <div className="summary-row">
              <span>Discount on MRP</span>
              <strong className="summary-green">- Rs. {formatPrice(mrp - total)}</strong>
            </div>
            <div className="summary-row">
              <span>Coupon Discount</span>
              <strong className="summary-pink">Apply Coupon</strong>
            </div>
            <div className="summary-row">
              <span>Platform fee</span>
              <strong>Rs. 23</strong>
            </div>
            <div className="summary-row total">
              <span>Total Amount</span>
              <strong>Rs. {formatPrice(total + 23)}</strong>
            </div>
            {stripeError ? (
              <Text mt={3} fontSize="12px" color="#b4235d">
                {stripeError}
              </Text>
            ) : null}
            <Text mt={3} fontSize="12px" color="rgba(29,16,20,0.68)">
              In Stripe test mode use card `4242 4242 4242 4242`, any future date, and any 3 digits.
            </Text>
            <button type="submit" className="order-primary-btn" onClick={handleSubmit}>
              Place Order
            </button>
            <button
              type="button"
              className="order-secondary-btn"
              onClick={handleStripeCheckout}
              disabled={stripeLoading}
              style={{ marginTop: 12 }}
            >
              {stripeLoading ? 'Redirecting to Stripe...' : 'Pay with Stripe'}
            </button>
          </aside>
        </div>
      </div>
    </div>
  )
}
