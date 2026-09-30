const API = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`;
const SESSION_KEY = 'rainbow-rattles-session';

async function api(path, { token, ...options } = {}) {
  const response = await fetch(`${API}${path}`, {
    ...options,
    headers:{ 'Content-Type':'application/json', ...(token ? { Authorization:`Bearer ${token}` } : {}), ...options.headers },
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || 'The request could not be completed.');
  return result;
}
function saveSession(result) {
  const session = { token:result.token, user:result.customer };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return result.customer;
}
function readSession() {
  try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null'); } catch { return null; }
}

export async function registerAccount({ name, email, password }) {
  return saveSession(await api('/auth/register', { method:'POST', body:JSON.stringify({ name, email, password }) }));
}
export async function loginAccount({ email, password }) {
  return saveSession(await api('/auth/login', { method:'POST', body:JSON.stringify({ email, password }) }));
}
export function getSignedInUser() { return readSession()?.user || null; }
export async function updateAccountDetails(details) {
  const session = readSession();
  if (!session?.token) throw new Error('Please log in to update your account.');
  const result = await api('/account', { method:'PATCH', token:session.token, body:JSON.stringify(details) });
  session.user = result.customer;
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return result.customer;
}
export async function saveOrderForEmail(_email, order) {
  const session = readSession();
  if (!session?.token) throw new Error('Please log in before placing an order.');
  const items = order.items.map((item) => ({ productId:item.productId || null, title:item.title, image:item.image, price:item.price, quantity:item.quantity }));
  const result = await api('/orders', { method:'POST', token:session.token, body:JSON.stringify({ items, shippingAddress:order.shippingAddress || {}, paymentMethod:order.paymentMethod || 'card' }) });
  return { ...result.order, id:result.order._id, date:result.order.createdAt };
}
export async function getOrdersForEmail(_email) {
  const session = readSession();
  if (!session?.token) return [];
  const result = await api('/orders', { token:session.token });
  return result.orders.map((order) => ({ ...order, id:order._id, date:order.createdAt, items:order.items.map((item) => ({ ...item, id:item.product, image:item.image || '' })) }));
}
export function signOut() { sessionStorage.removeItem(SESSION_KEY); }
