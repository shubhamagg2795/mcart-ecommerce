import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Search() {

  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");

  const navigate = useNavigate();

  const loadProducts = async () => {

    const res = await fetch(`/api/products?q=${query}`);
    const data = await res.json();

    setProducts(data);
  };

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container">

      <div className="search-box">

        <h2>Search Products</h2>

        <input
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <button
          style={{ marginLeft: "10px" }}
          onClick={loadProducts}
        >
          Search
        </button>

      </div>

      <div className="product-grid">

        {products.map((p) => (

          <div
            key={p.id}
            className="product-card"
            onClick={() => navigate(`/product/${p.id}`)}
          >

            <h3>{p.name}</h3>

            <p>{p.description}</p>

            <div className="product-price">
              ${p.price}
            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default Search;