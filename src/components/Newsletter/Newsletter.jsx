import { useState } from 'react';
import './Newsletter.css';

function Newsletter() {
  const [email, setEmail] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    setEmail('');
  }

  return (
    <section className="section newsletter">
      <div className="container newsletter__inner">
        <h2>Newsletter</h2>
        <p>
          Get 15% off your first purchase! Plus, be the first to know about
          sales, new product launches, and exclusive offers!
        </p>
        <form className="newsletter__form" onSubmit={handleSubmit}>
          <input
            type="email"
            required
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">
            Join
          </button>
        </form>
      </div>
    </section>
  );
}

export default Newsletter;
