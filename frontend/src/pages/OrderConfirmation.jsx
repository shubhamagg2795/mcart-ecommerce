import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function OrderConfirmation() {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("mcart-last-order");
    if (stored) setOrder(JSON.parse(stored));
  }, []);

  if (!order) {
    return (
      <div className="container confirmation-page">
        <div className="confirmation-card">
          <p>No order found.</p>
          <button className="btn-continue" onClick={() => navigate("/")}>Go Home</button>
        </div>
      </div>
    );
  }

  const placed = new Date(order.placedAt).toLocaleString("en-IN", {
    dateStyle:"medium", timeStyle:"short"
  });

  return (
    <div className="container confirmation-page">
      <div className="confirmation-card">

        <div className="check-icon">✓</div>

        <h2>Order Placed Successfully!</h2>
        <p className="order-id">Order ID: <strong>{order.orderId}</strong></p>
        <p style={{color:"#888", marginBottom:"24px", fontSize:"14px"}}>
          Placed on {placed}
        </p>

        <div className="order-summary-box">
          {order.items.map(item => (
            <div key={item.id} className="order-summary-row">
              <span className="label">{item.name} × {item.qty}</span>
              <span className="val">${(item.price * item.qty).toFixed(2)}</span>
            </div>
          ))}
          <div className="order-summary-row" style={{marginTop:"8px"}}>
            <span className="label" style={{fontWeight:"700"}}>Total Paid</span>
            <span className="val" style={{color:"#2a7d2e", fontSize:"18px"}}>${order.total}</span>
          </div>
        </div>

        {order.shipping?.address && (
          <div style={{
            background:"#f9f9f9", borderRadius:"10px", padding:"16px",
            marginBottom:"24px", textAlign:"left", fontSize:"14px", color:"#555"
          }}>
            <strong style={{color:"#333", display:"block", marginBottom:"6px"}}>
              📦 Delivering to:
            </strong>
            {order.shipping.firstName} {order.shipping.lastName}<br/>
            {order.shipping.address}, {order.shipping.city}<br/>
            {order.shipping.state} - {order.shipping.zip}, {order.shipping.country}
          </div>
        )}

        <div style={{
          background:"#e8f5e9", borderRadius:"8px", padding:"12px 16px",
          marginBottom:"24px", fontSize:"13px", color:"#2a7d2e", fontWeight:"600"
        }}>
          📧 A confirmation email has been sent to {order.shipping?.email}
        </div>

        <button className="btn-continue" onClick={() => navigate("/")}>
          Continue Shopping
        </button>

      </div>
    </div>
  );
}

export default OrderConfirmation;
