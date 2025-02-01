import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import ADashboard from './pages/adashboard';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Donate from './pages/Donate';
import EditProfile from './pages/profile';
import AcceptDonation from './pages/accept';
import VolunteerDonation from './pages/volunteer';
import ContactUs from './pages/contact';
import AboutUs from './pages/about';
import './App.css';  
import api from './api';

function App() {
const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const response = await api.get('/check_session.php');
      setIsLoggedIn(response.data.loggedIn);
    };
    checkSession();
  }, []);

  const handleLogout = async () => {
    await api.post('/logout.php'); // Notify backend to destroy session
    setIsLoggedIn(false);
  };
  return (
    <Router>
      <div className="container mt-4">
        <div className="d-flex justify-content-center align-items-center">
          <img
            className="logo-img"
            src="/assets/logo.jpeg"
            alt="FoodBridge Logo"
          />
          <h1 className="brand-title">FoodBridge</h1>
        </div>
      </div>

    <nav className="navbar navbar-expand-lg navbar-light bg-light">
  <div className="container-fluid">
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarNav">
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link className="nav-link" to="/">Home</Link>
        </li>
 {!isLoggedIn ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login  &nbsp;&nbsp;/</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Register</Link>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link className="nav-link" to="/" onClick={handleLogout}>Logout</Link>
              </li>
            )}
        
         {isLoggedIn ? (
              
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard">Dashboard</Link>
                </li>
                
            ) : (
              <li className="nav-item d-none">
              
              </li>
            )}
        
        <li className="nav-item">
          <Link className="nav-link" to="/donate">Donate</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/about">About Us</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/contact">Contact Us</Link>
        </li>
        {!isLoggedIn ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Admin Login  &nbsp;&nbsp;</Link>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link className="nav-link" to="/adashboard" >Admin Dashboard</Link>
              </li>
            )}     
      </ul>
    </div>
  </div>
</nav>


      <div className="container-fluid m-2">
        <Routes>
          <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/adashboard" element={<ADashboard />} />
           <Route path="/contact" element={<ContactUs />} />
          <Route
          path="/donate"
          element={isLoggedIn ? <Donate /> : <Navigate to="/login" />}
        />
           
            <Route path="/profile" element={<EditProfile />} />
            <Route path="/accept" element={isLoggedIn ?<AcceptDonation />:<Navigate to ="/login"/>} />
            <Route path="/volunteer" element={<VolunteerDonation />} />
             <Route path="/about" element={<AboutUs />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

