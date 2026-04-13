import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { FiHeart, FiMenu, FiShoppingBag, FiUser, FiX } from 'react-icons/fi'
import { clearSession, isAdminSession, readSession } from '../lib/auth'
import './store-navbar.css'


// route-aware active nav links
// profile dropdown open/close
// reads saved session from auth.js
// logout clears session and sends user to login
// shows wishlist/cart counters

export default function StoreNavbar({ cartCount = 0, wishlistCount = 0, className = '', style }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [session, setSession] = useState(() => readSession())
  const dropdownRef = useRef(null)

  const isHome = location.pathname === '/'
  const isCategories =
    location.pathname.startsWith('/category') ||
    location.pathname.startsWith('/shop') ||
    location.pathname.startsWith('/product')
  const isDeals = isHome && location.hash === '#deals'
  const isAbout = isHome && location.hash === '#about'
  const isNewIn = isHome && location.hash === '#new-in'
  const wishlistActive = location.pathname.startsWith('/wishlist')
  const cartActive = location.pathname.startsWith('/bag') || location.pathname.startsWith('/checkout')

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const syncSession = () => setSession(readSession())
    window.addEventListener('storage', syncSession)
    window.addEventListener('smartshop-session-change', syncSession)
    syncSession()
    return () => {
      window.removeEventListener('storage', syncSession)
      window.removeEventListener('smartshop-session-change', syncSession)
    }
  }, [])

  const openHomeSection = (hash = '') => {
    navigate(`/${hash}`)
    setMenuOpen(false)
  }

  const goTo = (path) => {
    navigate(path)
    setMenuOpen(false)
  }

  const toggleMenu = () => {
    setMenuOpen((value) => {
      const next = !value
      if (next) setOpen(false)
      return next
    })
  }

  const toggleProfile = () => {
    setOpen((value) => {
      const next = !value
      if (next) setMenuOpen(false)
      return next
    })
  }

  const profileName = session?.user?.name || session?.name || 'Guest user'
  const profileEmail = session?.user?.email || session?.email || 'guest@smartshop.com'
  const adminEnabled = isAdminSession(session)

  const handleLogout = () => {
    clearSession()
    setSession(null)
    setOpen(false)
    navigate('/login')
  }

  return (
    <header className={`store-navbar ${className}`.trim()} style={style}>
      <button className="store-navbar-brand" onClick={() => goTo('/')}>
        <span className="store-brand-dark">SMART</span>
        <span className="store-brand-accent">SHOP</span>
      </button>

      <button
        className={`store-menu-toggle ${menuOpen ? 'active' : ''}`}
        type="button"
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
        aria-controls="store-navbar-links"
        onClick={toggleMenu}
      >
        {menuOpen ? <FiX /> : <FiMenu />}
      </button>

      <nav id="store-navbar-links" className={`store-navbar-links ${menuOpen ? 'open' : ''}`}>
        <button className={isHome && !location.hash ? 'active' : ''} onClick={() => goTo('/')}>
          Home
        </button>
        <button className={isCategories ? 'active' : ''} onClick={() => goTo('/category')}>
          Categories
        </button>
        <button className={isDeals ? 'active' : ''} onClick={() => openHomeSection('#deals')}>
          Deals
        </button>
        <button className={isAbout ? 'active' : ''} onClick={() => openHomeSection('#about')}>
          About
        </button>
        <button className={isNewIn ? 'active' : ''} onClick={() => openHomeSection('#new-in')}>
          New In
        </button>
      </nav>

      <div className="store-navbar-actions">
        <div className="store-profile-wrap" ref={dropdownRef}>
          <button
            className={`store-icon-btn ${open ? 'active' : ''}`}
            aria-label="Profile"
            onClick={toggleProfile}
          >
            <FiUser />
          </button>

          {open && (
            <div className="store-profile-dropdown">
              <div className="store-profile-head">
                <strong>{profileName}</strong>
                <span>{profileEmail}</span>
              </div>
              {adminEnabled ? <button onClick={() => navigate('/admin')}>Admin panel</button> : null}
              <button onClick={() => navigate('/order/tracking')}>Your orders</button>
              <button onClick={() => window.open('mailto:support@smartshop.com', '_self')}>Query</button>
              <button className="store-profile-logout" onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>

        <button
          className={`store-icon-btn ${wishlistActive ? 'active' : ''}`}
          aria-label="Wishlist"
          onClick={() => {
            setMenuOpen(false)
            navigate('/wishlist')
          }}
        >
          <FiHeart />
          {wishlistCount > 0 && <span className="store-count-badge">{wishlistCount}</span>}
        </button>

        <button
          className={`store-icon-btn ${cartActive ? 'active' : ''}`}
          aria-label="Cart"
          onClick={() => {
            setMenuOpen(false)
            navigate('/bag')
          }}
        >
          <FiShoppingBag />
          {cartCount > 0 && <span className="store-count-badge">{cartCount}</span>}
        </button>
      </div>
    </header>
  )
}
