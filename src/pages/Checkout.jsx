import { useState } from 'react';
import TopBar from '../components/TopBar/TopBar.jsx';
import Header from '../components/Header/Header.jsx';
import Footer from '../components/Footer/Footer.jsx';
import { getCartItems, saveCartItems } from '../data/cart.js';
import { saveOrderForEmail } from '../data/auth.js';
import './Checkout.css';

const PAYMENT_MARKS = ['VISA', 'mastercard', 'AMEX', 'DISCOVER', 'UnionPay'];

function PaymentMarks() {
  return <div className="checkout__payment-marks" aria-label="Accepted cards">
    {PAYMENT_MARKS.map((mark) => <span key={mark} className={`checkout__payment-mark checkout__payment-mark--${mark.toLowerCase()}`}>{mark === 'mastercard' ? <><i /><i /></> : mark === 'UnionPay' ? <b>{mark}</b> : mark}</span>)}
  </div>;
}

function Checkout() {
  const [items, setItems] = useState(getCartItems);
  const [payment, setPayment] = useState('card');
  const [sameBilling, setSameBilling] = useState(true);
  const [placedOrder, setPlacedOrder] = useState(null);
  const subtotal = placedOrder?.subtotal ?? items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = placedOrder?.shipping ?? (items.length ? 20 : 0);
  const total = placedOrder?.total ?? subtotal + shipping;
  const orderItems = placedOrder?.items ?? items;

  function placeOrder(event) {
    event.preventDefault();
    if (!items.length) return;
    const email = String(new FormData(event.currentTarget).get('email') || '');
    const order = saveOrderForEmail(email, {
      items:items.map(({ id, title, image, price, quantity }) => ({ id, title, image, price, quantity })),
      subtotal, shipping, total,
    });
    setPlacedOrder(order);
    setItems([]);
    saveCartItems([]);
  }

  const field = (label, placeholder, options = {}) => (
    <label className={`checkout__field${options.wide ? ' checkout__field--wide' : ''}`}>
      <span>{label} *</span>
      {options.select ? <select required defaultValue=""><option value="" disabled>{placeholder}</option>{options.values.map((value) => <option key={value}>{value}</option>)}</select> : options.textarea ? <textarea placeholder={placeholder} /> : <input required type={options.type || 'text'} placeholder={placeholder} />}
    </label>
  );

  return <>
    <TopBar />
    <Header />
    <main className="checkout-page">
      <div className="checkout__container">
        <nav className="checkout__breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><span>Checkout</span></nav>
        <h1>Check out</h1>
        {placedOrder && <p className="checkout__success" role="status">Order {placedOrder.id} placed successfully. You can review it in <a href="/account">My account</a>.</p>}
        <div className="checkout__layout">
          <div className="checkout__left">
            <section className="checkout__panel checkout__delivery" aria-labelledby="delivery-heading">
              <h2 id="delivery-heading">Delivery info</h2>
              <form id="checkout-form" onSubmit={placeOrder}>
                <div className="checkout__fields">
                  {field('First name', 'Join')}
                  {field('Last name', 'Gray')}
                  {field('Street address', 'Address', { wide:true })}
                  {field('Town / City', 'City', { select:true, values:['New York','Los Angeles','Chicago','Houston','Other'] })}
                  {field('State', 'State', { select:true, values:['New York','California','Illinois','Texas','Other'] })}
                  {field('ZIP code', 'Zip code')}
                  {field('Phone', '(1230) 456-7868', { type:'tel' })}
                  <label className="checkout__field checkout__field--wide"><span>Email address *</span><input name="email" type="email" autoComplete="email" placeholder="Example@youremail.com" required /></label>
                  {field('Order notes (optional)', 'Notes about your order, e.g. special notes for delivery.', { textarea:true, wide:true })}
                </div>
              </form>
            </section>

            <section className="checkout__panel checkout__payment" aria-labelledby="payment-heading">
              <h2 id="payment-heading">Payment</h2>
              <p className="checkout__secure">All transactions are secure and encrypted.</p>
              <label className="checkout__payment-option">
                <input type="radio" name="payment" value="card" checked={payment === 'card'} onChange={() => setPayment('card')} />
                <span>Credit card</span><PaymentMarks />
              </label>
              {payment === 'card' && <div className="checkout__card-fields">
                <input aria-label="Card number" placeholder="Card number" inputMode="numeric" />
                <input aria-label="Name on card" placeholder="Name on card" />
                <div><input aria-label="Expiration date" placeholder="Expiration date (MM/YY)" /><input aria-label="Security code" placeholder="Security code" inputMode="numeric" /></div>
              </div>}
              {!sameBilling && <div className="checkout__billing-fields"><h3>Billing address</h3><div className="checkout__fields">{field('Street address', 'Address', { wide:true })}{field('Town / City', 'City')}{field('ZIP code', 'Zip code')}</div></div>}
              <label className="checkout__check"><input type="checkbox" checked={sameBilling} onChange={(event) => setSameBilling(event.target.checked)} /><span>Use shipping address as billing address</span></label>
              <label className="checkout__payment-option checkout__paypal"><input type="radio" name="payment" value="paypal" checked={payment === 'paypal'} onChange={() => setPayment('paypal')} /><span>PayPal</span></label>
              <button className="checkout__place-order" type="submit" form="checkout-form" disabled={!items.length}>Place order</button>
            </section>
          </div>

          <aside className="checkout__panel checkout__order" aria-labelledby="order-heading">
            <h2 id="order-heading">Your order</h2>
            <div className="checkout__items">
              {orderItems.length ? orderItems.map((item) => <div className="checkout__item" key={item.id}>
                <div className="checkout__item-image"><img src={item.image} alt="" /></div>
                <div className="checkout__item-info"><p>{item.title}</p><span>Amount : {item.quantity}</span></div>
                <strong>${(item.price * item.quantity).toFixed(2)}</strong>
              </div>) : <p className="checkout__empty">Your cart is empty. <a href="/shop">Continue shopping</a></p>}
            </div>
            <div className="checkout__totals">
              <p><span>Subtotal</span><strong>${subtotal.toFixed(2)}</strong></p>
              <p><span>Shipping</span><strong>${shipping.toFixed(2)}</strong></p>
              <p className="checkout__grand-total"><span>Total</span><strong>${total.toFixed(2)}</strong></p>
            </div>
          </aside>
        </div>
      </div>
    </main>
    <Footer />
  </>;
}

export default Checkout;
