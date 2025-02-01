import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { setUserToLocalStorage } from '../utils/localStorageUtils';

const Login = ({ setIsLoggedIn }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post('/login.php', { email, password });
            console.log("API Response:", response.data); 
            if (response.status === 200) {
                const user = {
                    id: response.data.id,
                    name: response.data.name,
                    email: response.data.email,
                    role: response.data.role,
                };
                setUserToLocalStorage(user);
                setIsLoggedIn(true);
                if(user.role==='admin')
                {
                	navigate('/adashboard');
                }
                else
                {
                	navigate('/dashboard');
                }
                
            }
        } catch (error) {
            console.error("Login failed:", error);
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

export default Login;

