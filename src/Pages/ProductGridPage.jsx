import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FiArrowLeft, FiHeart, FiSearch, FiStar } from 'react-icons/fi'
import StoreNavbar from '../components/StoreNavbar'
import { getCategoryProducts } from '../lib/products'
import './productgrid.css'

const collectionMeta = {
  women: { title: "Women's Edit", subtitle: 'Curated silhouettes, fresh denim, and easy statement pieces.' },
  men: { title: "Men's Edit", subtitle: 'Tailored looks, effortless layers, and everyday elevated essentials.' },
  skincare: { title: 'Skincare Edit', subtitle: 'Build a clean, polished routine with texture, glow, and recovery.' },
  home: { title: 'Furniture Edit', subtitle: 'Layer your space with sculptural pieces and soft utility.' },
}

export default function ProductGridPage({
  cartCount = 0,
  wishlistCount = 0,
  isWishlisted = () => false,
  onToggleWishlist,
}) {
  const { categoryId } = useParams()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const products = useMemo(() => getCategoryProducts(categoryId), [categoryId])
  const meta = collectionMeta[categoryId] || collectionMeta.women

  const filtered = products.filter((product) => {
    const text = `${product.brand} ${product.name} ${product.title}`.toLowerCase()
    return text.includes(query.toLowerCase())
  })

  return (
    <div className="product-grid-shell">
      <StoreNavbar cartCount={cartCount} wishlistCount={wishlistCount} />
      <div className="product-grid-panel">
        <div className="product-grid-topbar">
          <button className="product-grid-back" onClick={() => navigate('/category')}>
            <FiArrowLeft />
            Back
          </button>

          <div className="product-grid-search">
            <FiSearch />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the edit" />
          </div>
        </div>

        <div className="product-grid-hero">
          <p>{meta.subtitle}</p>
          <h1>{meta.title}</h1>
        </div>

        <div className="product-grid-list">
          {filtered.length ? (
            filtered.map((product) => (
              <article key={product.id} className="collection-card" onClick={() => navigate(`/product/${product.id}`)}>
                <div className="collection-card-media">
                  <img src={product.images[0]} alt={product.name} />
                  <button
                    className={`collection-wishlist ${isWishlisted(product.id) ? 'active' : ''}`}
                    onClick={(event) => {
                      event.stopPropagation()
                      onToggleWishlist?.(product)
                    }}
                    aria-label={isWishlisted(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <FiHeart />
                  </button>
                  <div className="collection-rating">
                    <span>{product.rating}</span>
                    <FiStar />
                    <span className="collection-rating-reviews">({product.reviews})</span>
                  </div>
                </div>

                <div className="collection-card-copy">
                  <p className="collection-brand">{product.brand}</p>
                  <h2>{product.name}</h2>
                  <p className="collection-title">{product.title}</p>
                  <div className="collection-price-row">
                    <span className="collection-price">Rs. {product.price}</span>
                    <span className="collection-mrp">Rs. {product.mrp}</span>
                    <span className="collection-discount">{product.discount} OFF</span>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="product-grid-empty">No products found for "{query}".</div>
          )}
        </div>
      </div>
    </div>
  )
}
