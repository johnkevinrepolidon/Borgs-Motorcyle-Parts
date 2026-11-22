const app = document.getElementById("app");

function renderCheckout() {
  const cart = getCart();
  app.innerHTML = `
    <h1>Checkout</h1>
    <p class="lead">Send your order request and the Borgs team will contact you to confirm availability and payment.</p>
    <div class="grid">
      <form class="card" id="form" novalidate>${formHTML()}</form>
      <aside class="card">${summaryHTML(cart)}</aside>
    </div>`;
  bindForm(cart);
}

function formHTML() { return "<h2>Your details</h2><p>Form goes here.</p>"; }

function loadSample() { saveCart(SAMPLE_CART); renderCheckout(); }
function clearCart() { saveCart([]); renderCheckout(); }

function summaryHTML(cart) {
  const lines = cart.length
    ? cart.map(i => `<div class="line"><div><strong>${esc(i.name)}</strong><small>${esc(i.brand)} · ${peso(i.price)} × ${i.qty}</small></div><span class="price">${peso(i.price * i.qty)}</span></div>`).join("")
    : `<div class="empty"><strong>Your cart is empty.</strong><br>Add at least one product before sending an order request.</div>`;
  return `<h2>Order summary</h2>${lines}
    <div class="total"><span>Estimated total</span><span class="price">${peso(cartTotal(cart))}</span></div>
    <p class="demo">Demo tools (until Go’s cart is connected):
      <button type="button" onclick="loadSample()">Load sample cart</button>
      <button type="button" onclick="clearCart()">Empty the cart</button></p>`;
}

function bindForm(cart) {}

renderCheckout();