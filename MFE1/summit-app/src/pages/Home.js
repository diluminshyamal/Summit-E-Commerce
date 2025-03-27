import React from "react";
import "./Home.css"; // Import the CSS file

function Home() {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <h1 className="heading">Welcome to My E-Commerce Store</h1>
        <p className="subheading">
          Explore our latest products and enjoy an amazing shopping experience.
        </p>
        <a href="/products" className="explore-button">
          Explore Products
        </a>
      </section>

      {/* Products Section (Highlighting) */}
      <section className="products-section">
        <div className="product-card">
          <img
            src="https://via.placeholder.com/250"
            alt="Product 1"
            className="product-image"
          />
          <h3 className="product-title">Product 1</h3>
          <p className="product-price">$29.99</p>
        </div>
        <div className="product-card">
          <img
            src="https://via.placeholder.com/250"
            alt="Product 2"
            className="product-image"
          />
          <h3 className="product-title">Product 2</h3>
          <p className="product-price">$49.99</p>
        </div>
        <div className="product-card">
          <img
            src="https://via.placeholder.com/250"
            alt="Product 3"
            className="product-image"
          />
          <h3 className="product-title">Product 3</h3>
          <p className="product-price">$99.99</p>
        </div>
      </section>
    </div>
  );
}

export default Home;
