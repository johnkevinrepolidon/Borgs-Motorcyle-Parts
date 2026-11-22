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
function summaryHTML(cart) { return "<h2>Order summary</h2><p>Summary goes here.</p>"; }
function bindForm(cart) {}

renderCheckout();