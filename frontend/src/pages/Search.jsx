import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getProducts } from "../services/api";

const PRODUCT_ICONS = ["📱","💻","🎧","📷","⌚","🖥️","⌨️","🖱️","📟","🔌"];

function Search() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const navigate = useNavigate();

  const loadProducts = async (q) => {
    setLoading(true);
    try {
      const data = await getProducts(q || "");
      setProducts(data);
    } catch (e) {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const q = searchParams.get("q") || "";
    setQuery(q);
    loadProducts(q);
  }, [searchParams]);

  const handleSearch = () => {
    setSearchParams(query ? { q: query } : {});
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="container search-page">

      <h2 style={{fontSize:"26px", fontWeight:"800", marginBottom:"20px"}}>
        {query ? `Results for "${query}"` : "All Products"}
      </h2>

      {/* Search bar */}
      <div className="search-bar">
        <input
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="btn-primary" onClick={handleSearch}>
          Search
        </button>
        {query && (
          <button
            className="btn-primary"
            style={{background:"#888"}}
            onClick={() => { setQuery(""); setSearchParams({}); }}
          >
            Clear
          </button>
        )}
      </div>

      {/* Results count */}
      {!loading && (
        <p className="results-count">
          {products.length} product{products.length !== 1 ? "s" : ""} found
        </p>
      )}

      {/* Grid */}
      {loading ? (
        <p style={{textAlign:"center", color:"#888", padding:"48px"}}>Loading products...</p>
      ) : (
        <div className="product-grid">
          {products.map((p, i) => (
            <div
              key={p.id}
              className="product-card"
              onClick={() => navigate(`/product/${p.id}`)}
            >
              <div className="product-img-placeholder">
                {PRODUCT_ICONS[i % PRODUCT_ICONS.length]}
              </div>
              <h3>{p.name}</h3>
              <p>{p.description}</p>
              <div className="product-price">${p.price}</div>
            </div>
          ))}

          {products.length === 0 && (
            <div style={{gridColumn:"1/-1", textAlign:"center", padding:"64px", color:"#888"}}>
              <div style={{fontSize:"48px", marginBottom:"16px"}}>🔍</div>
              <h3 style={{fontSize:"20px", color:"#444"}}>No products found</h3>
              <p>Try a different search term</p>
            </div>
          )}
        </div>
      )}

    </div>
  );
}

export default Search;
