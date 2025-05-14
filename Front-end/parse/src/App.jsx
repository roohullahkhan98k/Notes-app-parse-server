import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './pages/Login/login';
import Signup from './pages/SignUp/signup';
import Home from './pages/Home/home';
import AdminPanel from './pages/admin/AdminPanel';
import UserNotesPage from './pages/admin/UserNotesPage';
import Layout from './components/Layout';
import Analytics from './pages/analytics/analytics';
import UserProfile from './pages/UserProfile/UserProfile';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Layout role="user"><Home /></Layout>} />
        <Route path="/userprofile" element={<Layout role="user"><UserProfile /></Layout>} />
  
        
 
 
        <Route path="/admin" element={<Layout role="admin"><AdminPanel /></Layout>} />
        <Route path="/user-notes/:userId" element={<Layout  role="admin"><UserNotesPage /></Layout>} />
        <Route path="/analytics" element={<Layout  role="admin"><Analytics /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;
