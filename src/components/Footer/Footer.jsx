import logo from '../../assets/images/logo-brand.png';
import './Footer.css';

const SOCIALS = [
  {
    name: 'Instagram',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.7" cy="6.7" r="1" className="footer__social-dot" />
      </svg>
    ),
  },
  {
    name: 'Twitter',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M22 5.9a8.1 8.1 0 0 1-2.4.7 4.2 4.2 0 0 0 1.8-2.3 8.4 8.4 0 0 1-2.7 1 4.2 4.2 0 0 0-7.2 3.8 12 12 0 0 1-8.7-4.4 4.2 4.2 0 0 0 1.3 5.6 4.1 4.1 0 0 1-1.9-.5v.1a4.2 4.2 0 0 0 3.4 4.1 4.2 4.2 0 0 1-1.9.1 4.2 4.2 0 0 0 3.9 2.9A8.5 8.5 0 0 1 2 18.8 12 12 0 0 0 20.5 8.7v-.6A8.6 8.6 0 0 0 22 5.9Z" />
      </svg>
    ),
  },
  {
    name: 'Facebook',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.5-1.5h1.7V4a22 22 0 0 0-2.5-.1c-2.5 0-4.1 1.5-4.1 4.2V10H7.5v3h2.6v8z" />
      </svg>
    ),
  },
  {
    name: 'Pinterest',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2a10 10 0 0 0-3.6 19.3c0-.8 0-1.8.2-2.7l1.3-5.5s-.3-.6-.3-1.5c0-1.4.8-2.4 1.8-2.4.9 0 1.3.7 1.3 1.5 0 .9-.6 2.3-.9 3.6-.3 1.1.6 2 1.7 2 2.1 0 3.5-2.7 3.5-5.9 0-2.4-1.6-4.2-4.6-4.2-3.3 0-5.3 2.5-5.3 5.2 0 1 .3 1.8.8 2.3.2.2.2.3.1.6l-.3 1.1c-.1.4-.3.5-.7.3-1.5-.6-2.2-2.2-2.2-4 0-3 2.6-6.6 7.8-6.6 4.2 0 7 3 7 6.3 0 4.3-2.4 7.6-6 7.6-1.2 0-2.3-.7-2.7-1.4l-.8 3.1c-.3 1-.8 1.9-1.2 2.6A10 10 0 1 0 12 2Z" />
      </svg>
    ),
  },
];

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <a href="#home" className="footer__logo">
            <img src={logo} alt="Rainbow Rattles" width="122" height="45" />
          </a>
          <p>Nunc consequat interdum varius sit amet mattis.</p>
          <div className="footer__socials">
          {SOCIALS.map(({ name, icon }) => (
            <a href={`#${name.toLowerCase()}`} key={name} aria-label={name}>
              {icon}
              </a>
            ))}
          </div>
        </div>

        <div className="footer__col">
          <h4>My account</h4>
          <ul>
            <li><a href="#track">Track my order</a></li>
            <li><a href="#terms">Terms of use</a></li>
            <li><a href="#wishlist">Wishlist</a></li>
            <li><a href="#feedback">Submit Your feedback</a></li>
            <li><a href="/faq">FAQs</a></li>
          </ul>
        </div>

        <div className="footer__col">
          <h4>Customer service</h4>
          <ul className="footer__service">
            <li>Monday to Friday</li>
            <li>10am - 6pm( NewYork time)</li>
            <li>Call us: <a href="tel:1234567888">123-456-7888</a></li>
            <li>Email us: <a href="mailto:info@example.com">info@example.com</a></li>
          </ul>
        </div>
      </div>
      <p className="footer__credit">Website Developed By Nadir Jamal</p>
    </footer>
  );
}

export default Footer;
