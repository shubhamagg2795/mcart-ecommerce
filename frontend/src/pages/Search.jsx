import { useState } from "react";
import { Link } from "react-router-dom";

function Search() {

  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);

  const searchProducts = async () => {

    const res = await fetch(`/api/products?q=${query}`, {
      method: "GET",
      credentials: "include"
    });

    const data = await res.json();
    setProducts(data);
  };

  return (
    <div>

      <h3>Search Products</h3>

      <input
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <button onClick={searchProducts}>
        Search
      </button>

      <div style={{marginTop:"20px"}}>

        {products.map((p) => (
          <div key={p.id} style={{padding:"10px"}}>

            <Link to={`/product/${p.id}`}>
              {p.name}
            </Link>

          </div>
        ))}

      </div>

    </div>
  );
}

export default Search;