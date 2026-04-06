// reads product id from route
// gets full product from catalog
// manages selected color and size
// shows gallery thumbnails
// checks if current variant is already in cart
// Add to cart changes to Go to cart when already added
// Buy now / cart navigation flow
// wishlist toggle
// related products section

import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  FiArrowLeft,
  FiCheck,
  FiHeart,
  FiMapPin,
  FiShield,
  FiShoppingBag,
  FiStar,
  FiTruck,
} from 'react-icons/fi'
import StoreNavbar from '../components/StoreNavbar'
import { getCategoryProducts, getProductById } from '../lib/products'
import { toaster } from '../components/ui/toaster'
import './productpage.css'

export default function ProductPage({
  onAddToCart,
  cartCount = 0,
  wishlistCount = 0,
  isInCart = () => false,
  isWishlisted = () => false,
  onToggleWishlist,
}) {
  const { productId } = useParams()
  const navigate = useNavigate()
  const product = useMemo(() => getProductById(productId), [productId])
  const [activeImage, setActiveImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[1] || product?.sizes?.[0] || '')
  const [selectedColor, setSelectedColor] = useState(0)
  const selectedColorName = product?.colors?.[selectedColor]?.name
  const alreadyInCart = product ? isInCart(product.id, selectedSize, selectedColorName) : false

  const relatedProducts = useMemo(() => {
    if (!product) return []
    return getCategoryProducts(product.categoryId).filter((item) => item.id !== product.id).slice(0, 4)
  }, [product])

  const handleAddToBag = () => {
    onAddToCart?.(product, {
      selectedSize,
      selectedColor: selectedColorName,
    })
    toaster.create({
      title: 'Added to cart',
      description: `${product.name} has been added to your bag.`,
      type: 'success',
      closable: true,
    })
  }

  const goToCart = () => {
    handleAddToBag()
    navigate('/bag')
  }

  if (!product) {
    return (
      <div className="product-page-shell">
        <div className="product-empty-state">
          <h1>Product not found</h1>
          <button onClick={() => navigate('/category')}>Back to shopping</button>
        </div>
      </div>
    )
  }

  return (
    <div className="product-page-shell">
      <StoreNavbar cartCount={cartCount} wishlistCount={wishlistCount} />
      <div className="product-page-panel">
        <div className="product-breadcrumb">
          <button className="product-back-link" onClick={() => navigate(`/shop/${product.categoryId}`)}>
            <FiArrowLeft />
            Back to collection
          </button>
          <span>{product.brand}</span>
          <span>/</span>
          <span>{product.name}</span>
        </div>

        <div className="product-layout">
          <section className="product-gallery">
            <div className="product-gallery-rail">
              {product.images.map((image, index) => (
                <button
                  key={`${product.id}-${index}`}
                  className={`product-thumb ${activeImage === index ? 'active' : ''}`}
                  onClick={() => setActiveImage(index)}
                >
                  <img src={image} alt={`${product.name} view ${index + 1}`} />
                </button>
              ))}
            </div>

            <div className="product-hero-stack">
              <div className="product-hero-image">
                <img src={product.images[activeImage]} alt={product.name} />
              </div>

              <div className="product-gallery-note">
                <div>
                  <FiShield />
                  Authentic curated product
                </div>
                <div>
                  <FiTruck />
                  Free delivery above Rs. 499
                </div>
              </div>
            </div>
          </section>

          <section className="product-summary">
            <div className="product-rating-strip">
              <span className="product-rating-chip">
                {product.rating}
                <FiStar />
              </span>
              <span>{product.reviews} ratings</span>
              <span>Verified style pick</span>
            </div>

            <p className="product-brand-label">{product.brand}</p>
            <h1 className="product-title">{product.title}</h1>
            <p className="product-short-copy">{product.description}</p>

            <div className="product-price-block">
              <span className="product-price">Rs. {product.price}</span>
              <span className="product-mrp">Rs. {product.mrp}</span>
              <span className="product-discount">{product.discount} OFF</span>
            </div>

            <div className="product-option-block">
              <div className="product-option-heading">
                <span>Colour</span>
                <strong>{product.colors[selectedColor]?.name}</strong>
              </div>
              <div className="product-colors">
                {product.colors.map((color, index) => (
                  <button
                    key={color.name}
                    className={`product-color-swatch ${selectedColor === index ? 'active' : ''}`}
                    style={{ '--swatch': color.hex }}
                    onClick={() => setSelectedColor(index)}
                    aria-label={color.name}
                  />
                ))}
              </div>
            </div>

            <div className="product-option-block">
              <div className="product-option-heading">
                <span>Size</span>
                <strong>{selectedSize}</strong>
              </div>
              <div className="product-sizes">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    className={`product-size-chip ${selectedSize === size ? 'active' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="product-actions">
              <button
                className="product-primary-action"
                onClick={alreadyInCart ? () => navigate('/bag') : handleAddToBag}
              >
                <FiShoppingBag />
                {alreadyInCart ? 'Go to cart' : 'Add to cart'}
              </button>
              <button
                className={`product-secondary-action ${isWishlisted(product.id) ? 'active' : ''}`}
                onClick={() => onToggleWishlist?.(product)}
              >
                <FiHeart />
                {isWishlisted(product.id) ? 'Wishlisted' : 'Wishlist'}
              </button>
            </div>

            <button className="product-buy-action" onClick={goToCart}>
              Buy now
            </button>

            <div className="product-delivery-card">
              <div className="product-delivery-head">
                <FiMapPin />
                Delivery and returns
              </div>
              <p>Delivery in 3-5 business days. Easy 7-day return window on eligible orders.</p>
            </div>

            <div className="product-section">
              <h2>Product description</h2>
              <p className="product-section-copy">{product.description}</p>
            </div>

            <div className="product-section">
              <h2>Product highlights</h2>
              <ul className="product-highlight-list">
                {product.highlights.map((highlight) => (
                  <li key={highlight}>
                    <FiCheck />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="product-section">
              <h2>Specifications</h2>
              <div className="product-spec-grid">
                {Object.entries(product.specs).map(([label, value]) => (
                  <div key={label} className="product-spec-row">
                    <span>{label}</span>
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        <section className="related-products">
          <div className="related-products-head">
            <div>
              <p>More from the same edit</p>
              <h2>Complete the look</h2>
            </div>
          </div>

          <div className="related-products-grid">
            {relatedProducts.map((item) => (
              <article key={item.id} className="related-card" onClick={() => navigate(`/product/${item.id}`)}>
                <div className="related-card-media">
                  <img src={item.images[0]} alt={item.name} />
                  <button
                    className={`related-card-wishlist ${isWishlisted(item.id) ? 'active' : ''}`}
                    onClick={(event) => {
                      event.stopPropagation()
                      onToggleWishlist?.(item)
                    }}
                    aria-label={isWishlisted(item.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <FiHeart />
                  </button>
                </div>
                <div className="related-card-copy">
                  <p>{item.brand}</p>
                  <h3>{item.name}</h3>
                  <span>Rs. {item.price}</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
