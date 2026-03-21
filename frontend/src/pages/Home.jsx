import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../services/api";

const CATEGORIES = [
  { icon: "📱", name: "Smartphones" },
  { icon: "💻", name: "Laptops" },
  { icon: "🎧", name: "Headphones" },
  { icon: "📷", name: "Cameras" },
  { icon: "⌚", name: "Smartwatches" },
  { icon: "🖥️", name: "Monitors" },
  { icon: "⌨️", name: "Keyboards" },
  { icon: "🖱️", name: "Accessories" },
];

const PRODUCT_ICONS = ["📱","💻","🎧","📷","⌚","🖥️","⌨️","🖱️","📟","🔌"];

function Home() {
  const [featured, setFeatured] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getProducts("").then(data => setFeatured(data.slice(0, 8))).catch(() => {});
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate("/search");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div>
      {/* Hero Banner */}
      <section className="hero">
        <h1>Shop the <span>Latest Tech</span></h1>
        <p>Discover thousands of electronics at unbeatable prices</p>
        <div className="hero-search">
          <input
            placeholder="Search smartphones, laptops, headphones..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
      </section>

      {/* Category Strip */}
      <section className="category-strip">
        <div className="container">
          <div className="category-grid">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.name}
                className="category-card"
                onClick={() => navigate(`/search?q=${cat.name.toLowerCase()}`)}
              >
                <div className="category-icon">{cat.icon}</div>
                <div className="category-name">{cat.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Featured Products</h2>
          <div className="product-grid">
            {featured.map((p, i) => (
              <div
                key={p.id}
                className="product-card"
                onClick={() => navigate(`/product/${p.id}`)}
              >
                <div className="product-img-placeholder">
                  {PRODUCT_ICONS[i % PRODUCT_ICONS.length]}
                </div>
                <span className="badge-new">New</span>
                <h3>{p.name}</h3>
                <p>{p.description}</p>
                <div className="product-price">${p.price}</div>
              </div>
            ))}
          </div>
          {featured.length === 0 && (
            <p style={{color:"#888", textAlign:"center", padding:"40px"}}>Loading products...</p>
          )}
          <div style={{textAlign:"center", marginTop:"32px"}}>
            <button className="btn-primary" onClick={() => navigate("/search")}>
              View All Products →
            </button>
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section style={{background:"#0f3460", color:"#fff", padding:"40px 0", textAlign:"center"}}>
        <div className="container">
          <h2 style={{fontSize:"28px", fontWeight:"800", marginBottom:"8px"}}>
            🎉 Special Offer — Up to 30% Off on All Electronics!
          </h2>
          <p style={{color:"#aac", marginBottom:"20px"}}>Limited time offer. Don't miss out.</p>
          <button
            className="btn-add-cart"
            onClick={() => navigate("/search")}
          >
            Shop Now
          </button>
        </div>
      </section>
    </div>
  );
}

export default Home;
