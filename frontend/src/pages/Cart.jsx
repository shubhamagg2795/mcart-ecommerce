import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import { getCart, updateCartQtyAPI, removeFromCartAPI } from "../services/api";

const PRODUCT_ICONS = ["📱","💻","🎧","📷","⌚","🖥️","⌨️","🖱️","📟","🔌"];

function Cart() {
  const navigate = useNavigate();
  const auth = useAuth();
  const userId = auth.user?.profile?.sub || "guest";

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const data = await getCart(userId);
      setCart(data);
    } catch (e) {
      setCart({ items: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCart(); }, []);

  const updateQty = async (productId, delta) => {
    const item = cart.items.find(i => i.productId === productId);
    if (!item) return;
    const newQty = item.qty + delta;
    try {
      const updated = await updateCartQtyAPI(userId, productId, newQty);
      setCart(updated);
    } catch (e) {}
  };

  const removeItem = async (productId) => {
    try {
      const updated = await removeFromCartAPI(userId, productId);
      setCart(updated);
    } catch (e) {}
  };

  if (loading) return (
    <div style={{textAlign:"center", padding:"64px", color:"#888"}}>
      Loading cart...
    </div>
  );

  const items = cart?.items || [];
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  // Save total for checkout/payment pages
  localStorage.setItem("mcart-cart-total", total.toFixed(2));
  localStorage.setItem("mcart-cart-items", JSON.stringify(items));

  if (items.length === 0) {
    return (
      <div className="container cart-page">
        <h2>Shopping Cart</h2>
        <div className="cart-empty">
          <div className="empty-icon">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Looks like you haven't added anything yet.</p>
          <button className="btn-primary" style={{marginTop:"20px"}} onClick={() => navigate("/search")}>
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container cart-page">
      <h2>Shopping Cart ({items.length} item{items.length !== 1 ? "s" : ""})</h2>

      <div className="cart-layout">
        <div className="cart-items">
          {items.map((item, i) => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-img">
                {PRODUCT_ICONS[i % PRODUCT_ICONS.length]}
              </div>
              <div className="cart-item-info">
                <h4>{item.name}</h4>
                <p>${item.price} each</p>
                <div className="qty-controls">
                  <button className="qty-btn" onClick={() => updateQty(item.productId, -1)}>−</button>
                  <span style={{fontWeight:"700"}}>{item.qty}</span>
                  <button className="qty-btn" onClick={() => updateQty(item.productId, 1)}>+</button>
                  <button className="btn-remove" onClick={() => removeItem(item.productId)}>Remove</button>
                </div>
              </div>
              <div className="cart-item-price">${(item.price * item.qty).toFixed(2)}</div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span><span>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
          </div>
          <div className="summary-row">
            <span>Tax (8%)</span><span>${tax.toFixed(2)}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span><span>${total.toFixed(2)}</span>
          </div>
          <button className="btn-checkout" onClick={() => navigate("/checkout")}>
            Proceed to Checkout →
          </button>
          <button
            style={{width:"100%", background:"none", border:"none", color:"#0f3460",
              fontWeight:"600", marginTop:"12px", cursor:"pointer", fontSize:"14px"}}
            onClick={() => navigate("/search")}
          >
            ← Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
