import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function Product() {

  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {

    const loadProduct = async () => {

      const res = await fetch(`/api/products/${id}`, {
        method: "GET",
        credentials: "include"
      });

      const data = await res.json();
      setProduct(data);
    };

    loadProduct();

  }, [id]);

  if (!product) {
    return <p>Loading product...</p>;
  }

  return (
    <div>

      <h2>{product.name}</h2>

      <p>{product.description}</p>

      <h3>Price: ${product.price}</h3>

    </div>
  );
}

export default Product;