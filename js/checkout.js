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

function formHTML() {
  return `<h2>Your details</h2>
    <div class="f"><label for="name">Full name</label><input id="name" autocomplete="name"><div class="err" id="e-name"></div></div>
    <div class="f"><label for="contact">Contact number</label><input id="contact" inputmode="tel" autocomplete="tel" placeholder="09XXXXXXXXX"><div class="err" id="e-contact"></div></div>
    <div class="f"><label>How will you get your order?</label>
      <div class="seg"><label><input type="radio" name="ful" value="Pickup" checked> Pickup</label><label><input type="radio" name="ful" value="Delivery"> Delivery</label></div></div>
    <div class="f" id="addrw" hidden><label for="address">Delivery address</label><textarea id="address" rows="2"></textarea><div class="err" id="e-address"></div></div>
    <div class="f"><label for="notes">Notes (optional)</label><textarea id="notes" rows="2" placeholder="Motorcycle model, preferred time to be contacted"></textarea></div>
    <div class="err" id="e-cart"></div>
    <button class="btn" type="submit">Send order request</button>
    <p class="note">No payment is taken here. Prices are saved as shown at the time of your request.</p>`;
}

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

function bindForm(cart) {
  const form = document.getElementById("form");
  form.querySelectorAll("[name=ful]").forEach(r => {
    r.onchange = () => { document.getElementById("addrw").hidden = form.ful.value !== "Delivery"; };
  });
  form.onsubmit = e => { e.preventDefault(); submitOrder(cart); };
}

function setErr(id, msg) {
  document.getElementById("e-" + id).textContent = msg || "";
  const field = document.getElementById(id);
  if (field) field.classList.toggle("bad", !!msg);
  return !msg;
}

function readForm() {
  return {
    name: document.getElementById("name").value.trim(),
    contact: document.getElementById("contact").value.replace(/[\s-]/g, ""),
    fulfillment: document.querySelector("[name=ful]:checked").value,
    address: document.getElementById("address").value.trim(),
    notes: document.getElementById("notes").value.trim()
  };
}

function validate(data, cart) {
  let ok = true;
  ok = setErr("name", data.name.length < 2 ? "Enter your full name." : "") && ok;
  ok = setErr("contact", /^(09\d{9}|\+639\d{9})$/.test(data.contact) ? "" : "Enter a valid mobile number, like 09561506729.") && ok;
  ok = setErr("address", data.fulfillment === "Delivery" && data.address.length < 5 ? "Enter the delivery address." : "") && ok;
  ok = setErr("cart", cart.length ? "" : "Your cart needs at least one product before you can send a request.") && ok;
  return ok;
}

function submitOrder(cart) {
  const data = readForm();
  if (!validate(data, cart)) return;
  alert("Valid. Saving comes next.");
}

renderCheckout();