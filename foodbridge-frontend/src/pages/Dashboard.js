import React, { useEffect, useState } from 'react';
import { getUserFromLocalStorage } from '../utils/localStorageUtils';
import api from '../api';
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
                        <li key={donation.id} className="list-group-item">
                            <strong>Donation id:</strong> {donation.donation_id}<br />
                            <strong>Pickup time:</strong> {donation.pickup_time}<br />
                            <strong>Delivery time:</strong> {donation.delivery_time}   	&nbsp;&nbsp;
                            <strong>Status:</strong> {donation.status}<br />
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

