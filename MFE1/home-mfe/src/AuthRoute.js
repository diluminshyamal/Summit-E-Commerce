import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthRoute = ({ children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken"); // Check for auth token

  useEffect(() => {
    // If the token is not present, redirect to the login page
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  // If token is present, render the children (protected route)
  return token ? children : null;
};

export default AuthRoute;
