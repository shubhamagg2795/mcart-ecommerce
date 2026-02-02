import { useParams } from "react-router-dom";

function Product() {
  const { id } = useParams();
  return <h3>Product Details for ID: {id}</h3>;
}

export default Product;
