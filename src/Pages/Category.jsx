// reads section from URL
// changes active category from arrow controls
// syncs wheel selection with URL query param
// changes category background image/color
// filters preview cards
// opens category collection or product detail
// toggles wishlist from cards


import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { FiArrowRight, FiHeart, FiStar } from 'react-icons/fi'
import StoreNavbar from '../components/StoreNavbar'
import { getProducts } from '../lib/products'
import catWomen from '../assets/Cat_W.jpg'
import catMen from '../assets/Cat_M.jpg'
import catHome from '../assets/Cat_F.jpg'
import catSkincare from '../assets/Cat_S.jpg'
import './categorysection.css'

const categories = [
  {
    id: 'women',
    name: "Women's",
    short: 'Women',
    eyebrow: 'New wardrobe energy for every plan',
    filters: ['All', 'Tops', 'Jeans', 'Dresses'],
    panelColor: '#ee9fa4',
    wheelColor: '#892840',
    portrait: catWomen,
  },
  {
    id: 'men',
    name: "Men's",
    short: 'Men',
    eyebrow: 'Cuts for everyday confidence',
    filters: ['All', 'Shirts', 'Trousers', 'Jackets'],
    panelColor: '#edcc98',
    wheelColor: '#966613',
    portrait: catMen,
  },
  {
    id: 'skincare',
    name: 'Skincare',
    short: 'Skincare',
    eyebrow: 'Glow without the guesswork',
    filters: ['All', 'Serums', 'SPF', 'Sets'],
    panelColor: '#bfe7da',
    wheelColor: '#217b61',
    portrait: catSkincare,
  },
  {
    id: 'home',
    name: 'Furniture',
    short: 'Furniture',
    eyebrow: 'Pieces that soften every room',
    filters: ['All', 'Decor', 'Lighting', 'Textiles'],
    panelColor: '#d5c4f1',
    wheelColor: '#5f45b2',
    portrait: catHome,
  },
]

