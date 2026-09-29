import { useMemo, useState } from 'react';
import TopBar from '../components/TopBar/TopBar.jsx';
import Header from '../components/Header/Header.jsx';
import Footer from '../components/Footer/Footer.jsx';
import { getOrdersForEmail, getSignedInUser, signOut, updateAccountDetails } from '../data/auth.js';
import './Account.css';

const emptyAddress = { street:'', city:'', state:'', zip:'' };

function Account() {
  const [user, setUser] = useState(getSignedInUser);
  const [tab, setTab] = useState('overview');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [orders, setOrders] = useState(() => user ? getOrdersForEmail(user.email) : []);
  const [details, setDetails] = useState(() => ({
    name:user?.name || '', email:user?.email || '', phone:user?.phone || '',
    address:{ ...emptyAddress, ...(user?.address || {}) },
    billingAddress:{ ...emptyAddress, ...(user?.billingAddress || {}) },
  }));

  const totalSpent = useMemo(() => orders.reduce((total, order) => total + Number(order.total || 0), 0), [orders]);

  function updateField(event) {
    const { name, value } = event.target;
    if (name.startsWith('address.')) {
      const key = name.split('.')[1];
      setDetails((current) => ({ ...current, address:{ ...current.address, [key]:value } }));
    } else if (name.startsWith('billingAddress.')) {
      const key = name.split('.')[1];
      setDetails((current) => ({ ...current, billingAddress:{ ...current.billingAddress, [key]:value } }));
    } else setDetails((current) => ({ ...current, [name]:value }));
  }

  function saveDetails(event) {
    event.preventDefault();
    setError('');
    setMessage('');
    try {
      const updated = updateAccountDetails(details);
      setUser(updated);
      setDetails((current) => ({ ...current, ...updated }));
      setOrders(getOrdersForEmail(updated.email));
      setMessage('Your account details have been saved.');
    } catch (saveError) {
      setError(saveError.message || 'We could not save your details. Please try again.');
    }
  }

  function leaveAccount() {
    signOut();
    setUser(null);
    window.location.href = '/login';
  }

  const input = (label, name, placeholder = '') => <label className="account-form__field"><span>{label}</span><input name={name} value={name.startsWith('address.') ? details.address[name.split('.')[1]] : name.startsWith('billingAddress.') ? details.billingAddress[name.split('.')[1]] : details[name]} onChange={updateField} placeholder={placeholder} required={name === 'name' || name === 'email'} /></label>;

  return <>
    <TopBar />
    <Header />
    <main className="account-page">
      <div className="account-page__container">
        <nav className="account-page__breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><span>My account</span></nav>
        <div className="account-page__heading"><div><p>Rainbow Rattles</p><h1>My account</h1></div>{user && <button onClick={leaveAccount}>Sign out</button>}</div>
        {!user ? <section className="account-empty"><span aria-hidden="true">♡</span><h2>Sign in to view your account</h2><p>Log in to manage your details and see your orders. Orders placed with your account email will appear here.</p><div><a className="account-button" href="/login">Log in</a><a className="account-button account-button--light" href="/register">Create account</a></div></section> : <div className="account-layout">
          <aside className="account-nav" aria-label="Account sections">
            <div className="account-nav__identity"><span className="account-nav__avatar">{user.name.trim().charAt(0).toUpperCase()}</span><div><strong>{user.name}</strong><span>{user.email}</span></div></div>
            {[['overview','Overview'],['orders','Orders'],['details','Account details']].map(([id,label]) => <button key={id} className={tab === id ? 'is-active' : ''} onClick={() => { setTab(id); setMessage(''); setError(''); }} aria-current={tab === id ? 'page' : undefined}><span aria-hidden="true">{id === 'overview' ? '◫' : id === 'orders' ? '▤' : '♙'}</span>{label}{id === 'orders' && <i>{orders.length}</i>}</button>)}
          </aside>

          <div className="account-content">
            {message && <p className="account-message" role="status">{message}</p>}
            {error && <p className="account-error" role="alert">{error}</p>}

            {tab === 'overview' && <>
              <section className="account-welcome"><p className="account-eyebrow">Your little corner</p><h2>Hi, {user.name.split(' ')[0]}!</h2><p>Manage your account, check your orders, and keep your delivery details up to date.</p></section>
              <div className="account-stats"><article><span>Orders placed</span><strong>{orders.length}</strong></article><article><span>Total spent</span><strong>${totalSpent.toFixed(2)}</strong></article><article><span>Saved addresses</span><strong>{Number(Boolean(details.address.street)) + Number(Boolean(details.billingAddress.street))}</strong></article></div>
              <section className="account-section"><div className="account-section__heading"><div><p className="account-eyebrow">Recently purchased</p><h2>Recent orders</h2></div><button onClick={() => setTab('orders')}>View all</button></div>
                {orders.length ? <OrderList orders={orders.slice(0,2)} /> : <EmptyOrders />}
              </section>
            </>}

            {tab === 'orders' && <section className="account-section"><p className="account-eyebrow">Your purchases</p><h2 className="account-page__section-title">Order history</h2>{orders.length ? <OrderList orders={orders} /> : <EmptyOrders />}</section>}

            {tab === 'details' && <section className="account-section account-details"><p className="account-eyebrow">Your information</p><h2 className="account-page__section-title">Account details</h2><p className="account-details__intro">Keep your contact and delivery details current for your next order.</p>
              <form className="account-form" onSubmit={saveDetails}>
                <div className="account-form__grid">{input('Full name','name','Your name')}{input('Email address','email','you@example.com')}{input('Phone number','phone','Phone number')}</div>
                <div className="account-address-grid">
                  <fieldset><legend>Shipping address</legend>{input('Street address','address.street','Street and number')}<div>{input('City','address.city','City')}{input('State / Region','address.state','State')}</div>{input('ZIP / Postal code','address.zip','ZIP code')}</fieldset>
                  <fieldset><legend>Billing address</legend>{input('Street address','billingAddress.street','Street and number')}<div>{input('City','billingAddress.city','City')}{input('State / Region','billingAddress.state','State')}</div>{input('ZIP / Postal code','billingAddress.zip','ZIP code')}</fieldset>
                </div>
                <button className="account-button account-form__save" type="submit">Save changes</button>
              </form>
            </section>}
          </div>
        </div>}
      </div>
    </main>
    <Footer />
  </>;
}

function OrderList({ orders }) {
  return <div className="account-orders">{orders.map((order) => <article className="account-order" key={order.id}>
    <div className="account-order__top"><div><span>Order number</span><strong>{order.id}</strong></div><div><span>Date</span><strong>{new Date(order.date).toLocaleDateString(undefined,{ year:'numeric', month:'short', day:'numeric' })}</strong></div><span className="account-order__status">{order.status}</span></div>
    <div className="account-order__products">{order.items?.map((item) => <div className="account-order__product" key={`${order.id}-${item.id}`}><img src={item.image} alt=""/><div><strong>{item.title}</strong><span>Qty {item.quantity} · ${Number(item.price).toFixed(2)} each</span></div><b>${(item.price * item.quantity).toFixed(2)}</b></div>)}</div>
    <div className="account-order__total"><span>{order.items?.length || 0} {order.items?.length === 1 ? 'product' : 'products'} · {order.status}</span><strong>Order total: ${Number(order.total).toFixed(2)}</strong></div>
  </article>)}</div>;
}

function EmptyOrders() {
  return <div className="account-orders-empty"><span aria-hidden="true">🧸</span><h3>No orders yet</h3><p>Your purchases will appear here once you place an order using this email address.</p><a href="/shop">Explore the shop</a></div>;
}

export default Account;
