import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [location, setLocation] = useState(null); 
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
        latitude: location?.lat || null, 
        longitude: location?.lng || null,
      });
      setMessage(response.data.message);
      console.log('Registration successful');
      setMessage('Registration successful');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'An error occurred while registering');
    }
  };

  
  function LocationSelector() {
    useMapEvents({
      click(event) {
        const { lat, lng } = event.latlng;
        setLocation({ lat, lng });
      },
    });

    return location ? (
      <Marker position={location}>
        <Popup>
          Latitude: {location.lat} <br /> Longitude: {location.lng}
        </Popup>
      </Marker>
    ) : null;
  }

  return (
    <div className="container mt-5">
      <h1>Register</h1>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name <span className="text-danger">*</span></label>
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
          <label htmlFor="email" className="form-label">Email <span className="text-danger">*</span></label>
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
          <label htmlFor="password" className="form-label">Password <span className="text-danger">*</span></label>
          <input
            type="password"
            id="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
            title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="role" className="form-label">Role <span className="text-danger">*</span></label>
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
          <label htmlFor="contactNumber" className="form-label">Contact Number <span className="text-danger">*</span></label>
          <input
            type="text"
            id="contactNumber"
            className="form-control"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            required
            title="Must contain 10 digits"
            pattern="[0-9]{10}"
          />
        </div>

        {role === 'recipient' && (
          <div className="mb-3">
            <label className="form-label">Select Location <span className="text-danger">*</span></label>
            <MapContainer
              center={[51.505, -0.09]} // Default center
              zoom={13}
              style={{ height: '300px', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <LocationSelector />
            </MapContainer>
            {location && (
              <p>
                Location selected: {location.lat}, {location.lng}
              </p>
            )}
          </div>
        )}

        <button type="submit" className="btn btn-primary">Register</button>
      </form>
    </div>
  );
};

export default Register;

