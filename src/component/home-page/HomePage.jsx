import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css'

const HomePage = () => {
  return (
    <div>
      <div className='Authentication-Box'>
        <div className='authentication-child'>
         <h1>Welcome To Archon Library!</h1>
         <Link to="/signup">Sign Up</Link> | <Link to="/login">Login</Link>

        </div>


      </div>
     
    </div>
  );
};

export default HomePage;
