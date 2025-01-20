import React, { useState } from 'react';
import api from '../api';

const ALogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post('/alogin.php', { email, password });
      setMessage(response.data.message);
      alert('Login successful');
      // Redirect user to dashboard or handle success
    } catch (error) {
      setMessage(
        error.response?.data?.message || 'An error occurred while logging in'
      );
    }
  };

  return (
    <div className="container mt-5">
      <h1>Login</h1>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
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
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
    </div>
  );
};

export default ALogin;

