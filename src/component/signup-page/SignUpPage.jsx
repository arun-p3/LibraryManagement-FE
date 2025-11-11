import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAccount } from '../API/library';

const SignUpPage = () => {
  const [form, setForm] = useState({ username: '', password: '', fullName: '', age: '', role: ''});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Sign Up data:', form);

    const accountRequest = {
        fullName: form.fullName,
        userName: form.username,
        age: form.age,
        password: form.password,
        role: 'ADMIN'
    }
    createAccount(accountRequest)
    .then(res => {
        console.log(res.data)
        navigate('/login');
    }).catch(e => console.log(e))
    
    alert('Sign Up Successful!');
    
  };

  return (
   <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Full Name: </label>
          <input
            type="text"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Age: </label>
          <input
            type="number"
            name="age"
            value={form.age}
            onChange={handleChange}
            required
            min="0"
          />
        </div>
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
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUpPage;
