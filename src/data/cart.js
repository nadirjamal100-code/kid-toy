const CART_KEY = 'rainbow-rattles-cart';
const initialItems = [];

export function getCartItems() {
  try {
    const saved = localStorage.getItem(CART_KEY);
    if (saved !== null) {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch { /* Use the default cart when storage is unavailable or invalid. */ }
  return initialItems;
}

export function saveCartItems(items) {
  try { localStorage.setItem(CART_KEY, JSON.stringify(items)); } catch { /* Keep the in-memory update usable. */ }
  window.dispatchEvent(new Event('cartchange'));
}

export function addToCart(product, quantity = 1) {
  const id = `${product.title}::${product.image}`;
  const productId = product._id || (typeof product.id === 'string' && /^[a-f0-9]{24}$/i.test(product.id) ? product.id : null);
  const items = getCartItems();
  const match = items.find((item) => item.id === id);
  const next = match
    ? items.map((item) => item.id === id ? { ...item, quantity:item.quantity + quantity } : item)
    : [...items, { id, productId, title:product.title, image:product.image, imageHasBorder:product.imageHasBorder, price:Number(product.price), quantity }];
  saveCartItems(next);
}

export function getCartCount() {
  return getCartItems().reduce((total, item) => total + Math.max(0, Number(item.quantity) || 0), 0);
}

export function subscribeCart(callback) {
  window.addEventListener('cartchange', callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener('cartchange', callback);
    window.removeEventListener('storage', callback);
  };
}
