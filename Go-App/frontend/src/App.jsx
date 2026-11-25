import { createContext, useContext, useEffect, useMemo, useReducer, useState } from "react";
import { CATEGORIES } from "./products";
import { fetchProducts } from "./api";
import "./styles.css";

export const peso = (n) => "₱" + n.toLocaleString("en-PH");
const MAX_QTY = 99;
const KEY = "borgs_cart_v1";

/* ---------------- CART STATE (context + reducer) ---------------- */
const loadCart = () => {
  try { const c = JSON.parse(localStorage.getItem(KEY)); return Array.isArray(c) ? c : []; }
  catch { return []; }
};

function cartReducer(state, a) {
  switch (a.type) {
    case "add": {
      const ex = state.find((i) => i.id === a.product.id);
      const qty = a.qty || 1;
      if (ex) return state.map((i) => i.id === ex.id ? { ...i, qty: Math.min(MAX_QTY, i.qty + qty) } : i);
      const { id, name, price, image, emoji } = a.product;
      return [...state, { id, name, price, image, emoji, qty }];
    }
    case "inc": return state.map((i) => i.id === a.id ? { ...i, qty: Math.min(MAX_QTY, i.qty + 1) } : i);
    case "dec": return state.map((i) => i.id === a.id ? { ...i, qty: Math.max(1, i.qty - 1) } : i);
    case "remove": return state.filter((i) => i.id !== a.id);
    case "clear": return [];
    default: return state;
  }
}

const CartCtx = createContext(null);
export const useCart = () => useContext(CartCtx);

function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, [], loadCart);
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(items)); } catch {} }, [items]);
  const count = items.reduce((s, i) => s + i.qty, 0);
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  return <CartCtx.Provider value={{ items, dispatch, count, subtotal }}>{children}</CartCtx.Provider>;
}

/* ---------------- SMALL PIECES ---------------- */
const Thumb = ({ p, size = "md" }) => (
  <div className={`thumb thumb-${size}`}>
    {p.image ? <img src={p.image} alt={p.name} /> : <span aria-hidden="true">{p.emoji}</span>}
  </div>
);

const Stock = ({ ok }) => (
  <span className={`stock ${ok ? "in" : "out"}`}>{ok ? "Available" : "Out of Stock"}</span>
);

const QtyStepper = ({ qty, onDec, onInc }) => (
  <div className="stepper">
    <button onClick={onDec} disabled={qty <= 1} aria-label="Decrease quantity">−</button>
    <span aria-live="polite">{qty}</span>
    <button onClick={onInc} disabled={qty >= MAX_QTY} aria-label="Increase quantity">+</button>
  </div>
);

/* ---------------- HEADER / FOOTER ---------------- */
function Header({ view, go, query, setQuery }) {
  const { count } = useCart();
  return (
    <header className="site-header">
      <div className="topbar">
        <span>📍 Matina Aplaya, Davao City</span>
        <span>📞 09561506729</span>
      </div>
      <div className="navbar">
        <button className="brand" onClick={() => go("catalog")} aria-label="Borgs Motorcycle home">
          {/* Replace this wordmark with your logo file: <img src="/logo.png" alt="Borgs Motorcycle" /> */}
          <span className="brand-main">Borgs Motorcycle</span>
          <span className="brand-sub">Parts &amp; Accessories</span>
        </button>
        <nav className="links" aria-label="Main">
          <button className={view === "catalog" || view === "details" ? "active" : ""} onClick={() => go("catalog")}>Products</button>
          <button className={view === "cart" ? "active" : ""} onClick={() => go("cart")}>Cart</button>
        </nav>
        <div className="search">
          <input
            value={query}
            onChange={(e) => { setQuery(e.target.value); go("catalog"); }}
            placeholder="Search products…"
            aria-label="Search products"
          />
        </div>
        <button className="cart-btn" onClick={() => go("cart")} aria-label={`Cart, ${count} items`}>
          🛒<span className="badge">{count}</span>
        </button>
      </div>
    </header>
  );
}

const Footer = () => (
  <footer className="site-footer">
    <strong>Borgs Motorcycle · Parts &amp; Accessories</strong>
    <span>Matina Aplaya, Davao City · 09561506729 · Facebook: Borgs Motor Parts</span>
    <em>GEAR UP. RIDE ON.</em>
  </footer>
);

