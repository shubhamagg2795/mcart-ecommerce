import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function Product() {

  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {

    const loadProduct = async () => {

      const res = await fetch(`/api/products/${id}`);
      const data = await res.json();

      setProduct(data);
    };

    loadProduct();

  }, [id]);

  if (!product) {
    return <p>Loading product...</p>;
  }

  return (
    <div className="container">

      <div className="product-detail">

        <h1>{product.name}</h1>

        <p>{product.description}</p>

        <h2 style={{color: "green"}}>
          ${product.price}
        </h2>

        <button style={{marginTop: "20px"}}>
          Add to Cart
        </button>

      </div>

    </div>
  );
}

export default Product;