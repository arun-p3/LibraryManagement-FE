import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAccount } from '../API/library';
import './SignUpPage.css';

const SignUpPage = () => {
  const [form, setForm] = useState({ username: '', password: '', fullName: '', age: '', role: ''});
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); // clear error on change
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const accountRequest = {
        fullName: form.fullName,
        userName: form.username,
        age: form.age,
        password: form.password,
        role: 'ADMIN'
    }

    createAccount(accountRequest)
      .then(res => {
        alert('Sign Up Successful!');
        navigate('/login');
      })
      .catch(err => {
        if (err.response && err.response.data) {
          setError(err.response.data["error message"] || "Sign Up failed.");
        } else {
          setError("Sign Up failed.");
        }
      });
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2 className="signup-title">Create Your Account</h2>

        {error && <div className="error-message">{error}</div>}

        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label>Age</label>
            <input
              type="number"
              name="age"
              value={form.age}
              onChange={handleChange}
              placeholder="Enter your age"
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="signup-btn">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
