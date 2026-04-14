

const liveCustomers = [
  { id: 'C-102', name: 'Riya Sharma', city: 'Delhi', activity: 'Browsing Women', spend: 4200 },
  { id: 'C-118', name: 'Aman Verma', city: 'Mumbai', activity: 'Checkout started', spend: 1899 },
  { id: 'C-125', name: 'Isha Kapoor', city: 'Bengaluru', activity: 'Wishlist updated', spend: 0 },
  { id: 'C-131', name: 'Karan Mehta', city: 'Pune', activity: 'Viewing Furniture', spend: 5999 },
  { id: 'C-145', name: 'Meher Khan', city: 'Jaipur', activity: 'Returned item', spend: 2299 },
]

const monthlySalesSeed = [
  { month: 'Jan', current: 28000, last: 18000 },
  { month: 'Feb', current: 32000, last: 21000 },
  { month: 'Mar', current: 36000, last: 24000 },
  { month: 'Apr', current: 42000, last: 29000 },
  { month: 'May', current: 39000, last: 31000 },
  { month: 'Jun', current: 47000, last: 35000 },
  { month: 'Jul', current: 52000, last: 39000 },
  { month: 'Aug', current: 50000, last: 37000 },
  { month: 'Sep', current: 46000, last: 34000 },
  { month: 'Oct', current: 58000, last: 42000 },
  { month: 'Nov', current: 61000, last: 47000 },
  { month: 'Dec', current: 69000, last: 52000 },
]

const weeklyViewsSeed = [
  { day: 'Sun', thisWeek: 16000, lastWeek: 12000 },
  { day: 'Mon', thisWeek: 22000, lastWeek: 14500 },
  { day: 'Tue', thisWeek: 24500, lastWeek: 18000 },
  { day: 'Wed', thisWeek: 30000, lastWeek: 22500 },
  { day: 'Thu', thisWeek: 27600, lastWeek: 19000 },
  { day: 'Fri', thisWeek: 34000, lastWeek: 25000 },
  { day: 'Sat', thisWeek: 36200, lastWeek: 28000 },
]

const categoryColorMap = {
  women: '#ff5a8d',
  men: '#6965ff',
  home: '#16a085',    
  skincare: '#f2b84b',
  furniture: '#16a085', 
}

function titleCase(value) {
  return String(value || '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value || 0))
}

export function buildAdminDashboardData({ orders = [], cartItems = [], wishlistItems = [] }) {
  const flattenedItems = orders.flatMap((order) =>
    (order.items || []).map((item) => ({
      ...item,
      orderId: order.id,
      customerName: order.customer?.fullName || order.customer?.name || 'SmartShop customer',
    }))
  )

  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0)
  const deliveredItems = flattenedItems.filter((item) => item.deliveryStatus === 'delivered').length
  const avgOrderValue = orders.length ? Math.round(totalRevenue / orders.length) : 0
  const conversionRate = orders.length
    ? Math.min(94, Math.max(22, Math.round((orders.length / Math.max(orders.length + wishlistItems.length + cartItems.length, 1)) * 100)))
    : 41

  const categoryTotals = flattenedItems.reduce((acc, item) => {
    const key = item.categoryId || item.category || 'other'
    acc[key] = (acc[key] || 0) + Number(item.quantity || 1)
    return acc
  }, {})

  const categoryPerformance = Object.entries(categoryTotals).map(([category, quantity]) => ({
    name: category === 'home' ? 'Furniture' : titleCase(category),
    value: quantity,
    fill: categoryColorMap[category] || '#8b5cf6',
  }))

  const productTotals = flattenedItems.reduce((acc, item) => {
    const key = item.id
    const current = acc[key] || { id: item.id, name: item.name, quantity: 0 }
    current.quantity += Number(item.quantity || 1)
    acc[key] = current
    return acc
  }, {})

  const topProducts = Object.values(productTotals)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5)
    .map((product) => ({ ...product, progress: Math.min(100, 40 + product.quantity * 7) }))

  const feedbackFeed = flattenedItems
    .filter((item) => item.rating || item.feedback)
    .map((item) => ({
      id: `${item.orderId}-${item.id}`,
      customer: item.customerName,
      product: item.name,
      rating: item.rating || 0,
      feedback: item.feedback || 'Customer rated the product without written feedback.',
    }))

  const recentOrders = orders.slice(0, 6).map((order) => ({
    id: order.id,
    customer: order.customer?.fullName || order.customer?.name || 'SmartShop customer',
    date: order.placedAt
      ? new Date(order.placedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })
      : '--',
    price: formatCurrency(order.total || 0),
    status: order.items?.some((item) => item.deliveryStatus === 'returned')
      ? 'Returned'
      : order.items?.some((item) => item.deliveryStatus === 'in_transit')
        ? 'In Transit'
        : 'Completed',
    product: order.items?.[0]?.name || 'Store order',
  }))

  return {
    stats: [
      { label: 'Total Revenue', value: formatCurrency(totalRevenue), accent: '#efe7ff' },
      { label: 'Orders Placed', value: `${orders.length}`, accent: '#dbeafe' },
      { label: 'Delivered Items', value: `${deliveredItems}`, accent: '#dcfce7' },
      { label: 'Avg Order Value', value: formatCurrency(avgOrderValue), accent: '#ffe7ef' },
    ],
    monthlySales: monthlySalesSeed.map((point, index) => ({
      ...point,
      current: point.current + orders.length * 350 + index * 80,
    })),
    weeklyViews: weeklyViewsSeed.map((point, index) => ({
      ...point,
      thisWeek: point.thisWeek + cartItems.length * 180 + index * 55,
      lastWeek: point.lastWeek + wishlistItems.length * 120 + index * 40,
    })),
    categoryPerformance,
    topProducts,
    recentOrders,
    feedbackFeed,
    liveCustomers,
    quickFacts: {
      conversionRate: `${conversionRate}%`,
      activeCarts: `${cartItems.length}`,
      savedWishlist: `${wishlistItems.length}`,
    },
  }
}
