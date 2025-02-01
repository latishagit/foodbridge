import React from 'react';

const AboutUs = () => {

return (
<div className="container mt-5" style={{backgroundImage: 'url("./assets/about.jpg")',backgroundSize:'cover',color:'aliceblue'}}>
	<div className="cotainer"  style={{backdropFilter: 'brightness(30%)'}}>
	<h1 className="text-center">About FoodBridge</h1>
	<p>At <b>FoodBridge</b>, we believe that no food should go to waste while people go hungry. Our mission is to <b>bridge the gap</b> between food donors, volunteers, and recipients, creating a seamless and efficient food donation system.  
<br/><br/>
<h3>Who We Are</h3> 
FoodBridge is a platform dedicated to reducing food wastage and combating hunger. We connect <b>donors</b> (restaurants, grocery stores, and individuals) with <b>recipients</b> (charities, shelters, and individuals in need) through a network of <b>volunteers</b> who facilitate safe and timely deliveries.  
<br/><br/>
<h3>Our Mission</h3>  
- <b>Reduce food waste</b> by encouraging responsible food redistribution.  
- <b>Support communities</b> by ensuring surplus food reaches those who need it most.  
- <b>Empower volunteers</b> to contribute meaningfully to food donation efforts.  
<br/><br/>
<h3>How It Works</h3>  
1. <b>Donors</b> list surplus food available for donation.  
2. <b>Recipients</b> request food based on their needs.  
3. <b>Volunteers</b> step in to pick up and deliver donations.  
<br/><br/>
With <b>FoodBridge</b>, we make food donation <b>simple, transparent, and impactful</b>. Together, we can create a world where food is valued and shared, not wasted.  
<br/><br/>
👉 <b>Join us today and be a part of the change!</b>  

</p>
</div>
</div>
);

};

export default AboutUs;
