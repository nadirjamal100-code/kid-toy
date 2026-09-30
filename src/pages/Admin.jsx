import { Fragment, useEffect, useMemo, useState } from 'react';
import './Admin.css';

const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');
const API = `${API_ORIGIN}/api`;
const emptyProduct = { title:'', sku:'', barcode:'', brand:'', productType:'', price:'', oldPrice:'', image:'', images:'', description:'', features:'', specifications:'', categories:'', tags:'', ageRange:'', material:'', dimensions:'', weight:'', includedItems:'', safetyInformation:'', stock:'0' };

function Admin() {
  const [token, setToken] = useState(() => sessionStorage.getItem('rr-admin-token') || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [section, setSection] = useState('products');
  const [form, setForm] = useState(emptyProduct);
  const [imageFile, setImageFile] = useState(null);
  const [editing, setEditing] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  async function request(path, options = {}) {
    let response;
    try {
      response = await fetch(`${API}${path}`, { ...options, headers:{ 'Content-Type':'application/json', ...(token ? { Authorization:`Bearer ${token}` } : {}), ...options.headers } });
    } catch {
      const deployed = !['localhost', '127.0.0.1'].includes(window.location.hostname);
      if (deployed && !import.meta.env.VITE_API_URL) throw new Error('Production API URL is not configured. Deploy the backend, set VITE_API_URL in Vercel to the API URL, then redeploy this site.');
      throw new Error(`Backend API is unreachable at ${API_ORIGIN}. Check that the API is deployed and that its FRONTEND_ORIGIN allows this site.`);
    }
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Request failed.');
    return result;
  }
  async function loadProducts() { const result = await request('/products'); setProducts(result.products); }
  async function loadCustomers() { const result = await request('/admin/customers'); setCustomers(result.customers); }
  async function loadOrders() { const result = await request('/admin/orders'); setOrders(result.orders); }
  async function updateOrder(orderId, changes) {
    setError(''); setNotice('');
    try {
      await request(`/admin/orders/${orderId}`, { method:'PATCH', body:JSON.stringify(changes) });
      await loadOrders(); setNotice('Order updated.');
    } catch (e) { setError(e.message); }
  }
  useEffect(() => { if (token) loadProducts().catch((e) => { setError(e.message); if (e.message.includes('session')) setToken(''); }); }, [token]);

  async function login(event) {
    event.preventDefault(); setError('');
    try {
      const result = await request('/admin/login', { method:'POST', body:JSON.stringify({ email, password }) });
      sessionStorage.setItem('rr-admin-token', result.token); setToken(result.token); setPassword('');
    } catch (e) { setError(e.message); }
  }
  async function saveProduct(event) {
    event.preventDefault(); setError(''); setNotice('');
    try {
      let image = form.image;
      if (imageFile) {
        const data = new FormData(); data.append('image', imageFile);
        const response = await fetch(`${API}/admin/uploads`, { method:'POST', headers:{ Authorization:`Bearer ${token}` }, body:data });
        const uploaded = await response.json();
        if (!response.ok) throw new Error(uploaded.error || 'Image upload failed.');
        image = uploaded.url;
      }
      const lines = (value) => value.split('\n').map((entry) => entry.trim()).filter(Boolean);
      const attributes = lines(form.specifications).map((entry) => {
        const separator = entry.indexOf(':');
        return separator < 1 ? null : { name:entry.slice(0, separator).trim(), value:entry.slice(separator + 1).trim() };
      }).filter(Boolean);
      const payload = { ...form, image, images:lines(form.images), features:lines(form.features), attributes, categories:lines(form.categories), tags:lines(form.tags), includedItems:lines(form.includedItems), price:Number(form.price), oldPrice:form.oldPrice === '' ? null : Number(form.oldPrice), stock:Number(form.stock) };
      delete payload.specifications;
      await request(editing ? `/products/${editing}` : '/products', { method:editing ? 'PUT' : 'POST', body:JSON.stringify(payload) });
      setForm(emptyProduct); setImageFile(null); setEditing(''); setNotice('Product saved.'); await loadProducts();
    } catch (e) { setError(e.message); }
  }
  function editProduct(product) {
    setEditing(product._id); setImageFile(null); setForm({
      ...emptyProduct,
      title:product.title || '', sku:product.sku || '', barcode:product.barcode || '', brand:product.brand || '', productType:product.productType || '',
      price:String(product.price), oldPrice:product.oldPrice == null ? '' : String(product.oldPrice), image:product.image || '', images:(product.images || []).join('\n'),
      description:product.description || '', features:(product.features || []).join('\n'), specifications:(product.attributes || []).map(({ name, value }) => `${name}: ${value}`).join('\n'),
      categories:(product.categories || []).join('\n'), tags:(product.tags || []).join('\n'), ageRange:product.ageRange || '', material:product.material || '',
      dimensions:product.dimensions || '', weight:product.weight || '', includedItems:(product.includedItems || []).join('\n'), safetyInformation:product.safetyInformation || '', stock:String(product.stock || 0),
    });
    window.scrollTo({ top:0, behavior:'smooth' });
  }
  async function removeProduct(id) {
    if (!window.confirm('Delete this product?')) return;
    setError(''); setNotice('');
    try { await request(`/products/${id}`, { method:'DELETE' }); setNotice('Product deleted.'); await loadProducts(); }
    catch (e) { setError(e.message); }
  }
  function logout() { sessionStorage.removeItem('rr-admin-token'); setToken(''); setProducts([]); setCustomers([]); setOrders([]); }

  return <main className="admin-page"><header><a href="/">Rainbow Rattles</a><span>Store administration</span>{token && <button onClick={logout}>Sign out</button>}</header>
    {!token ? <form className="admin-login" onSubmit={login}><h1>Admin login</h1><label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label><label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>{error && <p className="admin-error">{error}</p>}<button>Log in</button></form> : <div className="admin-content">
      <nav className="admin-tabs"><button className={section === 'products' ? 'is-active' : ''} onClick={() => { setSection('products'); setError(''); }}>Products</button><button className={section === 'customers' ? 'is-active' : ''} onClick={async () => { setSection('customers'); setError(''); try { await loadCustomers(); } catch (e) { setError(e.message); } }}>Customers</button><button className={section === 'orders' ? 'is-active' : ''} onClick={async () => { setSection('orders'); setError(''); try { await loadOrders(); } catch (e) { setError(e.message); } }}>Orders</button></nav>
      {section === 'products' ? <>
      <h1>Manage products</h1><p>Add a product or edit/remove an existing one. Changes are stored in MongoDB.</p>
      <form className="admin-product-form" onSubmit={saveProduct}><h2>{editing ? 'Edit product' : 'Add product'}</h2>
        <label>Product name<input value={form.title} onChange={(e) => setForm({ ...form, title:e.target.value })} required /></label>
        <div className="admin-form-row"><label>SKU<input value={form.sku} onChange={(e) => setForm({ ...form, sku:e.target.value })} placeholder="Unique stock code" /></label><label>Brand<input value={form.brand} onChange={(e) => setForm({ ...form, brand:e.target.value })} /></label><label>Product type<input value={form.productType} onChange={(e) => setForm({ ...form, productType:e.target.value })} /></label></div>
        <label>Barcode / GTIN<input value={form.barcode} onChange={(e) => setForm({ ...form, barcode:e.target.value })} /></label>
        <div className="admin-form-row"><label>Price<input type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price:e.target.value })} required /></label><label>Old price<input type="number" min="0" step="0.01" value={form.oldPrice} onChange={(e) => setForm({ ...form, oldPrice:e.target.value })} /></label><label>Stock<input type="number" min="0" step="1" value={form.stock} onChange={(e) => setForm({ ...form, stock:e.target.value })} /></label></div>
        <label>Image URL or path<input value={form.image} onChange={(e) => { setForm({ ...form, image:e.target.value }); setImageFile(null); }} placeholder="https://... or /image.jpg" /></label>
        <label>Or upload an image<input type="file" accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp" onChange={(e) => setImageFile(e.target.files?.[0] || null)} /><small>JPG, PNG, or WebP · up to 5 MB{imageFile ? ` · Selected: ${imageFile.name}` : ''}</small></label>
        <label>Additional image URLs <small>One URL per line</small><textarea rows="3" value={form.images} onChange={(e) => setForm({ ...form, images:e.target.value })} /></label>
        <label>Description<textarea rows="3" value={form.description} onChange={(e) => setForm({ ...form, description:e.target.value })} /></label>
        <label>Key features <small>One feature per line</small><textarea rows="4" value={form.features} onChange={(e) => setForm({ ...form, features:e.target.value })} /></label>
        <label>Specifications <small>One “Name: value” pair per line, for example Material: Beech wood</small><textarea rows="4" value={form.specifications} onChange={(e) => setForm({ ...form, specifications:e.target.value })} /></label>
        <div className="admin-form-row"><label>Age range<input value={form.ageRange} onChange={(e) => setForm({ ...form, ageRange:e.target.value })} placeholder="e.g. 2–5 years" /></label><label>Material<input value={form.material} onChange={(e) => setForm({ ...form, material:e.target.value })} /></label><label>Dimensions<input value={form.dimensions} onChange={(e) => setForm({ ...form, dimensions:e.target.value })} placeholder="L × W × H" /></label></div>
        <div className="admin-form-row"><label>Package weight<input value={form.weight} onChange={(e) => setForm({ ...form, weight:e.target.value })} /></label><label>Categories <small>One per line</small><textarea rows="2" value={form.categories} onChange={(e) => setForm({ ...form, categories:e.target.value })} /></label><label>Search tags <small>One per line</small><textarea rows="2" value={form.tags} onChange={(e) => setForm({ ...form, tags:e.target.value })} /></label></div>
        <label>What's included <small>One item per line</small><textarea rows="3" value={form.includedItems} onChange={(e) => setForm({ ...form, includedItems:e.target.value })} /></label>
        <label>Safety information<textarea rows="3" value={form.safetyInformation} onChange={(e) => setForm({ ...form, safetyInformation:e.target.value })} placeholder="Warnings, certifications, age restrictions" /></label>
        {error && <p className="admin-error">{error}</p>}{notice && <p className="admin-notice">{notice}</p>}
        <div className="admin-actions"><button type="submit">{editing ? 'Save changes' : 'Add product'}</button>{editing && <button type="button" className="secondary" onClick={() => { setEditing(''); setForm(emptyProduct); setImageFile(null); }}>Cancel</button>}</div>
      </form>
      <section className="admin-product-list"><h2>Products ({products.length})</h2>{products.length === 0 ? <p>No products in the database yet.</p> : products.map((product) => <article key={product._id}><div>{product.image && <img src={product.image} alt="" />}<div><strong>{product.title}</strong><span>{product.sku ? `SKU ${product.sku} · ` : ''}{product.brand ? `${product.brand} · ` : ''}${Number(product.price).toFixed(2)} · stock {product.stock}</span></div></div><aside><button onClick={() => editProduct(product)}>Edit</button><button className="danger" onClick={() => removeProduct(product._id)}>Delete</button></aside></article>)}</section>
      </> : section === 'customers' ? <CustomersPanel customers={customers} error={error} /> : <OrdersPanel orders={orders} error={error} notice={notice} onUpdate={updateOrder} />}
    </div>}
  </main>;
}

