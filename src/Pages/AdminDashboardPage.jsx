import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { FiActivity, FiArrowRight, FiClock, FiMessageSquare, FiShield } from 'react-icons/fi'
import StoreNavbar from '../components/StoreNavbar'
import { buildAdminDashboardData } from '../lib/admin'
import './admin-dashboard.css'

function DashboardTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null

  return (
    <div className="admin-tooltip">
      <strong>{label}</strong>
      {payload.map((entry) => (
        <span key={entry.dataKey}>
          {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString('en-IN') : entry.value}
        </span>
      ))}
    </div>
  )
}

export default function AdminDashboardPage({
  orders = [],
  cartItems = [],
  wishlistItems = [],
  wishlistCount = 0,
}) {
  const navigate = useNavigate()
  const dashboard = useMemo(
    () => buildAdminDashboardData({ orders, cartItems, wishlistItems }),
    [orders, cartItems, wishlistItems],
  )

  return (
    <div className="admin-shell">
      <StoreNavbar wishlistCount={wishlistCount} />
      <div className="admin-page">
        <div className="admin-hero">
          <div>
            <p>Performance center</p>
            <h1>SmartShop admin pulse</h1>
            <span>
              Watch revenue, order health, customer activity, and post-delivery feedback in one place.
            </span>
          </div>
          <button className="admin-back-btn" onClick={() => navigate('/')}>
            Back to storefront <FiArrowRight />
          </button>
        </div>

        <div className="admin-stat-grid">
          {dashboard.stats.map((card) => (
            <article key={card.label} className="admin-stat-card">
              <div className="admin-stat-icon" style={{ background: card.accent }}>
                <FiActivity />
              </div>
              <div>
                <strong>{card.value}</strong>
                <span>{card.label}</span>
              </div>
            </article>
          ))}
        </div>

        <div className="admin-main-grid">
          <section className="admin-card">
            <div className="admin-card-head">
              <div>
                <h2>Sales trend</h2>
                <p>Reference analytics with current storefront order momentum.</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={dashboard.monthlySales} margin={{ top: 10, right: 8, left: -24, bottom: 0 }}>
                <CartesianGrid stroke="rgba(17,17,17,0.06)" strokeDasharray="4 4" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6f6574' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#6f6574' }} axisLine={false} tickLine={false} />
                <Tooltip content={<DashboardTooltip />} />
                <Line type="monotone" dataKey="current" name="Current" stroke="#8b5cf6" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="last" name="Last" stroke="#ff6d9f" strokeWidth={2.4} dot={false} strokeDasharray="6 4" />
              </LineChart>
            </ResponsiveContainer>
          </section>

          <section className="admin-card">
            <div className="admin-card-head">
              <div>
                <h2>Traffic vs carts</h2>
                <p>Weekly product attention and shopping intent.</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={dashboard.weeklyViews} margin={{ top: 10, right: 8, left: -24, bottom: 0 }} barCategoryGap="26%">
                <CartesianGrid stroke="rgba(17,17,17,0.06)" strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#6f6574' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#6f6574' }} axisLine={false} tickLine={false} />
                <Tooltip content={<DashboardTooltip />} />
                <Bar dataKey="thisWeek" name="This week" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                <Bar dataKey="lastWeek" name="Last week" fill="#ffc0d6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </section>
        </div>

        <div className="admin-secondary-grid">
          <section className="admin-card">
            <div className="admin-card-head">
              <div>
                <h2>Category performance</h2>
                <p>Demand split across your storefront categories.</p>
              </div>
            </div>
            {dashboard.categoryPerformance.length ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={dashboard.categoryPerformance}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={62}
                    outerRadius={92}
                    paddingAngle={4}
                  >
                    {dashboard.categoryPerformance.map((entry) => (
                      <Cell key={entry.name} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip content={<DashboardTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="admin-empty-note">Place a few orders and the category mix will appear here.</div>
            )}
            <div className="admin-legend">
              {dashboard.categoryPerformance.map((item) => (
                <span key={item.name}>
                  <i style={{ background: item.fill }} />
                  {item.name}
                </span>
              ))}
            </div>
          </section>

          <section className="admin-card">
            <div className="admin-card-head">
              <div>
                <h2>Quick watch</h2>
                <p>Real-time storefront snapshots for the admin desk.</p>
              </div>
            </div>
            <div className="admin-quick-grid">
              <article>
                <FiClock />
                <strong>{dashboard.quickFacts.activeCarts}</strong>
                <span>Active carts</span>
              </article>
              <article>
                <FiShield />
                <strong>{dashboard.quickFacts.conversionRate}</strong>
                <span>Conversion</span>
              </article>
              <article>
                <FiMessageSquare />
                <strong>{dashboard.quickFacts.savedWishlist}</strong>
                <span>Wishlist saves</span>
              </article>
            </div>
          </section>
        </div>

        <div className="admin-bottom-grid">
          <section className="admin-card">
            <div className="admin-card-head">
              <div>
                <h2>Recent orders</h2>
                <p>Latest customer orders flowing through the storefront.</p>
              </div>
            </div>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Product</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard.recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order.customer}</td>
                      <td>{order.date}</td>
                      <td>{order.product}</td>
                      <td>{order.price}</td>
                      <td>
                        <span className={`admin-status ${order.status === 'Completed' ? 'done' : 'progress'}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="admin-card">
            <div className="admin-card-head">
              <div>
                <h2>Top products</h2>
                <p>Strongest movers based on placed orders.</p>
              </div>
            </div>
            <div className="admin-progress-list">
              {dashboard.topProducts.map((product) => (
                <div key={product.id}>
                  <div className="admin-progress-head">
                    <span>{product.name}</span>
                    <small>{product.quantity} sold</small>
                  </div>
                  <div className="admin-progress-bar">
                    <div style={{ width: `${product.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="admin-bottom-grid">
          <section className="admin-card">
            <div className="admin-card-head">
              <div>
                <h2>Live shoppers</h2>
                <p>Demo customer pulse for real-time shopping behavior.</p>
              </div>
            </div>
            <div className="admin-customer-feed">
              {dashboard.liveCustomers.map((customer) => (
                <article key={customer.id}>
                  <div>
                    <strong>{customer.name}</strong>
                    <span>{customer.city}</span>
                  </div>
                  <p>{customer.activity}</p>
                  <small>
                    {customer.spend ? `Potential value ${customer.spend.toLocaleString('en-IN')}` : 'Exploring'}
                  </small>
                </article>
              ))}
            </div>
          </section>

          <section className="admin-card">
            <div className="admin-card-head">
              <div>
                <h2>Customer feedback</h2>
                <p>Ratings and review notes from delivered products.</p>
              </div>
            </div>
            {dashboard.feedbackFeed.length ? (
              <div className="admin-feedback-feed">
                {dashboard.feedbackFeed.map((entry) => (
                  <article key={entry.id}>
                    <div className="admin-feedback-head">
                      <strong>{entry.customer}</strong>
                      <span>{'★'.repeat(entry.rating || 0)}{'☆'.repeat(5 - (entry.rating || 0))}</span>
                    </div>
                    <p>{entry.product}</p>
                    <small>{entry.feedback}</small>
                  </article>
                ))}
              </div>
            ) : (
              <div className="admin-empty-note">
                Once customers rate delivered products, their feedback will appear here.
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
