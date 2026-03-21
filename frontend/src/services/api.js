const PRODUCT_API = process.env.REACT_APP_PRODUCT_API || "http://localhost:8080";
const CART_API    = process.env.REACT_APP_CART_API    || "http://localhost:8081";
const ORDER_API   = process.env.REACT_APP_ORDER_API   || "http://localhost:8082";
const PAYMENT_API = process.env.REACT_APP_PAYMENT_API || "http://localhost:8083";

// ── Product Service ──
export const getProducts = async (query = "") => {
  const res = await fetch(`${PRODUCT_API}/api/products?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
};

export const getProductById = async (id) => {
  const res = await fetch(`${PRODUCT_API}/api/products/${id}`);
  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
};

export const getBackendVersion = async () => {
  const res = await fetch(`${PRODUCT_API}/api/version`);
  if (!res.ok) throw new Error("Failed to fetch version");
  return res.text();
};

// ── Cart Service ──
export const getCart = async (userId) => {
  const res = await fetch(`${CART_API}/api/cart/${userId}`);
  if (!res.ok) throw new Error("Failed to fetch cart");
  return res.json();
};

export const addToCartAPI = async (userId, productId, name, price, qty = 1) => {
  const res = await fetch(`${CART_API}/api/cart/${userId}/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId, name, price, qty })
  });
  if (!res.ok) throw new Error("Failed to add to cart");
  return res.json();
};

export const updateCartQtyAPI = async (userId, productId, qty) => {
  const res = await fetch(`${CART_API}/api/cart/${userId}/items/${productId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ qty })
  });
  if (!res.ok) throw new Error("Failed to update qty");
  return res.json();
};

export const removeFromCartAPI = async (userId, productId) => {
  const res = await fetch(`${CART_API}/api/cart/${userId}/items/${productId}`, {
    method: "DELETE"
  });
  if (!res.ok) throw new Error("Failed to remove from cart");
  return res.json();
};

export const clearCartAPI = async (userId) => {
  await fetch(`${CART_API}/api/cart/${userId}`, { method: "DELETE" });
};

// ── Order Service ──
export const placeOrder = async (orderPayload) => {
  const res = await fetch(`${ORDER_API}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderPayload)
  });
  if (!res.ok) throw new Error("Failed to place order");
  return res.json();
};

export const getOrdersByUser = async (userId) => {
  const res = await fetch(`${ORDER_API}/api/orders/user/${userId}`);
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
};

// ── Payment Service ──
export const processPayment = async (paymentPayload) => {
  const res = await fetch(`${PAYMENT_API}/api/payments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(paymentPayload)
  });
  if (!res.ok) throw new Error("Payment failed");
  return res.json();
};
