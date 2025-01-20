import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(''); // Default role
  const [contactNumber, setContactNumber] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post('/register.php', {
        name,
        email,
        password,
        role,
        contact_number: contactNumber, 
      });
      setMessage(response.data.message);
      console.log('Registration successful');
      setMessage('Registration successful');
   setTimeout(() => {
            navigate('/login');
        }, 2000);
    } catch (error) {
      setMessage(
        error.response?.data?.message || 'An error occurred while registering'
      );
    }
  };

  return (
    <div className="container mt-5">
      <h1>Register</h1>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input
            type="text"
            id="name"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            id="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            id="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="role" className="form-label">Role</label>
          <select
            id="role"
            className="form-control"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="volunteer">volunteer</option>
            <option value="recipient">recipient</option>
            <option value="donor">donor</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="contactNumber" className="form-label">Contact Number</label>
          <input
            type="text"
            id="contactNumber"
            className="form-control"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Register</button>
      </form>
    </div>
  );
};

export default Register;

