import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import { processPayment, placeOrder, clearCartAPI } from "../services/api";

function Payment() {
  const navigate = useNavigate();
  const auth = useAuth();
  const userId = auth.user?.profile?.sub || "guest";

  const total   = localStorage.getItem("mcart-cart-total") || "0.00";
  const items   = JSON.parse(localStorage.getItem("mcart-cart-items") || "[]");
  const shipping = JSON.parse(localStorage.getItem("mcart-shipping") || "{}");

  const [method, setMethod] = useState("card");
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [processing, setProcessing] = useState(false);

  const setField = (f) => (e) => setCard(c => ({ ...c, [f]: e.target.value }));

  const formatCardNumber = (val) =>
    val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

  const handlePay = async (e) => {
    e.preventDefault();
    setProcessing(true);

    try {
      // Step 1 — Place order
      const orderPayload = {
        userId,
        items: items.map(i => ({
          productId: i.productId,
          name: i.name,
          price: i.price,
          qty: i.qty
        })),
        shippingAddress: shipping,
        total: parseFloat(total),
        status: "CONFIRMED"
      };

      const order = await placeOrder(orderPayload);

      // Step 2 — Process payment
      const paymentPayload = {
        orderId: order.id,
        userId,
        amount: parseFloat(total),
        method: method.toUpperCase()
      };

      const payment = await processPayment(paymentPayload);

      // Step 3 — Clear cart
      await clearCartAPI(userId);

      // Step 4 — Save confirmation data and navigate
      localStorage.setItem("mcart-last-order", JSON.stringify({
        orderId: order.id,
        transactionId: payment.transactionId,
        items,
        total,
        shipping,
        placedAt: new Date().toISOString()
      }));

      localStorage.removeItem("mcart-cart-items");
      localStorage.removeItem("mcart-cart-total");

      navigate("/order-confirmation");

    } catch (err) {
      alert("Payment failed: " + err.message);
    } finally {
      setProcessing(false);
    }
  };

  const maskedNumber = card.number
    ? card.number.replace(/\d(?=.{4})/g, "•")
    : "•••• •••• •••• ••••";

  return (
    <div className="container payment-page">

      <div className="checkout-steps" style={{marginBottom:"28px"}}>
        <div className="step done"><span className="step-num">✓</span> Cart</div>
        <div className="step-divider"/>
        <div className="step done"><span className="step-num">✓</span> Shipping</div>
        <div className="step-divider"/>
        <div className="step active"><span className="step-num">3</span> Payment</div>
        <div className="step-divider"/>
        <div className="step"><span className="step-num">4</span> Confirmation</div>
      </div>

      <div style={{display:"grid", gridTemplateColumns:"1fr 340px", gap:"28px"}}>
        <div>
          <div className="payment-methods" style={{marginBottom:"24px"}}>
            {["card","upi","netbanking"].map(m => (
              <button
                key={m}
                className={`payment-method-btn ${method === m ? "active" : ""}`}
                onClick={() => setMethod(m)}
                type="button"
              >
                {m === "card" && "💳 Card"}
                {m === "upi" && "📱 UPI"}
                {m === "netbanking" && "🏦 Net Banking"}
              </button>
            ))}
          </div>

          {method === "card" && (
            <div className="payment-card">
              <div className="card-visual">
                <div className="card-chip">💳</div>
                <div className="card-number" style={{fontFamily:"monospace", letterSpacing:"3px"}}>
                  {maskedNumber}
                </div>
                <div className="card-bottom">
                  <span>{card.name || "CARD HOLDER"}</span>
                  <span>{card.expiry || "MM/YY"}</span>
                </div>
              </div>

              <form onSubmit={handlePay}>
                <div className="form-group">
                  <label>Card Number</label>
                  <input required maxLength={19}
                    value={card.number}
                    onChange={(e) => setCard(c => ({...c, number: formatCardNumber(e.target.value)}))}
                    placeholder="1234 5678 9012 3456"
                    style={{fontFamily:"monospace", letterSpacing:"2px"}}
                  />
                </div>
                <div className="form-group">
                  <label>Cardholder Name</label>
                  <input required value={card.name} onChange={setField("name")} placeholder="John Doe"/>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Expiry</label>
                    <input required value={card.expiry} onChange={setField("expiry")} placeholder="MM/YY" maxLength={5}/>
                  </div>
                  <div className="form-group">
                    <label>CVV</label>
                    <input required type="password" value={card.cvv} onChange={setField("cvv")} placeholder="•••" maxLength={4}/>
                  </div>
                </div>
                <button type="submit" className="btn-pay" disabled={processing}>
                  {processing ? "⏳ Processing..." : `Pay $${total}`}
                </button>
              </form>
            </div>
          )}

          {method === "upi" && (
            <div className="payment-card">
              <h2>UPI Payment</h2>
              <div className="form-group">
                <label>UPI ID</label>
                <input placeholder="yourname@upi"/>
              </div>
              <button className="btn-pay" onClick={handlePay} disabled={processing}>
                {processing ? "⏳ Processing..." : `Pay $${total}`}
              </button>
            </div>
          )}

          {method === "netbanking" && (
            <div className="payment-card">
              <h2>Net Banking</h2>
              <div className="form-group">
                <label>Select Bank</label>
                <select>
                  <option>SBI</option><option>HDFC</option>
                  <option>ICICI</option><option>Axis Bank</option>
                </select>
              </div>
              <button className="btn-pay" onClick={handlePay} disabled={processing}>
                {processing ? "⏳ Processing..." : `Pay $${total}`}
              </button>
            </div>
          )}
        </div>

        <div className="cart-summary" style={{alignSelf:"start"}}>
          <h3>Order Summary</h3>
          {items.map(item => (
            <div key={item.productId || item.id} className="summary-row" style={{fontSize:"13px"}}>
              <span>{item.name} × {item.qty}</span>
              <span>${(item.price * item.qty).toFixed(2)}</span>
            </div>
          ))}
          <div className="summary-row total">
            <span>Total</span><span>${total}</span>
          </div>
          <div style={{marginTop:"16px", fontSize:"12px", color:"#888", lineHeight:"1.6"}}>
            🔒 Secured with 256-bit SSL
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
