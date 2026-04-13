import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StoreNavbar from '../components/StoreNavbar'
import './orderflow.css'

export default function OrderTrackingPage({
  orders = [],
  wishlistCount = 0,
  onUpdateOrderItemReview,
}) {
  const navigate = useNavigate()
  const [ratings, setRatings] = useState({})
  const [feedback, setFeedback] = useState({})
  const [submittedReviews, setSubmittedReviews] = useState({})

  useEffect(() => {
    const nextRatings = {}
    const nextFeedback = {}

    orders.forEach((order) => {
      ;(order.items || []).forEach((item) => {
        const itemKey = `${order.id}-${item.id}-${item.selectedSize}-${item.selectedColor}`
        nextRatings[itemKey] = item.rating || 0
        nextFeedback[itemKey] = submittedReviews[itemKey] ? '' : item.feedback || ''
      })
    })

    setRatings(nextRatings)
    setFeedback(nextFeedback)
  }, [orders, submittedReviews])

  const submitRating = (itemId, value) => {
    setRatings((current) => ({ ...current, [itemId]: value }))
  }

  const submitFeedback = (itemId, value) => {
    setFeedback((current) => ({ ...current, [itemId]: value }))
  }

  const submitReview = (orderId, itemKey) => {
    const rating = Number(ratings[itemKey] || 0)
    const reviewText = (feedback[itemKey] || '').trim()

    if (!rating && !reviewText) return

    onUpdateOrderItemReview?.(orderId, itemKey, {
      rating,
      feedback: reviewText,
    })
    setSubmittedReviews((current) => ({ ...current, [itemKey]: true }))
    setFeedback((current) => ({ ...current, [itemKey]: '' }))
  }

  return (
    <div className="order-page-shell">
      <StoreNavbar wishlistCount={wishlistCount} />
      <div className="tracking-panel">
        <div className="tracking-head">
          <div>
            <p>Order tracking</p>
            <h1>{orders.length ? 'Your orders' : 'No recent order'}</h1>
            {orders.length > 0 ? (
              <span className="tracking-eta">All placed orders are shown below.</span>
            ) : null}
          </div>
          <button className="order-secondary-btn" onClick={() => navigate('/category')}>
            Back to shop
          </button>
        </div>

        {orders.length > 0 ? (
          <div className="tracking-order-list">
            {orders.map((order) => (
              <section key={order.id} className="tracking-order-card">
                <div className="tracking-order-card-head">
                  <div>
                    <p>Order ID</p>
                    <h2>{order.id}</h2>
                    {order.eta ? <span className="tracking-eta">Expected delivery: {order.eta}</span> : null}
                  </div>
                </div>

                <div className="tracking-timeline">
                  {(order.tracking || []).map((step) => (
                    <div key={`${order.id}-${step.label}`} className={`tracking-step ${step.status}`}>
                      <div className="tracking-dot" />
                      <div>
                        <strong>{step.label}</strong>
                        <p>
                          {step.note ||
                            (step.status === 'done'
                              ? 'Completed'
                              : step.status === 'current'
                                ? 'In progress'
                                : 'Waiting')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {order.items?.length > 0 ? (
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
                                      window.open(
                                        'https://prathu-bit12.github.io/Project_Smartshop/',
                                        '_blank',
                                        'noopener,noreferrer',
                                      )
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
                                          onClick={() => {
                                            submitRating(itemKey, star)
                                            setSubmittedReviews((current) => ({ ...current, [itemKey]: false }))
                                          }}
                                          aria-label={`${star} star`}
                                        >
                                          ★
                                        </button>
                                      ))}
                                    </div>
                                  </div>

                                  <div className="tracking-feedback-block">
                                    <label htmlFor={`feedback-${itemKey}`}>Feedback</label>
                                    {submittedReviews[itemKey] ? (
                                      <div className="tracking-feedback-submitted">Submitted to admin</div>
                                    ) : (
                                      <>
                                        <input
                                          id={`feedback-${itemKey}`}
                                          type="text"
                                          placeholder="Write a few words"
                                          value={feedback[itemKey] || ''}
                                          onChange={(event) => {
                                            submitFeedback(itemKey, event.target.value)
                                            setSubmittedReviews((current) => ({ ...current, [itemKey]: false }))
                                          }}
                                        />
                                        <button
                                          type="button"
                                          className="tracking-submit-feedback"
                                          disabled={!Number(ratings[itemKey] || 0) && !(feedback[itemKey] || '').trim()}
                                          onClick={() => submitReview(order.id, itemKey)}
                                        >
                                          Submit feedback
                                        </button>
                                      </>
                                    )}
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
                ) : null}
              </section>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}