/* ---------------- CATALOG ---------------- */
function ProductCard({ p, onOpen, onAdd }) {
  return (
    <article className="card">
      <button className="card-hit" onClick={() => onOpen(p.id)} aria-label={`View ${p.name}`}>
        <Thumb p={p} />
        <h3>{p.name}</h3>
        <p className="meta">{p.brand} · {p.category}</p>
        <p className="price">{peso(p.price)}</p>
      </button>
      <Stock ok={p.available} />
      <button className="btn" disabled={!p.available} onClick={() => onAdd(p)}>
        {p.available ? "🛒 Add to Cart" : "Out of Stock"}
      </button>
    </article>
  );
}

function Catalog({ products, query, onOpen, onAdd }) {
  const [cat, setCat] = useState("All");
  const [brand, setBrand] = useState("All");
  const [sort, setSort] = useState("featured");
  const [onlyAvail, setOnlyAvail] = useState(false);
  const brands = useMemo(() => ["All", ...new Set(products.map((p) => p.brand))], [products]);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    let r = products.filter((p) =>
      (cat === "All" || p.category === cat) &&
      (brand === "All" || p.brand === brand) &&
      (!onlyAvail || p.available) &&
      (!q || [p.name, p.brand, p.category, p.description].some((t) => t.toLowerCase().includes(q)))
    );
    if (sort === "low") r = [...r].sort((a, b) => a.price - b.price);
    if (sort === "high") r = [...r].sort((a, b) => b.price - a.price);
    if (sort === "name") r = [...r].sort((a, b) => a.name.localeCompare(b.name));
    return r;
  }, [products, query, cat, brand, sort, onlyAvail]);

  return (
    <main className="page">
      <section className="hero">
        <p className="hero-kicker">RIDE STRONGER.</p>
        <h1>Parts &amp; accessories for every rider</h1>
        <p>Helmets, genuine-fit parts, oils and gear for Honda, Kawasaki, Yamaha, Suzuki and more.</p>
      </section>

      <div className="chips" role="tablist" aria-label="Categories">
        {["All", ...CATEGORIES].map((c) => (
          <button key={c} className={`chip ${cat === c ? "on" : ""}`} onClick={() => setCat(c)}>{c}</button>
        ))}
      </div>

      <div className="filters">
        <label>Brand
          <select value={brand} onChange={(e) => setBrand(e.target.value)}>
            {brands.map((b) => <option key={b}>{b}</option>)}
          </select>
        </label>
        <label>Sort by
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="featured">Featured</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
            <option value="name">Name A–Z</option>
          </select>
        </label>
        <label className="check">
          <input type="checkbox" checked={onlyAvail} onChange={(e) => setOnlyAvail(e.target.checked)} />
          Available only
        </label>
        <span className="count">{list.length} product{list.length === 1 ? "" : "s"}</span>
      </div>

      {list.length === 0 ? (
        <p className="empty">No products match your search. Try clearing a filter.</p>
      ) : (
        <div className="grid">
          {list.map((p) => <ProductCard key={p.id} p={p} onOpen={onOpen} onAdd={onAdd} />)}
        </div>
      )}
    </main>
  );
}

/* ---------------- PRODUCT DETAILS ---------------- */
function Details({ products, id, onBack, onAdd, onOpen }) {
  const p = products.find((x) => x.id === id);
  const [qty, setQty] = useState(1);
  if (!p) return <main className="page"><p className="empty">Product not found.</p></main>;
  const related = products.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 3);
  return (
    <main className="page">
      <button className="link" onClick={onBack}>← Back to products</button>
      <section className="details">
        <Thumb p={p} size="lg" />
        <div className="info">
          <p className="meta">{p.category} · Fits {p.brand}</p>
          <h1>{p.name}</h1>
          <p className="price big">{peso(p.price)}</p>
          <Stock ok={p.available} />
          <p className="desc">{p.description}</p>
          <dl className="specs">
            <dt>Brand</dt><dd>{p.brand}</dd>
            <dt>Category</dt><dd>{p.category}</dd>
            <dt>Price each</dt><dd>{peso(p.price)}</dd>
            <dt>Total</dt><dd>{peso(p.price * qty)}</dd>
          </dl>
          <div className="buy">
            <QtyStepper qty={qty} onDec={() => setQty((q) => Math.max(1, q - 1))} onInc={() => setQty((q) => Math.min(MAX_QTY, q + 1))} />
            <button className="btn big" disabled={!p.available} onClick={() => onAdd(p, qty)}>
              {p.available ? `🛒 Add to Cart · ${peso(p.price * qty)}` : "Out of Stock"}
            </button>
          </div>
        </div>
      </section>
      {related.length > 0 && (
        <>
          <h2 className="section-title">More in {p.category}</h2>
          <div className="grid">{related.map((r) => <ProductCard key={r.id} p={r} onOpen={onOpen} onAdd={onAdd} />)}</div>
        </>
      )}
    </main>
  );
}

