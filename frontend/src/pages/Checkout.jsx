import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Checkout() {
  const navigate = useNavigate();
  const cart = JSON.parse(localStorage.getItem("mcart-cart") || "[]");
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const total = (subtotal * 1.08 + (subtotal > 50 ? 0 : 9.99)).toFixed(2);

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "",
    phone: "", address: "", city: "", state: "", zip: "", country: "India"
  });

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const handleContinue = (e) => {
    e.preventDefault();
    localStorage.setItem("mcart-shipping", JSON.stringify(form));
    navigate("/payment");
  };

  return (
    <div className="container checkout-page">
      <h2>Checkout</h2>

      {/* Steps indicator */}
      <div className="checkout-steps">
        <div className="step done"><span className="step-num">✓</span> Cart</div>
        <div className="step-divider"/>
        <div className="step active"><span className="step-num">2</span> Shipping</div>
        <div className="step-divider"/>
        <div className="step"><span className="step-num">3</span> Payment</div>
        <div className="step-divider"/>
        <div className="step"><span className="step-num">4</span> Confirmation</div>
      </div>

      <div className="checkout-layout">

        {/* Form */}
        <form className="checkout-form" onSubmit={handleContinue}>
          <h3>Shipping Address</h3>

          <div className="form-row">
            <div className="form-group">
              <label>First Name *</label>
              <input required value={form.firstName} onChange={set("firstName")} placeholder="John"/>
            </div>
            <div className="form-group">
              <label>Last Name *</label>
              <input required value={form.lastName} onChange={set("lastName")} placeholder="Doe"/>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Email *</label>
              <input required type="email" value={form.email} onChange={set("email")} placeholder="john@example.com"/>
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input value={form.phone} onChange={set("phone")} placeholder="+91 98765 43210"/>
            </div>
          </div>

          <div className="form-group">
            <label>Address *</label>
            <input required value={form.address} onChange={set("address")} placeholder="123 Main Street, Apartment 4B"/>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>City *</label>
              <input required value={form.city} onChange={set("city")} placeholder="Mumbai"/>
            </div>
            <div className="form-group">
              <label>State *</label>
              <input required value={form.state} onChange={set("state")} placeholder="Maharashtra"/>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>ZIP Code *</label>
              <input required value={form.zip} onChange={set("zip")} placeholder="400001"/>
            </div>
            <div className="form-group">
              <label>Country</label>
              <select value={form.country} onChange={set("country")}>
                <option>India</option>
                <option>United States</option>
                <option>United Kingdom</option>
                <option>Canada</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn-checkout">
            Continue to Payment →
          </button>
        </form>

        {/* Order summary */}
        <div className="cart-summary">
          <h3>Order Summary</h3>
          {cart.map(item => (
            <div key={item.id} className="summary-row" style={{fontSize:"13px"}}>
              <span>{item.name} × {item.qty}</span>
              <span>${(item.price * item.qty).toFixed(2)}</span>
            </div>
          ))}
          <div className="summary-row total">
            <span>Total</span>
            <span>${total}</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Checkout;
