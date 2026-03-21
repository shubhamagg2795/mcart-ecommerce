function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <h3>M<span>CART</span></h3>
            <p>Your one-stop shop for electronics and gadgets. Quality products, great prices, fast delivery.</p>
          </div>
          <div className="footer-col">
            <h4>Shop</h4>
            <ul>
              <li>Smartphones</li>
              <li>Laptops</li>
              <li>Headphones</li>
              <li>Cameras</li>
              <li>Accessories</li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Support</h4>
            <ul>
              <li>FAQ</li>
              <li>Shipping Info</li>
              <li>Returns</li>
              <li>Track Order</li>
              <li>Contact Us</li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              <li>About Us</li>
              <li>Blog</li>
              <li>Careers</li>
              <li>Press</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2025 MCart. All rights reserved.</span>
          <span>Built with React + Spring Boot + AWS</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