function CustomersPanel({ customers, error }) {
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState('');
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return customers.filter((customer) => !query || [customer.name, customer.email, customer.phone].some((value) => String(value || '').toLowerCase().includes(query)));
  }, [customers, search]);
  const repeatCustomers = customers.filter((customer) => Number(customer.orderCount) > 1).length;
  const lifetimeValue = customers.reduce((sum, customer) => sum + Number(customer.lifetimeValue || 0), 0);

  return <section className="admin-management"><div className="admin-section-heading"><div><h1>Customers</h1><p>Customer accounts, order activity, and saved addresses.</p></div><span>{customers.length} total</span></div>
    {error && <p className="admin-error">{error}</p>}
    <div className="admin-summary-cards"><article><span>All customers</span><strong>{customers.length}</strong></article><article><span>Repeat customers</span><strong>{repeatCustomers}</strong></article><article><span>Lifetime order value</span><strong>${lifetimeValue.toFixed(2)}</strong></article></div>
    <div className="admin-toolbar"><label>Search customers<input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Name, email, or phone" /></label><span>{filtered.length} results</span></div>
    {!filtered.length ? <p className="admin-empty">{customers.length ? 'No customers match this search.' : 'No customers have registered yet.'}</p> : <div className="admin-table-wrap"><table className="admin-data-table"><thead><tr><th>Customer</th><th>Contact</th><th>Orders</th><th>Lifetime value</th><th>Joined</th><th>Details</th></tr></thead><tbody>{filtered.map((customer) => <Fragment key={customer._id}>
      <tr key={customer._id}><td><strong>{customer.name}</strong><small>Customer ID · {String(customer._id).slice(-8).toUpperCase()}</small></td><td>{customer.email}<small>{customer.phone || 'No phone'}</small></td><td>{Number(customer.orderCount || 0)}</td><td>${Number(customer.lifetimeValue || 0).toFixed(2)}</td><td>{new Date(customer.createdAt).toLocaleDateString()}</td><td><button className="admin-text-button" onClick={() => setExpandedId(expandedId === customer._id ? '' : customer._id)}>{expandedId === customer._id ? 'Hide' : 'View'}</button></td></tr>
      {expandedId === customer._id && <tr className="admin-expanded-row" key={`${customer._id}-details`}><td colSpan="6"><div className="admin-customer-details"><div><b>Saved delivery address</b><span>{customer.address?.street || 'No street saved'}</span><span>{[customer.address?.city, customer.address?.state, customer.address?.postalCode].filter(Boolean).join(', ') || 'No city or postal code saved'}</span></div><div><b>Last order</b><span>{customer.lastOrderAt ? new Date(customer.lastOrderAt).toLocaleString() : 'No orders yet'}</span></div><div><b>Billing address</b><span>{customer.billingAddress?.street || 'Same as delivery / not saved'}</span></div></div></td></tr>}
    </Fragment>)}</tbody></table></div>}
  </section>;
}

