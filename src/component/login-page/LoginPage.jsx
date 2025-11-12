import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const navigate = useNavigate();
  const baseUrl = "http://192.168.1.5:8080";

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
        console.log(res)
        localStorage.setItem("token", res.data)
         alert('Login Successful!');
         navigate('/catalog');
    }).catch(e => console.log(e))
    console.log('Login data:', form);
   
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username: </label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password: </label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
