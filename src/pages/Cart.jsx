import { useState } from 'react';
import TopBar from '../components/TopBar/TopBar.jsx';
import Header from '../components/Header/Header.jsx';
import Footer from '../components/Footer/Footer.jsx';
import { getCartItems, saveCartItems } from '../data/cart.js';
import './Cart.css';

function getItemSubtotal(item) {
  return item.price * item.quantity;
}

function getCartProductHref(item) {
  const slug = item.id === 'blocks' ? 'blocks-shape-sorting-toy' : `${item.id}-toy`;
  const params = new URLSearchParams({
    title:item.title,
    price:String(item.price),
    rating:'0',
    sale:'false',
    image:item.image,
  });
  if (item.imageHasBorder) params.set('imageHasBorder', 'true');
  return `/product/${slug}?${params.toString()}`;
}

function Cart() {
  const [items, setItems] = useState(getCartItems);
  const [couponInput, setCouponInput] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponMessage, setCouponMessage] = useState('');
  const [updated, setUpdated] = useState(false);

  const changeQuantity = (id, change) => {
    setItems((current) => {
      const next = current.map((item) => item.id === id
      ? { ...item, quantity:Math.max(1, item.quantity + change) }
      : item);
      saveCartItems(next);
      return next;
    });
    setUpdated(false);
  };

  const removeItem = (id) => {
    setItems((current) => {
      const next = current.filter((item) => item.id !== id);
      saveCartItems(next);
      return next;
    });
    setUpdated(false);
  };

  const subtotal = items.reduce((sum, item) => sum + getItemSubtotal(item), 0);
  const discount = couponApplied ? Math.round(subtotal * 0.1) : 0;
  const total = Math.max(0, subtotal + (items.length ? 20 : 0) - discount);

  const applyCoupon = () => {
    if (couponInput.trim().toUpperCase() === 'SAVE10') {
      setCouponApplied(true);
      setCouponMessage('Coupon applied: 10% off.');
    } else {
      setCouponApplied(false);
      setCouponMessage(couponInput.trim() ? 'Enter a valid coupon code.' : 'Enter a coupon code.');
    }
  };

  return (
    <>
      <TopBar />
      <Header />
      <main className="cart-page">
        <div className="cart-page__container">
          <nav className="cart-page__breadcrumb" aria-label="Breadcrumb">
            <a href="/">Home</a><span aria-hidden="true">/</span><span>Your shopping cart</span>
          </nav>
          <h1>Your Cart</h1>

          <section className="cart-table" aria-label="Shopping cart items">
            <div className="cart-table__head" aria-hidden="true">
              <span>Product</span><span>Price</span><span>Quantity</span><span>Subtotal</span><span>Action</span>
            </div>
            {items.length ? items.map((item) => (
              <div className="cart-row" key={item.id}>
                <div className="cart-row__product">
                  <a className={`cart-row__image${item.imageHasBorder ? ' cart-row__image--image-bordered' : ''}`} href={getCartProductHref(item)}>
                    <img className={item.imageHasBorder ? 'has-image-border' : ''} src={item.image} alt={item.title} />
                  </a>
                  <a className="cart-row__title" href={getCartProductHref(item)}>{item.title}</a>
                </div>
                <span className="cart-row__price" data-label="Price">${item.price}.00</span>
                <div className="cart-row__quantity" data-label="Quantity">
                  <button aria-label={`Decrease ${item.title} quantity`} onClick={() => changeQuantity(item.id, -1)}>−</button>
                  <output aria-live="polite">{item.quantity}</output>
                  <button aria-label={`Increase ${item.title} quantity`} onClick={() => changeQuantity(item.id, 1)}>+</button>
                </div>
                <span className="cart-row__subtotal" data-label="Subtotal">${getItemSubtotal(item)}.00</span>
                <button className="cart-row__remove" aria-label={`Remove ${item.title}`} onClick={() => removeItem(item.id)}>
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 5 14 14M19 5 5 19" /></svg>
                </button>
              </div>
            )) : <p className="cart-table__empty">Your cart is empty. <a href="/shop">Continue shopping</a></p>}
          </section>

          <div className="cart-tools">
            <form className="cart-coupon" onSubmit={(event) => { event.preventDefault(); applyCoupon(); }}>
              <label className="sr-only" htmlFor="cart-coupon-code">Coupon code</label>
              <input id="cart-coupon-code" value={couponInput} onChange={(event) => setCouponInput(event.target.value)} placeholder="Coupon code" />
              <button type="submit">Apply</button>
              {couponMessage && <span className="cart-coupon__message" role="status">{couponMessage}</span>}
            </form>
            <div className="cart-tools__buttons">
              <a className="cart-button cart-button--continue" href="/shop">Continue Shopping</a>
              <button className="cart-button cart-button--update" onClick={() => setUpdated(true)}>Update Cart</button>
            </div>
          </div>
          {updated && <p className="cart-page__updated" role="status">Cart updated.</p>}

          <section className="cart-total" aria-labelledby="cart-total-title">
            <h2 id="cart-total-title">Cart total</h2>
            <div className="cart-total__line"><span>Subtotal</span><strong>${subtotal.toFixed(2)}</strong></div>
            {couponApplied && <div className="cart-total__line cart-total__discount"><span>Discount</span><strong>−${discount.toFixed(2)}</strong></div>}
            <div className="cart-total__line"><span>Total</span><strong>${total.toFixed(2)}</strong></div>
            <a className="cart-total__checkout" href="/checkout">Proceed to checkout</a>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Cart;