function OrdersPanel({ orders, error, notice, onUpdate }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [expandedId, setExpandedId] = useState('');
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return orders.filter((order) => {
      const contact = order.customerDetails || {};
      const matchesSearch = !query || [order._id, contact.firstName, contact.lastName, contact.email, contact.phone, ...(order.items || []).map((item) => item.title)].some((value) => String(value || '').toLowerCase().includes(query));
      return matchesSearch && (statusFilter === 'All' || order.status === statusFilter) && (paymentFilter === 'All' || (order.paymentStatus || 'Pending') === paymentFilter);
    });
  }, [orders, search, statusFilter, paymentFilter]);
  const revenue = orders.filter((order) => order.status !== 'Cancelled').reduce((sum, order) => sum + Number(order.total || 0), 0);
  const pending = orders.filter((order) => order.status === 'Processing').length;
  const shipped = orders.filter((order) => order.status === 'Shipped').length;

  return <section className="admin-management"><div className="admin-section-heading"><div><h1>Orders</h1><p>Search, review, and update customer orders.</p></div><span>{orders.length} total</span></div>
    {error && <p className="admin-error">{error}</p>}{notice && <p className="admin-notice">{notice}</p>}
    <div className="admin-summary-cards"><article><span>Order value</span><strong>${revenue.toFixed(2)}</strong></article><article><span>Needs processing</span><strong>{pending}</strong></article><article><span>In transit</span><strong>{shipped}</strong></article></div>
    <div className="admin-toolbar admin-toolbar--orders"><label>Search orders<input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Order ID, customer, email, product" /></label><label>Status<select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>{['All','Processing','Shipped','Delivered','Cancelled'].map((value) => <option key={value}>{value}</option>)}</select></label><label>Payment<select value={paymentFilter} onChange={(event) => setPaymentFilter(event.target.value)}>{['All','Pending','Paid','Failed','Refunded'].map((value) => <option key={value}>{value}</option>)}</select></label><span>{filtered.length} results</span></div>
    {!filtered.length ? <p className="admin-empty">{orders.length ? 'No orders match these filters.' : 'No orders have been placed yet.'}</p> : <div className="admin-table-wrap"><table className="admin-data-table admin-order-table"><thead><tr><th>Order</th><th>Customer</th><th>Date</th><th>Total</th><th>Payment</th><th>Order status</th><th>Details</th></tr></thead><tbody>{filtered.map((order) => {
      const contact = order.customerDetails || {};
      const address = order.shippingAddress || {};
      return <Fragment key={order._id}>
        <tr><td><strong>#{String(order._id).slice(-8).toUpperCase()}</strong><small>{order.items?.length || 0} item types</small></td><td>{contact.firstName || order.customer?.name || 'Customer'} {contact.lastName || ''}<small>{contact.email || order.customer?.email || ''}</small></td><td>{new Date(order.createdAt).toLocaleDateString()}</td><td><strong>${Number(order.total).toFixed(2)}</strong></td><td><span className="admin-payment-method">{order.paymentMethod === 'cod' ? 'Cash on delivery' : order.paymentMethod || '—'}</span><select aria-label="Payment status" value={order.paymentStatus || 'Pending'} onChange={(event) => onUpdate(order._id, { paymentStatus:event.target.value })}>{['Pending','Paid','Failed','Refunded'].map((value) => <option key={value}>{value}</option>)}</select></td><td><select aria-label="Order status" value={order.status} onChange={(event) => onUpdate(order._id, { status:event.target.value })}>{['Processing','Shipped','Delivered','Cancelled'].map((value) => <option key={value}>{value}</option>)}</select></td><td><button className="admin-text-button" onClick={() => setExpandedId(expandedId === order._id ? '' : order._id)}>{expandedId === order._id ? 'Hide' : 'View'}</button></td></tr>
        {expandedId === order._id && <tr className="admin-expanded-row" key={`${order._id}-details`}><td colSpan="7"><div className="admin-order-expanded"><section><h3>Delivery details</h3><p>{contact.firstName} {contact.lastName}</p><p>{contact.email}</p><p>{contact.phone}</p><p>{address.street}</p><p>{[address.city, address.state, address.postalCode].filter(Boolean).join(', ')}</p>{order.orderNotes && <p><b>Notes:</b> {order.orderNotes}</p>}</section><section><h3>Items</h3>{(order.items || []).map((item, index) => <p key={index}>{item.title} × {item.quantity} <b>${(Number(item.price) * Number(item.quantity)).toFixed(2)}</b></p>)}<p>Subtotal ${Number(order.subtotal).toFixed(2)} · Shipping ${Number(order.shipping).toFixed(2)}</p><strong>Total ${Number(order.total).toFixed(2)}</strong></section></div></td></tr>}
      </Fragment>;
    })}</tbody></table></div>}
  </section>;
}

export default Admin;
