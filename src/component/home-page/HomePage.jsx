import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="homepage-container">
      <div className="auth-card">
        <h1 className="auth-title">Welcome To Archonite Library!</h1>
        <p className="auth-subtitle">Your gateway to a world of knowledge</p>
        <div className="auth-buttons">
          <Link to="/signup" className="auth-btn signup-btn">Sign Up</Link>
          <Link to="/login" className="auth-btn login-btn">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