/* ---------------- SHOPPING CART ---------------- */
function Cart({ onShop, onCheckout }) {
  const { items, dispatch, subtotal, count } = useCart();
  if (items.length === 0)
    return (
      <main className="page">
        <h1 className="page-title">Your cart</h1>
        <div className="empty-cart">
          <p>Your cart is empty. Add parts or gear to get started.</p>
          <button className="btn big" onClick={onShop}>Browse Products</button>
        </div>
      </main>
    );
  return (
    <main className="page">
      <h1 className="page-title">Your cart <small>({count} item{count === 1 ? "" : "s"})</small></h1>
      <div className="cart-layout">
        <ul className="cart-list">
          {items.map((i) => (
            <li key={i.id} className="cart-row">
              <Thumb p={i} size="sm" />
              <div className="cart-name">
                <strong>{i.name}</strong>
                <span className="meta">{peso(i.price)} each</span>
              </div>
              <QtyStepper qty={i.qty} onDec={() => dispatch({ type: "dec", id: i.id })} onInc={() => dispatch({ type: "inc", id: i.id })} />
              <span className="line-total">{peso(i.price * i.qty)}</span>
              <button className="remove" onClick={() => dispatch({ type: "remove", id: i.id })} aria-label={`Remove ${i.name}`}>✕</button>
            </li>
          ))}
        </ul>
        <aside className="summary">
          <h2>Order summary</h2>
          <div className="sum-row"><span>Items</span><span>{count}</span></div>
          <div className="sum-row"><span>Estimated subtotal</span><span>{peso(subtotal)}</span></div>
          <div className="sum-row total"><span>Estimated total</span><span>{peso(subtotal)}</span></div>
          <button className="btn big" onClick={onCheckout}>Proceed to Checkout</button>
          <button className="btn ghost" onClick={onShop}>Continue Shopping</button>
          <button className="link danger" onClick={() => dispatch({ type: "clear" })}>Clear cart</button>
        </aside>
      </div>
    </main>
  );
}

/* ---------------- APP ROOT ---------------- */
function Shell() {
  const [view, setView] = useState("catalog");
  const [productId, setProductId] = useState(null);
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState("");
  const { dispatch, items } = useCart();
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading");
  useEffect(() => {
    fetchProducts().then((d) => { setProducts(d); setStatus("ok"); }).catch(() => setStatus("error"));
  }, []);
  const gate = status === "loading" ? "Loading products…"
    : status === "error" ? "Could not load products. Make sure the Spring Boot server is running on port 8080." : null;

  const go = (v) => { setView(v); window.scrollTo({ top: 0 }); };
  const open = (id) => { setProductId(id); go("details"); };
  const add = (p, qty = 1) => {
    dispatch({ type: "add", product: p, qty });
    setToast(`${qty > 1 ? qty + " × " : ""}${p.name} added to cart`);
  };
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(""), 2200); return () => clearTimeout(t); }, [toast]);

  // Repolidon connects here: `items` is the cart array (see products.js for its shape).
  const checkout = () => alert("Checkout is Repolidon’s module.\nCart handed over:\n" + JSON.stringify(items, null, 2));

  return (
    <>
      <Header view={view} go={go} query={query} setQuery={setQuery} />
      {(view === "catalog" || view === "details") && gate && <main className="page"><p className="empty">{gate}</p></main>}
      {view === "catalog" && !gate && <Catalog products={products} query={query} onOpen={open} onAdd={add} />}
      {view === "details" && !gate && <Details products={products} key={productId} id={productId} onBack={() => go("catalog")} onAdd={add} onOpen={open} />}
      {view === "cart" && <Cart onShop={() => go("catalog")} onCheckout={checkout} />}
      <Footer />
      {toast && <div className="toast" role="status">{toast}</div>}
    </>
  );
}

export default function App() {
  return <CartProvider><Shell /></CartProvider>;
}
