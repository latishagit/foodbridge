import React, { useState } from 'react';
import { getUserFromLocalStorage } from '../utils/localStorageUtils'; 
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
const VolunteerDonation = () => {
  const [foodDetails, setFoodDetails] = useState('');
  const [quantity, setQuantity] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  
   const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng; 
        setPickupLocation({ lat, lng });
      },
    });
    return null;
  };
  
  const handleDonate = async (e) => {
    e.preventDefault();

    try {
    	const user=getUserFromLocalStorage();
      const response = await api.post('/create_donation.php', {
        donor_id: user.id, 
        food_details: foodDetails,
        quantity,
         expiry_date: expiryDate,
         pickup_latitude: pickupLocation.lat,
        pickup_longitude: pickupLocation.lng,
      });
      setMessage(response.data.message);
      setMessage('Donation created successfully');
      setTimeout(() => {
            navigate('/Dashboard');
        }, 2000);
    } catch (error) {
      setMessage(
        error.response?.data?.message || 'An error occurred while donating'
      );
    }
  };

  return (
    <div className="container mt-5">
      <h1>Donate Food</h1>
      {message && <p>{message}</p>}
      <form onSubmit={handleDonate}>
        <div className="mb-3">
          <label htmlFor="foodDetails" className="form-label">Food Details</label>
          <input
            type="text"
            id="foodDetails"
            className="form-control"
            value={foodDetails}
            onChange={(e) => setFoodDetails(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="quantity" className="form-label">Quantity (packets / person)</label>
          <input
            type="number"
            id="quantity"
            className="form-control"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="expiryDate" className="form-label">Expiry Date</label>
          <input
            type="date"
            id="expiryDate"
            className="form-control"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            required
          />
        </div>
         <div className="mb-3">
          <label htmlFor="pickupLocation" className="form-label">Pickup Location</label>
          <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '400px' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapClickHandler />
            {pickupLocation.lat && pickupLocation.lng && (
              <Marker position={[pickupLocation.lat, pickupLocation.lng]}>
                <Popup>
                  Latitude: {pickupLocation.lat.toFixed(4)}, Longitude: {pickupLocation.lng.toFixed(4)}
                </Popup>
              </Marker>
            )}
          </MapContainer>
          {pickupLocation.lat && pickupLocation.lng ? (
            <p>Selected Location: Latitude {pickupLocation.lat.toFixed(4)}, Longitude {pickupLocation.lng.toFixed(4)}</p>
          ) : (
            <p>Please click on the map to select a pickup location.</p>
          )}
        </div>
        
        <button type="submit" className="btn btn-primary">Donate</button>
      </form>
    </div>
  );
};

export default VolunteerDonation;

