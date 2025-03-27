import React from "react";
import { useParams } from "react-router-dom";
import "./ProductDetails.css";

const products = [
  {
    id: 1,
    name: "Product 1",
    price: 29.99,
    image: "placeholder1.jpg",
    description: "This is product 1",
  },
  {
    id: 2,
    name: "Product 2",
    price: 49.99,
    image: "placeholder2.jpg",
    description: "This is product 2",
  },
];

function ProductDetails() {
  const { productId } = useParams();
  const product = products.find((p) => p.id === parseInt(productId));

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="product-details">
      <img className="product-image" src={product.image} alt={product.name} />
      <h2 className="product-name">{product.name}</h2>
      <p className="product-price">${product.price}</p>
      <p className="product-description">{product.description}</p>
    </div>
  );
}

export default ProductDetails;
