// shows latest placed order id, total, status
// buttons to go to tracking or continue shopping

import { useNavigate } from 'react-router-dom'
import { FiCheckCircle } from 'react-icons/fi'
import StoreNavbar from '../components/StoreNavbar'
import './orderflow.css'

function formatPrice(value) {
  return new Intl.NumberFormat('en-IN').format(value || 0)
}

export default function OrderConfirmedPage({ order, wishlistCount = 0 }) {
  const navigate = useNavigate()

  return (
    <div className="order-page-shell">
      <StoreNavbar wishlistCount={wishlistCount} />
      <div className="confirmation-panel">
        <div className="confirmation-badge">
          <FiCheckCircle />
        </div>
        <h1>Order confirmed</h1>
        <p>Your order has been placed successfully. We have started preparing it for dispatch.</p>

        <div className="confirmation-card">
          <div className="summary-row">
            <span>Order ID</span>
            <strong>{order?.id || 'Pending'}</strong>
          </div>
          <div className="summary-row">
            <span>Total</span>
            <strong>Rs. {formatPrice(order?.total)}</strong>
          </div>
          <div className="summary-row">
            <span>Status</span>
            <strong>Confirmed</strong>
          </div>
        </div>

        <div className="confirmation-actions">
          <button className="order-primary-btn" onClick={() => navigate('/order/tracking')}>Track order</button>
          <button className="order-secondary-btn" onClick={() => navigate('/category')}>Continue shopping</button>
        </div>
      </div>
    </div>
  )
}