export default function CategoryPage({
  cartCount = 0,
  wishlistCount = 0,
  isWishlisted = () => false,
  onToggleWishlist,
}) {
  const [activeIdx, setActiveIdx] = useState(0)
  const [activeSub, setActiveSub] = useState('All')
  const [wheelRotation, setWheelRotation] = useState(0)
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const current = categories[activeIdx]
  const products = useMemo(() => getProducts(current.id, activeSub), [current.id, activeSub])

  useEffect(() => {
    setActiveSub('All')
  }, [activeIdx])

  useEffect(() => {
    const section = searchParams.get('section')
    if (!section) return
    const nextIndex = categories.findIndex((category) => category.id === section)
    if (nextIndex >= 0) {
      setActiveIdx(nextIndex)
    }
  }, [searchParams])

  const changeCategory = (nextIdx) => {
    if (nextIdx === activeIdx) return
    const forward = (nextIdx - activeIdx + categories.length) % categories.length
    const backward = (activeIdx - nextIdx + categories.length) % categories.length
    const direction = forward <= backward ? 1 : -1
    setWheelRotation((value) => value + direction * 90)
    setActiveIdx(nextIdx)
    setSearchParams({ section: categories[nextIdx].id }, { replace: true })
  }

  const openProduct = (productId) => {
    navigate(`/product/${productId}`)
  }

  const openCollection = () => {
    navigate(`/shop/${current.id}`)
  }

  const prevIdx = (activeIdx - 1 + categories.length) % categories.length
  const nextIdx = (activeIdx + 1) % categories.length

  return (
    <div className="category-page-shell">
      <StoreNavbar
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        className="store-navbar-category"
        style={{
          '--category-navbar-bg': `${current.panelColor}33`,
          '--category-navbar-border': `${current.wheelColor}24`,
          '--category-navbar-chip': `${current.panelColor}b8`,
          '--category-navbar-chip-active': `${current.panelColor}f2`,
          '--category-navbar-icon': '#fff7fb',
        }}
      />
      <div
        className="category-page-panel"
        style={{
          '--panel-color': current.panelColor,
          '--wheel-color': current.wheelColor,
          '--category-bg-image': `url(${current.portrait})`,
        }}
      >
        <main className="category-stage">
          <section className="wheel-column">
            <div className="wheel-frame">
              <div className="wheel-rotor" style={{ transform: `rotate(${wheelRotation}deg)` }}>
                <div className="wheel-ring" />
                {categories.map((category, index) => (
                  <button
                    key={category.id}
                    className={`wheel-node wheel-node-${index} ${index === activeIdx ? 'active' : ''}`}
                    onClick={() => changeCategory(index)}
                    aria-label={category.name}
                  >
                    <span className="wheel-node-fill">
                      <img src={category.portrait} alt={category.name} />
                    </span>
                  </button>
                ))}
              </div>

              <div className="wheel-focus">
                <img src={current.portrait} alt={current.name} />
              </div>

              <button className="wheel-arrow wheel-arrow-up" onClick={() => changeCategory(prevIdx)} aria-label="Previous category">
                ^
              </button>
              <button className="wheel-arrow wheel-arrow-down" onClick={() => changeCategory(nextIdx)} aria-label="Next category">
                v
              </button>
            </div>
          </section>

          <section className="category-visual-column">
            <div className="category-portrait-frame">
              <img src={current.portrait} alt={current.name} />
            </div>
          </section>

          <section className="content-column">
            <div className="content-copy">
              <p className="content-eyebrow">{current.eyebrow}</p>
              <div className="category-title-row">
                <h1 className="content-title">{current.name}</h1>
                <button className="category-change-btn" onClick={() => changeCategory(nextIdx)} aria-label="Next category">
                  <FiArrowRight />
                </button>
              </div>
              <div className="category-pill-row" aria-label="Categories">
                {categories.map((category, index) => (
                  <button
                    key={category.id}
                    className={`category-pill ${index === activeIdx ? 'active' : ''}`}
                    onClick={() => changeCategory(index)}
                  >
                    {category.short}
                  </button>
                ))}
              </div>
              <div className="content-filters">
                {current.filters.map((filter) => (
                  <button
                    key={filter}
                    className={`filter-chip ${activeSub === filter ? 'active' : ''}`}
                    onClick={() => {
                      if (filter === 'All') {
                        openCollection()
                        return
                      }
                      setActiveSub(filter)
                    }}
                  >
                    {filter}
                  </button>
                ))}
              </div>
              <button className="shop-cta" onClick={openCollection}>
                Start shopping
                <FiArrowRight />
              </button>
            </div>

            <div className="cards-rail">
              {products.map((product, index) => (
                <article
                  key={product.id}
                  className={`product-card ${index === 1 ? 'featured' : ''}`}
                  onClick={() => openProduct(product.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      openProduct(product.id)
                    }
                  }}
                >
                  <div className="product-card-media">
                    <img src={product.cardImage} alt={product.name} />
                    <button
                      className={`product-card-wishlist ${isWishlisted(product.id) ? 'active' : ''}`}
                      onClick={(event) => {
                        event.stopPropagation()
                        onToggleWishlist?.(product)
                      }}
                      aria-label={isWishlisted(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                      <FiHeart />
                    </button>
                    <div className="product-card-rating">
                      <span>{product.rating}</span>
                      <FiStar />
                      <span className="product-card-rating-reviews">({product.reviews})</span>
                    </div>
                  </div>

                  <div className="product-details">
                    <p className="product-brand">{product.brand}</p>
                    <h3>{product.name}</h3>
                    <p className="product-title-copy">{product.title}</p>
                    <div className="product-price-row">
                      <span className="product-price-current">Rs. {product.price}</span>
                      <span className="product-price-mrp">Rs. {product.mrp}</span>
                      <span className="product-price-discount">{product.discount} OFF</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
