import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import { getProductById, addToCartAPI } from "../services/api";

const PRODUCT_ICONS = ["📱","💻","🎧","📷","⌚","🖥️","⌨️","🖱️","📟","🔌"];

function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const auth = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [toast, setToast] = useState("");
  const [adding, setAdding] = useState(false);

  const userId = auth.user?.profile?.sub || "guest";

  useEffect(() => {
    getProductById(id)
      .then(setProduct)
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const addToCart = async () => {
    setAdding(true);
    try {
      await addToCartAPI(userId, product.id, product.name, product.price, qty);
      showToast(`✅ ${product.name} added to cart!`);
    } catch (err) {
      showToast("❌ Failed to add to cart. Try again.");
    } finally {
      setAdding(false);
    }
  };

  const buyNow = async () => {
    await addToCart();
    navigate("/cart");
  };

  if (loading) return <div style={{textAlign:"center", padding:"64px", color:"#888"}}>Loading product...</div>;

  if (!product) return (
    <div style={{textAlign:"center", padding:"64px", color:"#888"}}>
      <div style={{fontSize:"48px"}}>😕</div>
      <h3>Product not found</h3>
      <button className="btn-primary" style={{marginTop:"16px"}} onClick={() => navigate("/search")}>
        Back to search
      </button>
    </div>
  );

  const iconIndex = Math.abs(product.id?.charCodeAt(0) || 0) % PRODUCT_ICONS.length;

  return (
    <div className="container pdp-page">

      <div className="pdp-breadcrumb">
        <span onClick={() => navigate("/")}>Home</span>
        &nbsp;/&nbsp;
        <span onClick={() => navigate("/search")}>Products</span>
        &nbsp;/&nbsp;
        {product.name}
      </div>

      <div className="pdp-card">
        <div className="pdp-img">{PRODUCT_ICONS[iconIndex]}</div>

        <div className="pdp-info">
          <h1>{product.name}</h1>
          <div className="price">${product.price}</div>
          <p className="desc">{product.description}</p>

          <div style={{marginBottom:"20px", color:"#f0a500", fontSize:"18px"}}>
            ★★★★☆
            <span style={{color:"#888", fontSize:"13px", marginLeft:"8px"}}>4.2 (128 reviews)</span>
          </div>

          <div style={{display:"flex", alignItems:"center", gap:"12px", marginBottom:"20px"}}>
            <span style={{fontWeight:"600", fontSize:"14px"}}>Quantity:</span>
            <div className="qty-controls">
              <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
              <span style={{fontWeight:"700", fontSize:"16px", minWidth:"24px", textAlign:"center"}}>{qty}</span>
              <button className="qty-btn" onClick={() => setQty(q => q + 1)}>+</button>
            </div>
          </div>

          <div style={{marginBottom:"20px"}}>
            <span style={{
              background:"#e8f5e9", color:"#2a7d2e",
              padding:"4px 12px", borderRadius:"20px",
              fontSize:"13px", fontWeight:"600"
            }}>✓ In Stock</span>
          </div>

          <div className="pdp-actions">
            <button className="btn-add-cart" onClick={addToCart} disabled={adding}>
              {adding ? "Adding..." : "🛒 Add to Cart"}
            </button>
            <button className="btn-buy-now" onClick={buyNow} disabled={adding}>
              Buy Now
            </button>
          </div>
        </div>
      </div>

      <div style={{background:"#fff", borderRadius:"12px", padding:"28px", marginTop:"24px"}}>
        <h3 style={{fontWeight:"700", marginBottom:"16px"}}>Product Details</h3>
        <table style={{width:"100%", borderCollapse:"collapse", fontSize:"14px"}}>
          <tbody>
            {[
              ["Product ID", product.id],
              ["Name", product.name],
              ["Price", `$${product.price}`],
              ["Category", product.name.split(" ")[0]],
              ["Availability", "In Stock"],
              ["Shipping", "Free delivery on orders over $50"],
            ].map(([label, val]) => (
              <tr key={label} style={{borderBottom:"1px solid #f0f0f0"}}>
                <td style={{padding:"10px 0", color:"#666", width:"200px"}}>{label}</td>
                <td style={{padding:"10px 0", fontWeight:"600"}}>{val}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

export default Product;
