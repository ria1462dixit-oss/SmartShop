import Stripe from 'stripe'

function getStripe(secretKey) {
  if (!secretKey) {
    throw new Error('Set STRIPE_SECRET_KEY in server/.env to enable payments.')
  }

  return new Stripe(secretKey, {
    apiVersion: '2024-06-20',
  })
}

export async function createCheckoutSession({ env, items, successUrl, cancelUrl, customerEmail }) {
  const stripe = getStripe(env.STRIPE_SECRET_KEY)

  const lineItems = (items || []).map((item) => ({
    price_data: {
      currency: 'inr',
      product_data: {
        name: item.name,
        description: item.title || '',
      },
      unit_amount: Math.round(Number(item.amount || 0) * 100),
    },
    quantity: item.quantity || 1,
  }))

  if (!lineItems.length) {
    throw new Error('No line items provided for payment.')
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: lineItems,
    success_url: successUrl,
    cancel_url: cancelUrl,
    customer_email: customerEmail || undefined,
    allow_promotion_codes: true,
    payment_method_types: ['card', 'upi'],
  })

  return { id: session.id, url: session.url }
}