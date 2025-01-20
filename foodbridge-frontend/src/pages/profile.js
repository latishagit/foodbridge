import React, { useState, useEffect } from 'react';
import { getUserFromLocalStorage, setUserToLocalStorage } from '../utils/localStorageUtils';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
    const [user, setUser] = useState({});
    const [message, setMessage] = useState('');
    const [isVolunteer, setVolunteer] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchedUser = getUserFromLocalStorage();
        if (fetchedUser) {
            setUser(fetchedUser);
            console.log("fetched user", fetchedUser);
            if (fetchedUser.role === 'volunteer') {
                setVolunteer(true);
            }
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const handleInputChange = (e) => {
    const { name, value, type ,checked} = e.target;
   
    const newValue = (type === 'radio' && (value === 'true' || value === 'false')) ? (value === 'true') : value;
    setUser({ ...user, [name]: newValue });
};


    console.log("User State:", user); 
    console.log("Is Volunteer:", isVolunteer); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await api.post('/update_profile.php', user);
            setMessage(response.data.message);
            if (response.status === 200) {
                setUserToLocalStorage(user); 
                setTimeout(() => navigate('/dashboard'), 3000); 
            }
        } catch (error) {
            setMessage(error.response?.data?.message || 'An error occurred while updating your profile');
        }
    };

    return (
        <div className="container mt-5">
            <h1>Edit Profile</h1>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        className="form-control"
                        value={user.name || ''}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        className="form-control"
                        value={user.email || ''}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="contact_number" className="form-label">Contact Number</label>
                    <input
                        type="text"
                        id="contact_number"
                        name="contact_number"
                        className="form-control"
                        value={user.contact_number || ''}
                        onChange={handleInputChange}
                    />
                </div>
                {isVolunteer ? (
                    <>
                        <div className="mb-3">
                            <label htmlFor="preferred_area" className="form-label">Preferred Area</label>
                            <input
                                type="text"
                                id="preferred_area"
                                name="preferred_area"
                                className="form-control"
                                value={user.preferred_area || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="availability" className="form-check-label">Availability</label><br />
                            <input
                                type="radio"
                                id="availability-true"
                                name="availability"
                                className="form-check-input"
                                value="true"
                                checked={user.availability === true}
                                onChange={handleInputChange}
                            /> Available &nbsp;&nbsp;&nbsp;
                            <input
                                type="radio"
                                id="availability-false"
                                name="availability"
                                className="form-check-input"
                                value="false"
                                checked={user.availability === false}
                                onChange={handleInputChange}
                            /> Not Available
                        </div>
                    </>
                ) : (
                    <p>Confirm the details entered</p>
                )}
                <button type="submit" className="btn btn-primary">Save Changes</button>
            </form>
        </div>
    );
};

export default EditProfile;

