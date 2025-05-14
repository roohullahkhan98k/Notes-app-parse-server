import React, { useState } from 'react';
import Parse from '../../parseConfig';
import { useNavigate } from 'react-router-dom';

import './signup.css';



const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const response = await Parse.Cloud.run("signup", { email, password });
 
      await Parse.User.become(response.sessionToken); 
      
      alert("success " + response.message);
      navigate('/home'); 

    } catch (error) {
      alert("Error: " + error.message);
    }
  };
  

  return (
<div className="auth-container">
  <div className="auth-box">
    <h2>Signup</h2>
    <input type="text" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
    <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
    <button onClick={handleSignup}>Sign Up</button>
    <button onClick={() => navigate('/')}>Already have an account</button>
  </div>
</div>
  );
};

export default Signup;