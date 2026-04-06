import { useNavigate } from 'react-router-dom'
import { FiHeart, FiShoppingBag, FiTrash2 } from 'react-icons/fi'
import StoreNavbar from '../components/StoreNavbar'
import './wishlist.css'

export default function WishlistPage({
  wishlistItems = [],
  cartCount = 0,
  wishlistCount = 0,
  onToggleWishlist,
  onRemoveWishlistItem,
  onAddToCart,
}) {
  const navigate = useNavigate()

  if (!wishlistItems.length) {
    return (
      <div className="wishlist-shell">
        <StoreNavbar cartCount={cartCount} wishlistCount={wishlistCount} />
        <div className="wishlist-empty-state">
          <span className="wishlist-empty-icon">
            <FiHeart />
          </span>
          <h1>Your wishlist is empty</h1>
          <p>Save the pieces you love and come back to them anytime.</p>
          <button onClick={() => navigate('/category')}>Explore collections</button>
        </div>
      </div>
    )
  }

  return (
    <div className="wishlist-shell">
      <StoreNavbar cartCount={cartCount} wishlistCount={wishlistCount} />
      <div className="wishlist-panel">
        <div className="wishlist-head">
          <div>
            <p>Saved for later</p>
            <h1>Your wishlist</h1>
          </div>
          <span>{wishlistItems.length} saved items</span>
        </div>

        <div className="wishlist-grid">
          {wishlistItems.map((product) => (
            <article key={product.id} className="wishlist-card">
              <div
                className="wishlist-card-media"
                onClick={() => navigate(`/product/${product.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    navigate(`/product/${product.id}`)
                  }
                }}
              >
                <img src={product.cardImage || product.images?.[0]} alt={product.name} />
                <button
                  className="wishlist-heart active"
                  onClick={(event) => {
                    event.stopPropagation()
                    onToggleWishlist?.(product)
                  }}
                  aria-label="Remove from wishlist"
                >
                  <FiHeart />
                </button>
              </div>

              <div className="wishlist-card-copy">
                <p>{product.brand}</p>
                <h2>{product.name}</h2>
                <span>{product.title}</span>
                <div className="wishlist-price-row">
                  <strong>Rs. {product.price}</strong>
                  <em>Rs. {product.mrp}</em>
                  <small>{product.discount} OFF</small>
                </div>

                <div className="wishlist-actions">
                  <button
                    className="wishlist-add-btn"
                    onClick={() =>
                      onAddToCart?.(product, {
                        selectedSize: product.sizes?.[0],
                        selectedColor: product.colors?.[0]?.name,
                      })
                    }
                  >
                    <FiShoppingBag />
                    Add to bag
                  </button>
                  <button className="wishlist-remove-btn" onClick={() => onRemoveWishlistItem?.(product.id)}>
                    <FiTrash2 />
                    Remove
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
