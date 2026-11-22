# Borgs Motorcycle Parts

Website for Borgs Motorcycle Parts & Accessories, Matina Aplaya, Davao City. Plain HTML, CSS and JavaScript (no build step): open any `.html` file in a browser, or use the VS Code Live Server extension.

## Workload

| Member | Modules | Files | Branch |
|---|---|---|---|
| Canoy | Home, About Us, Branch Information | `index.html`, `about.html`, `branches.html` | `feature/home-about-branches` |
| Go | Product Catalog, Product Details, Shopping Cart | `catalog.html`, `product.html`, `cart.html` | `feature/catalog-cart` |
| Repolidon | Checkout, Order Submission, Order Review | `checkout.html`, `orders.html`, `css/checkout.css`, `js/checkout.js`, `js/orders.js` | `feature/checkout` |

Each member replaces the placeholder content inside `<main>` of their own pages.

## Shared files (tell the group before editing)

- `css/styles.css`: brand colors, fonts, buttons, navigation, cards
- `js/data.js`: data structures, sample data, storage helpers
- `js/nav.js`: shared top bar and navigation, loaded on every page
- `assets/`: logo and header cover

## Shared data structures

- **Product** (Go): `{ id, name, brand, category, description, price, availability, image }`, availability is `"Available"` or `"Out of Stock"`
- **Cart item** (Go): `{ id, name, brand, price, qty }`, stored with `getCart()` / `saveCart()` in `js/data.js`
- **Order** (Repolidon): `{ id, createdAt, status, customer:{name, contact, fulfillment, address, notes}, items:[{id, name, brand, unitPrice, qty, lineTotal}], total }`, stored with `getOrders()` / `saveOrders()`

Go: call `addToCart(product, qty)` from the catalog and product pages, and checkout picks the items up automatically.

## Brand and UI

Red `#E30613`, dark red `#8B0000`, black `#000000`, charcoal `#2A2A2A`, white `#FFFFFF`. Fonts: Exo 2 (headings), Montserrat (body), Orbitron (numbers and labels). Primary buttons are red and pill-shaped; navigation is black/charcoal with a red active underline.

## Git workflow

1. `git checkout main` then `git pull origin main`
2. `git checkout -b feature/<your-module>`
3. `git add .` then `git commit -m "Describe your change"`
4. `git push -u origin feature/<your-module>`
5. Open a Pull Request into `main` and have a groupmate review it before merging.

Never commit directly to `main` after the setup pushes. Pull before each session.
