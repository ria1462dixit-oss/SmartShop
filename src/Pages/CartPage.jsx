// lists cart items
// quantity increase/decrease
// remove item
// move through bag flow toward checkout
// shows pricing summary


import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi'
import StoreNavbar from '../components/StoreNavbar'
import './orderflow.css'

function formatPrice(value) {
  return new Intl.NumberFormat('en-IN').format(value)
}

export default function CartPage({ cartItems, onUpdateItem, onRemoveItem, wishlistCount = 0 }) {
  const navigate = useNavigate()
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

  if (!cartItems.length) {
    return (
      <div className="order-page-shell">
        <div className="order-empty-state">
          <h1>Your bag is empty</h1>
          <button onClick={() => navigate('/category')}>Continue shopping</button>
        </div>
      </div>
    )
  }

  return (
    <div className="order-page-shell">
      <StoreNavbar
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        wishlistCount={wishlistCount}
      />
      <div className="order-page-panel">
        <div className="order-top-steps">
          <span className="active">Bag</span>
          <span>Address</span>
          <span>Payment</span>
        </div>

        <div className="order-layout">
          <section className="cart-items-column">
            <div className="cart-address-card">
              <div>
                <p>Deliver to <strong>Riya, abcabc</strong></p>
                <span>aaaaaaaaaaaaaaddddddddddddddddrrrrrrrrrrrrvv eeeeeeeeeeeessssssssssssss</span>
              </div>
              <button className="small-address-btn" onClick={() => navigate('/checkout')}>
                Change address
              </button>
            </div>

            <div className="cart-offer-card">
              <strong>Available Offers</strong>
              <p>10% instant discount on selected cards on minimum order values.</p>
              <button>Show More</button>
            </div>

            <div className="cart-banner-card">
              <strong>{cartItems.length}/{cartItems.length} items selected</strong>
              <div className="cart-toolbar-actions">
                <button>Remove</button>
                <button>Move to wishlist</button>
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
                      <button className="cart-remove" onClick={() => onRemoveItem(item.id)}>
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
                        <button onClick={() => onUpdateItem(item.id, (current) => ({ ...current, quantity: current.quantity - 1 }))}>
                          <FiMinus />
                        </button>
                        <span>{item.quantity}</span>
                        <button onClick={() => onUpdateItem(item.id, (current) => ({ ...current, quantity: current.quantity + 1 }))}>
                          <FiPlus />
                        </button>
                      </div>
                      <p>Delivery by {deliveryDate}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <button className="wishlist-strip" onClick={() => navigate('/category')}>
              Add more from wishlist
            </button>
          </section>

          <aside className="order-summary-card">
            <div className="coupon-block">
              <h4>Coupons</h4>
              <div className="coupon-apply-row">
                <span>Apply coupons</span>
                <button>Apply</button>
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
              <strong>Rs. 29</strong>
            </div>
            <div className="summary-row total">
              <span>Total Amount</span>
              <strong>Rs. {formatPrice(total + 29)}</strong>
            </div>
            <button className="order-primary-btn" onClick={() => navigate('/checkout')}>
              Place order
            </button>
          </aside>
        </div>
      </div>
    </div>
  )
}
