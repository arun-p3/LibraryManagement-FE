import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoginPage.css';

const LoginPage = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const navigate = useNavigate();
  const baseUrl = "http://localhost:8080";

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const loginRequest = {
        userName: form.username,
        password: form.password,
        role: 'ADMIN'
    }
    axios.post(`${baseUrl}/v1/login/sign-in`, loginRequest)
      .then(res => {
        localStorage.setItem("token", res.data);
        alert('Login Successful!');
        navigate('/catalog');
      })
      .catch(e => {
        console.error(e);
        alert(e.response.data["error message"]);
      });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Sign In</h2>
        <form className="login-form" onSubmit={handleSubmit}>
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
          <button type="submit" className="login-btn">Login</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
