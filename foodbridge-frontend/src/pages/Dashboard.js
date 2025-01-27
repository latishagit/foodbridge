import React, { useEffect, useState } from 'react';
import { getUserFromLocalStorage } from '../utils/localStorageUtils';
import api from '../api';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
		const [username,setUsername]=useState('');
    const [donations, setDonations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isVolunteer, setIsVolunteer] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDonations = async () => {
            const user = getUserFromLocalStorage();
            console.log("Retrieved user:", user); 
            setUsername(user.name);
            if(user.role==='volunteer')
            {
            	setIsVolunteer(true);
            }
            if (user && user.id) {
                try {
                    const response = await api.post('/donations.php', { donor_id: user.id ,role: user.role});
                    console.log("Response:",response.data);
                    setDonations(response.data.donations || []);
                } catch (error) {
                    console.error("Error fetching donations:", error);
                }
                setIsLoading(false);
            } else {
                console.log("No user found. Redirecting to login.");
                navigate('/login');
            }
        };

        fetchDonations();
    }, [navigate]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mt-5">
        <div className="container mt-2 d-flex flex-row justify-content-evenly">
            <h1>Welcome! {username}</h1>
            <button className="btn btn-primary" onClick={()=>navigate('/profile')}>Edit profile</button>
         </div>
        { isVolunteer?(
        <>
        <h3 className="mt-4">Your Tasks</h3>
          {donations.length > 0 ? (
                <ul className="list-group">
                    {donations.map((donation) => (
                       
                        <li key={donation.id} className="list-group-item border-4">
                            <strong>Task id:</strong> {donation.task_id} &nbsp;&nbsp;
                            <strong>Donation id:</strong> {donation.donation_id}<br />
                            <strong>Status:</strong> {donation.status}<br />
                            <strong>Food Details:</strong> {donation.food_details}<br />
                            <strong>Expiry Date:</strong> {donation.expiry_date}<br />
                            <strong>Food Quantity:</strong> {donation.quantity}<br />
                            <strong>Donor Name:</strong> {donation.donor_name}<br />
                            <strong>Donor Contact:</strong> {donation.donor_contact}<br />
                            <strong>Pickup location:</strong>
                              {/* Map Container */}
                              
                  <div style={{ height: '30vh', minHeight: '200px', maxHeight: '400px' }}>
                    <MapContainer
                      center={[donation.pickup_latitude, donation.longitude]}
                      zoom={13}
                      scrollWheelZoom={false}
                      style={{ height: '100%', width: '100%' }}
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <Marker
                        position={[donation.pickup_latitude, donation.longitude]}
                      >
                        <Popup>
                          Pickup Location: Latitude {donation.pickup_latitude}, Longitude{' '}
                          {donation.longitude}
                        </Popup>
                      </Marker>
                    </MapContainer>
                  </div><br />
                  <strong>Recipient Name:</strong> {donation.recipient_name}<br />
                   <strong>Recipient Contact:</strong> {donation.recipient_contact}<br />
                   <strong>Delivery location:</strong> 
                            {/* Map Container */}
                  <div style={{ height: '30vh', minHeight: '200px', maxHeight: '400px' }}>
                    <MapContainer
                      center={[donation.recipient_latitude, donation.recipient_longitude]}
                      zoom={13}
                      scrollWheelZoom={false}
                      style={{ height: '100%', width: '100%' }}
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <Marker
                        position={[donation.recipient_latitude, donation.recipient_longitude]}
                      >
                        <Popup>
                          Pickup Location: Latitude {donation.recipient_latitude}, Longitude{' '}
                          {donation.recipient_longitude}
                        </Popup>
                      </Marker>
                    </MapContainer>
                  </div>
                 <button className="btn btn-primary" onClick={completed_task(key)}>Completed</button>
                        </li>
                    ))}
                     
                </ul>
            ) : (
                <p>No tasks found.</p>
            )}
            <button className="btn btn-primary mt-3" onClick={() => navigate('/donate')}>
                Add Task +
            </button>
        </>
        ):
           (<><h3 className="mt-4">Your Donations</h3>
          {donations.length > 0 ? (
                <ul className="list-group">
                    {donations.map((donation) => (
                        <li key={donation.id} className="list-group-item">
                            <strong>Food Details:</strong> {donation.food_details}<br />
                            <strong>Quantity:</strong> {donation.quantity}<br />
                            <strong>Delivery Location:</strong> {donation.delivery_location}   	&nbsp;&nbsp;
                            <strong>Status:</strong> {donation.status}<br />
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No donations found.</p>
            )}
            <button className="btn btn-primary mt-3" onClick={() => navigate('/donate')}>
                Add Donation +
            </button>
            </>)
        }
         </div>
    );
};

export default Dashboard;

