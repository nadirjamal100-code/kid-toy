const USERS_KEY = 'rainbow-rattles-users';
const SESSION_KEY = 'rainbow-rattles-session';
const ORDERS_KEY = 'rainbow-rattles-orders';
const HASH_ITERATIONS = 210000;

function readUsers() {
  try {
    const value = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function toBase64(bytes) {
  return btoa(String.fromCharCode(...new Uint8Array(bytes)));
}

async function hashPassword(password, salt) {
  if (!globalThis.crypto?.subtle) throw new Error('Secure sign-in is unavailable in this browser context. Open the site over HTTPS or localhost.');
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name:'PBKDF2', hash:'SHA-256', salt, iterations:HASH_ITERATIONS }, key, 256);
  return toBase64(bits);
}

export async function registerAccount({ name, email, password }) {
  const normalizedEmail = email.trim().toLowerCase();
  const users = readUsers();
  if (users.some((user) => user.email === normalizedEmail)) throw new Error('An account with this email already exists. Please log in.');
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const passwordHash = await hashPassword(password, salt);
  const user = { name:name.trim(), email:normalizedEmail, phone:'', address:{ street:'', city:'', state:'', zip:'' }, billingAddress:{ street:'', city:'', state:'', zip:'' }, salt:toBase64(salt), passwordHash };
  localStorage.setItem(USERS_KEY, JSON.stringify([...users, user]));
  const session = toPublicUser(user);
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

function toPublicUser(user) {
  const emptyAddress = { street:'', city:'', state:'', zip:'' };
  return { name:user.name, email:user.email, phone:user.phone || '', address:user.address || emptyAddress, billingAddress:user.billingAddress || emptyAddress };
}

export async function loginAccount({ email, password }) {
  const normalizedEmail = email.trim().toLowerCase();
  const user = readUsers().find((entry) => entry.email === normalizedEmail);
  if (!user) throw new Error('We couldn’t find an account with that email and password.');
  const passwordHash = await hashPassword(password, Uint8Array.from(atob(user.salt), (char) => char.charCodeAt(0)));
  if (passwordHash !== user.passwordHash) throw new Error('We couldn’t find an account with that email and password.');
  const session = toPublicUser(user);
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function getSignedInUser() {
  try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null'); } catch { return null; }
}

export function updateAccountDetails(details) {
  const session = getSignedInUser();
  if (!session) throw new Error('Please log in to update your account.');
  const users = readUsers();
  const nextEmail = details.email.trim().toLowerCase();
  if (users.some((user) => user.email === nextEmail && user.email !== session.email)) throw new Error('An account with this email already exists.');
  const updatedUsers = users.map((user) => user.email === session.email
    ? { ...user, name:details.name.trim(), email:nextEmail, phone:details.phone.trim(), address:details.address, billingAddress:details.billingAddress }
    : user);
  localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
  if (nextEmail !== session.email) {
    try {
      const orders = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders.map((order) => order.email === session.email ? { ...order, email:nextEmail } : order)));
    } catch { /* Keep profile changes available even if old order data cannot be read. */ }
  }
  const updatedSession = { ...session, name:details.name.trim(), email:nextEmail, phone:details.phone.trim(), address:details.address, billingAddress:details.billingAddress };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(updatedSession));
  return updatedSession;
}

export function saveOrderForEmail(email, order) {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) return;
  let orders = [];
  try {
    const stored = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
    if (Array.isArray(stored)) orders = stored;
  } catch { /* Start a fresh order list if saved data is invalid. */ }
  const id = `RR-${Date.now().toString(36).toUpperCase()}`;
  const newOrder = { ...order, id, email:normalizedEmail, date:new Date().toISOString(), status:'Processing' };
  localStorage.setItem(ORDERS_KEY, JSON.stringify([newOrder, ...orders]));
  return newOrder;
}

export function getOrdersForEmail(email) {
  try {
    const orders = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
    return Array.isArray(orders) ? orders.filter((order) => order.email === email.trim().toLowerCase()) : [];
  } catch { return []; }
}

export function signOut() {
  sessionStorage.removeItem(SESSION_KEY);
}
