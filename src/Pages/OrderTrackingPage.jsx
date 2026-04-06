import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import StoreNavbar from '../components/StoreNavbar'
import './orderflow.css'

export default function OrderTrackingPage({ orders = [], wishlistCount = 0 }) {
  const navigate = useNavigate()
  const [ratings, setRatings] = useState({})
  const [feedback, setFeedback] = useState({})

  const submitRating = (itemId, value) => {
    setRatings((current) => ({ ...current, [itemId]: value }))
  }

  const submitFeedback = (itemId, value) => {
    setFeedback((current) => ({ ...current, [itemId]: value }))
  }

  return (
    <div className="order-page-shell">
      <StoreNavbar wishlistCount={wishlistCount} />
      <div className="tracking-panel">
        <div className="tracking-head">
          <div>
            <p>Order tracking</p>
            <h1>{orders.length ? 'Your orders' : 'No recent order'}</h1>
            {orders.length > 0 && <span className="tracking-eta">All placed orders are shown below.</span>}
          </div>
          <button className="order-secondary-btn" onClick={() => navigate('/category')}>Back to shop</button>
        </div>

        {orders.length > 0 ? (
          <div className="tracking-order-list">
            {orders.map((order) => (
              <section key={order.id} className="tracking-order-card">
                <div className="tracking-order-card-head">
                  <div>
                    <p>Order ID</p>
                    <h2>{order.id}</h2>
                    {order.eta && <span className="tracking-eta">Expected delivery: {order.eta}</span>}
                  </div>
                </div>

                <div className="tracking-timeline">
                  {(order.tracking || []).map((step) => (
                    <div key={`${order.id}-${step.label}`} className={`tracking-step ${step.status}`}>
                      <div className="tracking-dot" />
                      <div>
                        <strong>{step.label}</strong>
                        <p>{step.note || (step.status === 'done' ? 'Completed' : step.status === 'current' ? 'In progress' : 'Waiting')}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {order.items?.length > 0 && (
                  <div className="tracking-items">
                    <h2>Product delivery updates</h2>
                    <div className="tracking-item-list">
                      {order.items.map((item) => {
                        const isDelivered = item.deliveryStatus === 'delivered'
                        const deliveryLabel = item.deliveryDate || order?.eta || 'your scheduled date'
                        const itemKey = `${order.id}-${item.id}-${item.selectedSize}-${item.selectedColor}`

                        return (
                          <article key={itemKey} className="tracking-item-card">
                            <img src={item.images?.[0] || item.cardImage} alt={item.name} />
                            <div className="tracking-item-copy">
                              <strong>{item.name}</strong>
                              <p>{item.title}</p>
                              <span>
                                {isDelivered
                                  ? `Delivered on ${deliveryLabel}`
                                  : `Expected delivery by ${deliveryLabel}`}
                              </span>

                              {isDelivered ? (
                                <div className="tracking-item-actions">
                                  <button
                                    className="tracking-action-btn"
                                    onClick={() =>
                                      window.open('https://prathu-bit12.github.io/Project_Smartshop/', '_blank', 'noopener,noreferrer')
                                    }
                                  >
                                    Return
                                  </button>

                                  <div className="tracking-feedback-block">
                                    <label>Rate</label>
                                    <div className="tracking-stars" aria-label="Rate product">
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                          key={star}
                                          type="button"
                                          className={Number(ratings[itemKey] || 0) >= star ? 'active' : ''}
                                          onClick={() => submitRating(itemKey, star)}
                                          aria-label={`${star} star`}
                                        >
                                          ★
                                        </button>
                                      ))}
                                    </div>
                                  </div>

                                  <div className="tracking-feedback-block">
                                    <label htmlFor={`feedback-${itemKey}`}>Feedback</label>
                                    <input
                                      id={`feedback-${itemKey}`}
                                      type="text"
                                      placeholder="Write a few words"
                                      value={feedback[itemKey] || ''}
                                      onChange={(event) => submitFeedback(itemKey, event.target.value)}
                                    />
                                  </div>
                                </div>
                              ) : (
                                <div className="tracking-delivery-note">This item is still in transit.</div>
                              )}
                            </div>
                          </article>
                        )
                      })}
                    </div>
                  </div>
                )}
              </section>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}
