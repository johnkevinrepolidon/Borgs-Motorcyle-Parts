// Calls the Spring Boot API (Vite proxies /api to http://localhost:8080, see vite.config.js)
export async function fetchProducts() {
  const res = await fetch("/api/products");
  if (!res.ok) throw new Error("Failed to load products (" + res.status + ")");
  return res.json();
}
