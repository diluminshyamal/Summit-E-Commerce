import React from "react";
import { Link } from "react-router-dom";
import SearchBar from "../SearchBar/SearchBar";
import "./Header.css"; // Import the CSS file

function Header() {
  return (
    <header className="header">
      <Link to="/" className="logo">
        My E-Commerce
      </Link>
      <SearchBar />
      <nav className="nav">
        <Link to="/products" className="nav-link">
          Products
        </Link>
      </nav>
    </header>
  );
}

export default Header;
