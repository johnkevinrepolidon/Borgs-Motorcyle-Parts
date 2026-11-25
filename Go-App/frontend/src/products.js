/*
  Products now come from the Spring Boot API (GET /api/products).

  PRODUCT (JSON from API / Product.java)
  { id, name, brand, category, price, available, description, image, emoji }

  CART ITEM (kept in React; Repolidon's checkout receives this array)
  { id, name, price, image, emoji, qty }
*/
export const CATEGORIES = ["Helmets", "Parts", "Oils", "Accessories"];
