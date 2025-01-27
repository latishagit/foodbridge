import React, { useEffect, useState } from "react";
import { getUserFromLocalStorage } from "../utils/localStorageUtils";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const AcceptDonation = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [donations, setDonations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVolunteer, setIsVolunteer] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDonations = async () => {
      const storedUser = getUserFromLocalStorage();
      console.log("Retrieved user:", storedUser);
      if (!storedUser) {
        console.log("No user found. Redirecting to login.");
        navigate("/login");
        return;
      }

      setUser(storedUser);
      setUsername(storedUser.name);

      if (storedUser.role === "volunteer") {
        setIsVolunteer(true);
      }

      try {
        const response = await api.post("/fetch_donation.php", { approval: "approved" });
        console.log("Response:", response.data);
        setDonations(response.data.donations || []);
      } catch (error) {
        console.error("Error fetching donations:", error);
      }
      setIsLoading(false);
    };

    fetchDonations();
  }, [navigate]);

  
  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setSelectedLocation({ lat, lng });
        console.log("New location selected:", lat, lng);
      },
    });
    return null;
  };

  const handleUpdateLocation = async (donationId) => {
    if (!selectedLocation) {
      alert("Please select a new location on the map first.");
      return;
    }

    try {
    console.log("User id: ",user.id);
    console.log("selectedLocation.lat: ",selectedLocation.lat);
    console.log("selectedLocation.lng: ",selectedLocation.lng);
    console.log("donationId: ",donationId);
      const response = await api.post("/update_recipient_location.php", {
        recipient_id: user.id, 
        latitude: selectedLocation.lat,
        longitude: selectedLocation.lng,
        donation_id: donationId,
      });
       console.log("Response:", response);
      console.log("Location updated:", response.data);
      alert("Recipient location updated successfully!");
      setTimeout(() => navigate('/dashboard'), 3000); 
    } catch (error) {
      console.error("Error updating location:", error);
      alert("Failed to update location.");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <div className="container mt-2 d-flex flex-row justify-content-evenly">
        <h1>Welcome! {username}</h1>
      </div>

      <h3 className="mt-4">Accepting Donation</h3>
      {donations.length > 0 ? (
        donations.map((donation) => (
          <div key={donation.donation_id} className="list-group-item mb-4">
            <strong>Food Details:</strong> {donation.food_details}
            <br />
            <strong>Quantity:</strong> {donation.quantity}
            <br />
            <strong>Expiry Date:</strong> {donation.expiry_date}
            <br />
            <strong>Donor Name:</strong> {donation.donor_name}
            <br />
            <strong>Contact:</strong> {donation.contact}
            <br />
                      
            {/* Map Display */}
            <MapContainer
              center={[donation.pickup_latitude, donation.longitude]}
              zoom={13}
              style={{ height: "300px", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={[donation.pickup_latitude, donation.longitude]}>
                <Popup>Pickup Location</Popup>
              </Marker>

              {/* New Location Marker */}
              {selectedLocation && (
                <Marker position={[selectedLocation.lat, selectedLocation.lng]}>
                  <Popup>New Location</Popup>
                </Marker>
              )}

              {/* Handle map clicks */}
              <MapClickHandler />
            </MapContainer>

            <button
              className="btn btn-success mt-3"
              onClick={() => handleUpdateLocation(donation.donation_id)}
            >
              
              Accept Donation
            </button>
          </div>
        ))
      ) : (
        <p>No donations found.</p>
      )}
    </div>
  );
};

export default AcceptDonation;

