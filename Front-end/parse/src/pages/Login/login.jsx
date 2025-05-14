import React, { useState, useEffect } from "react";
import Parse from "../../parseConfig";
import { useNavigate } from "react-router-dom";

import "./login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const Navigate = useNavigate();

  useEffect(() => {
    const currentUser = Parse.User.current();
    if (currentUser && currentUser.get("role") === "admin") {
      Parse.User.logOut();
    }
  }, []);
  
  useEffect(() => {
    const handlePopState = () => {
      const currentUser = Parse.User.current();
      if (currentUser && currentUser.get("role") === "admin") {
        Parse.User.logOut();
      }
    };
  
    window.addEventListener('popstate', handlePopState);
  
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const handleLogin = async () => {
    try {
      const response = await Parse.Cloud.run("login", { email, password });
      await Parse.User.become(response.sessionToken);
      if (response.user.role === "admin") {
        Navigate("/admin");
      } else {
        Navigate("/home");
      }
    } catch (error) {
      alert(" " + error.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Login</h2>
        <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
        <button onClick={() => Navigate("/signup")}>Signup</button>
      </div>
    </div>
  );
};

export default Login;