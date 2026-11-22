/* Shared data layer. Agree changes with the group before editing. */
const KEY_CART = "borgs_cart";
const KEY_ORDERS = "borgs_orders";

/* Sample products (Go owns the real product data) */
const SAMPLE_PRODUCTS = [
  { id: "P-001", name: "Full Face Helmet", brand: "Universal", category: "Helmets", description: "Full face helmet with clear visor.", price: 3500, availability: "Available", image: "" },
  { id: "P-002", name: "Drive Chain Set", brand: "Honda", category: "Parts", description: "Chain and sprocket set.", price: 1800, availability: "Available", image: "" },
  { id: "P-003", name: "Brake Disc", brand: "Yamaha", category: "Parts", description: "Front brake disc.", price: 2200, availability: "Available", image: "" },
  { id: "P-004", name: "Sport Tire (Rear)", brand: "Universal", category: "Tires", description: "Rear sport tire.", price: 3000, availability: "Out of Stock", image: "" }
];
const SAMPLE_CART = [
  { id: "P-001", name: "Full Face Helmet", brand: "Universal", price: 3500, qty: 1 },
  { id: "P-002", name: "Drive Chain Set", brand: "Honda", price: 1800, qty: 2 },
  { id: "P-003", name: "Brake Disc", brand: "Yamaha", price: 2200, qty: 1 }
];

const peso = n => "₱" + Number(n).toLocaleString("en-PH", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const _mem = {};
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return k in _mem ? _mem[k] : d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { _mem[k] = v; } }
};

/* Cart API (Go) */
const getCart = () => store.get(KEY_CART, []);
const saveCart = c => store.set(KEY_CART, c);
const cartCount = () => getCart().reduce((s, i) => s + i.qty, 0);
const cartTotal = (c = getCart()) => c.reduce((s, i) => s + i.price * i.qty, 0);
function addToCart(product, qty = 1) {
  const cart = getCart();
  const hit = cart.find(i => i.id === product.id);
  if (hit) hit.qty += qty;
  else cart.push({ id: product.id, name: product.name, brand: product.brand, price: product.price, qty });
  saveCart(cart);
}

/* Order API (Repolidon) */
const getOrders = () => store.get(KEY_ORDERS, []);
const saveOrders = o => store.set(KEY_ORDERS, o);
