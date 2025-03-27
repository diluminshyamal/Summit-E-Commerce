import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../services/productService"; // Import the API service
import "./ProductList.css"; // Import the CSS file

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await getProducts();
        setProducts(response.data); // Adjust based on API response structure
      } catch (err) {
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="product-list">
      {products.map((product) => (
        <Link
          to={`/product/${product.id}`}
          key={product.id}
          className="product-card"
        >
          <img
            src={product.image}
            alt={product.name}
            className="product-image"
          />
          <div className="product-card-content">
            <h3 className="product-title">{product.name}</h3>
            <p className="product-price">${product.price}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProductList;
