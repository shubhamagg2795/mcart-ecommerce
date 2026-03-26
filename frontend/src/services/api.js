const PRODUCT_API = process.env.REACT_APP_PRODUCT_API || "http://localhost:8080";
const CART_API    = process.env.REACT_APP_CART_API    || "http://localhost:8081";

// ── Timeout Helper ──
const fetchWithTimeout = (url, options = {}, timeout = 3000) => {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("timeout")), timeout)
    )
  ]);
};

// ── Endpoints with fallback ──
const ORDER_ENDPOINTS = [
  process.env.REACT_APP_ORDER_API,
  "http://localhost:8082",
].filter(Boolean);

const PAYMENT_ENDPOINTS = [
  process.env.REACT_APP_PAYMENT_API,
  "http://localhost:8083",
].filter(Boolean);

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
  for (const baseUrl of ORDER_ENDPOINTS) {
    try {
      const res = await fetchWithTimeout(
        `${baseUrl}/api/orders`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderPayload)
        },
        3000
      );
      if (!res.ok) throw new Error("Backend error");
      return res.json();
    } catch (error) {
      console.warn(`${baseUrl} failed, trying next...`);
    }
  }
  // LocalStorage fallback
  const order = {
    ...orderPayload,
    orderId: `ORD-${Date.now()}`,
    status: "CONFIRMED",
    createdAt: new Date().toISOString()
  };
  const existing = JSON.parse(localStorage.getItem("orders") || "[]");
  existing.push(order);
  localStorage.setItem("orders", JSON.stringify(existing));
  return order;
};

export const getOrdersByUser = async (userId) => {
  for (const baseUrl of ORDER_ENDPOINTS) {
    try {
      const res = await fetchWithTimeout(`${baseUrl}/api/orders/user/${userId}`, {}, 3000);
      if (!res.ok) throw new Error("Backend error");
      return res.json();
    } catch (error) {
      console.warn(`${baseUrl} failed, trying next...`);
    }
  }
  // LocalStorage fallback
  const orders = JSON.parse(localStorage.getItem("orders") || "[]");
  return orders.filter(o => o.userId === userId);
};

// ── Payment Service ──
export const processPayment = async (paymentPayload) => {
  for (const baseUrl of PAYMENT_ENDPOINTS) {
    try {
      const res = await fetchWithTimeout(
        `${baseUrl}/api/payments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(paymentPayload)
        },
        3000
      );
      if (!res.ok) throw new Error("Backend error");
      return res.json();
    } catch (error) {
      console.warn(`${baseUrl} failed, trying next...`);
    }
  }
  // Mock fallback
  return {
    paymentId: `PAY-${Date.now()}`,
    status: "SUCCESS",
    amount: paymentPayload.amount,
    method: paymentPayload.method || "CARD",
    timestamp: new Date().toISOString()
  };
};