import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
const ContactUs = () => {
    const [email, setEmail] = useState('');
    const [contact, setContact] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            const response = await api.post('/contact.php', { email,contact, name,description });
            console.log("API Response:", response.data); 
            if (response.status === 200 && response.data.success) {
               console.log("Successful API");
               setMessage('We will get back to you soon...');
            }
        } catch (error) {
            console.error("API failed:", error);
            setMessage('Contact unsuccessfull...Make sure all details  are according to constraints');
           }
    };

  return (
 <div className="container mt-5">
        <h2>Contact Us</h2>
         {message && <p>{message}</p>}
        <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name">Name<font color="red">*</font></label>
          <input type="text" 
           className="form-control"
          id="name" 
          name="name" 
          placeholder="Enter your name" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          required/>
          </div>
         <div className="mb-3">
          <label htmlFor="email">Email<font color="red">*</font></label>
          <input type="email" 
          placeholder="Enter your email" 
          id="email" 
          name="email" 
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required />
          </div>
          
           <div className="mb-3">
          <label htmlFor="contact">Contact<font color="red">*</font></label>
          <input type="text" 
           className="form-control"
          id="contact" 
          name="contact"  
          title="Must contain 10 digits" 
          pattern="[0-9]{10}" 
          placeholder="Enter your contact" 
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          required/>
          </div>
          
           <div className="mb-3">
          <label htmlFor="description">Description<font color="red">*</font></label>
          <textarea id="description" 
          placeholder="Enter description..." 
          name="description" 
          rows={4} 
          maxLength={200}
          required 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="form-control" />
          </div>
          <button type="submit" className="btn btn-primary">Submit</button>
        </form>
      </div>
    );
};

export default ContactUs;





