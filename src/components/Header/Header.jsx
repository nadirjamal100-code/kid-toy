import { useState, useSyncExternalStore } from 'react';
import logo from '../../assets/images/logo-brand.png';
import { getCartCount, subscribeCart } from '../../data/cart.js';
import './Header.css';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const cartCount = useSyncExternalStore(subscribeCart, getCartCount, () => 0);
  const searchQuery = new URLSearchParams(window.location.search).get('q') || '';

  return (
    <header className="header">
      <div className="container header__inner">
        <a href="/" className="header__logo">
          <img src={logo} alt="Rainbow Rattles" width="122" height="45" />
        </a>

        <nav id="primary-navigation" className={`header__nav ${menuOpen ? 'is-open' : ''}`}>
          <ul>
            {NAV_LINKS.map(({ label, href }) => (
              <li key={label}><a href={href} onClick={() => setMenuOpen(false)}>{label}</a></li>
            ))}
          </ul>
        </nav>

        <form className="header__search" action="/shop" method="get" role="search">
          <input type="search" name="q" placeholder="Search" aria-label="Search products" defaultValue={searchQuery} />
          <button type="submit" aria-label="Submit search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="white" strokeWidth="2" />
              <path d="M21 21l-4-4" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </form>

        <div className="header__actions">
          <a className="header__icon-btn" href="/cart" aria-label={`Cart, ${cartCount} ${cartCount === 1 ? 'item' : 'items'}`}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 4h2l2.4 12.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 8H6"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="10" cy="21" r="1.4" fill="currentColor" />
              <circle cx="18" cy="21" r="1.4" fill="currentColor" />
            </svg>
            <span className="header__cart-count" aria-hidden="true">{cartCount}</span>
          </a>

          <button
            className="header__burger"
            aria-label="Toggle menu"
            aria-controls="primary-navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
