import React, { useEffect, useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const Home = () => {
	const [donations, setDonations] = useState([]);
	const navigate = useNavigate();
    useEffect(() => {
        const fetchDonations = async () => {
                try {
                    const response = await api.post('/fetch_donation.php', { approval: 'approved'});
                    console.log("Response:",response.data);
                    setDonations(response.data.donations || []);
                } catch (error) {
                    console.error("Error fetching donations:", error);
                }  
        };

        fetchDonations();
    }, []);

  return (
    <div>
      {/*Carousel*/}
      <div id="carouselExample" Name="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src="/assets/1.jpg" className="d-block w-100" alt="Image" />
          </div>
          <div className="carousel-item">
            <img src="/assets/2.jpg" className="d-block w-100" alt="Image" />
          </div>
          <div className="carousel-item">
            <img src="/assets/3.jpg" className="d-block w-100" alt="Image" />
          </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true" />
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true" />
          <span className="visually-hidden">Next</span>
        </button>
      </div>
      <div className="container-fluid bg-light p-3 quote-blk">
      <span className="quote text-center w-100 d-block">" If you can't feed a Hundred people, then feed just One. " </span><br/>
 	<span className="quote-author text-end w-100 d-block">-Mother Teresa</span>
      </div>
      {/*Carousel*/}
      {donations.length>0?(
      	 <div className="row m-3">
      	 {donations.map((donation)=>
      	 (
      	 <div className="col-sm-6 mb-3 mb-sm-0">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Donation #{donation.donation_id}</h5>
              <p className="card-text">"{donation.food_details}"</p>
              <p className="card-text">Expiry :{donation.expiry_date}</p>
              <p className="card-text">Quantity :{donation.quantity}</p>
              
              {/* Map Container */}
                  <div style={{ height: '200px', marginBottom: '15px' }}>
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
                  </div>
              <button className="btn btn-primary" onClick={()=>navigate('/accept')}>Accept</button>
             {/*<button className="btn btn-primary m-2 mb-2" onClick={()=>navigate('/volunteer')}>Volunteer</button>*/}
            </div>
          </div>
        </div>
      	 ))}
        
      </div>
      ):
      (
      <p>No donations</p>
      )
      }
    </div>
  );
};

export default Home;

