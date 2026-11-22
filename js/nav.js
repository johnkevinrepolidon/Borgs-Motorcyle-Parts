/* Shared top bar and navigation. Add <div id="site-nav"></div>, then load data.js and nav.js. */
(function () {
  const pages = [
    ["index.html", "Home"], ["catalog.html", "Products"], ["about.html", "About"], ["branches.html", "Branches"],
    ["cart.html", "Cart"], ["checkout.html", "Checkout"], ["orders.html", "Order requests"]
  ];
  const here = location.pathname.split("/").pop() || "index.html";
  const count = typeof cartCount === "function" ? cartCount() : 0;
  document.getElementById("site-nav").innerHTML = `
  <div class="top"><span>Matina Aplaya, Davao City</span><span>09561506729</span><span>Facebook: Borgs Motor Parts</span></div>
  <nav><div class="navin"><img src="assets/logo.png" alt="Borgs Motorcycle Parts & Accessories">
  ${pages.map(([h, t]) => `<a class="tab" href="${h}"${h === here ? ' aria-current="page"' : ""}>${t}${h === "cart.html" && count ? ` <span class="pill">${count}</span>` : ""}</a>`).join("")}
  </div></nav>`;
})();
