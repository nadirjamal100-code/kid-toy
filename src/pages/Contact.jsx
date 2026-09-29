import { useState } from 'react';
import TopBar from '../components/TopBar/TopBar.jsx';
import Header from '../components/Header/Header.jsx';
import Footer from '../components/Footer/Footer.jsx';
import contactMap from '../assets/images/contact-map.jpg';
import './Contact.css';

function PhoneIcon() {
  return <svg viewBox="0 0 40 40" aria-hidden="true"><path d="M11 7.5 16 6l4 7-3.5 3a25 25 0 0 0 7.5 7.5l3-3.5 7 4-1.5 5c-.4 1.2-1.6 2-2.9 1.8C18 29.1 10.9 22 9.2 10.4 9 9.1 9.8 7.9 11 7.5Z"/><path d="M24 8c4.4.9 7.1 3.6 8 8M24.5 13c1.8.5 2.8 1.5 3.3 3.3"/></svg>;
}
function EmailIcon() {
  return <svg viewBox="0 0 40 40" aria-hidden="true"><path d="M6 10h28v21H6zM7 12l13 10 13-10"/></svg>;
}
function LocationIcon() {
  return <svg viewBox="0 0 40 40" aria-hidden="true"><path d="M20 34s-10-11.4-10-19a10 10 0 1 1 20 0c0 7.6-10 19-10 19Z"/><circle cx="20" cy="15" r="3.2"/><path d="M8 29H4l-2 6h36l-2-6h-4"/></svg>;
}

const contactCards = [
  { title:'Phone number', value:'123-456-7868', icon:PhoneIcon, href:'tel:1234567868' },
  { title:'Email', value:'Info@example.com', icon:EmailIcon, href:'mailto:info@example.com' },
  { title:'Address place', value:<>1930 marigold lane, way<br />Miami, Florida USA</>, icon:LocationIcon, href:'https://maps.google.com/?q=1930+marigold+lane+Miami+Florida' },
];

function Contact() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSent(true);
    event.currentTarget.reset();
  };

  return <>
    <TopBar />
    <Header />
    <main className="contact-page">
      <div className="contact-container">
        <nav className="contact-breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><span>Contact</span></nav>
        <h1 className="contact-title">Contact</h1>
        <section className="contact-cards" aria-label="Contact information">
          {contactCards.map(({ title, value, icon: Icon, href }) => <a className="contact-card" href={href} key={title} target={title === 'Address place' ? '_blank' : undefined} rel={title === 'Address place' ? 'noreferrer' : undefined}>
            <Icon />
            <h2>{title}</h2>
            <p>{value}</p>
          </a>)}
        </section>
        <section className="contact-main" aria-label="Send us a message">
          <a className="contact-map" href="https://maps.google.com/?q=1930+marigold+lane+Miami+Florida" target="_blank" rel="noreferrer" aria-label="Open the map for 1930 Marigold Lane in Google Maps">
            <img src={contactMap} alt="Map centered on Miami, Florida" />
          </a>
          <div className="contact-form-wrap">
            <h2>Contact Us</h2>
            <form className="contact-form" onSubmit={handleSubmit}>
              <label className="sr-only" htmlFor="contact-name">Your name</label>
              <input id="contact-name" name="name" autoComplete="name" placeholder="Your name" required />
              <label className="sr-only" htmlFor="contact-phone">Phone number</label>
              <input id="contact-phone" name="phone" type="tel" autoComplete="tel" placeholder="Phone number" required />
              <label className="sr-only" htmlFor="contact-email">Email address</label>
              <input id="contact-email" name="email" type="email" autoComplete="email" placeholder="Email address" required />
              <label className="sr-only" htmlFor="contact-message">Write your comment here</label>
              <textarea id="contact-message" name="message" placeholder="Write your comment here..." required />
              <button type="submit">Send</button>
              {sent && <p className="contact-form__success" role="status">Thanks for reaching out! Your message is ready for our team.</p>}
            </form>
          </div>
        </section>
      </div>
    </main>
    <Footer />
  </>;
}

export default Contact;
