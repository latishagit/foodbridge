import React from 'react';

const Home = () => {
  return (
    <div>
      {/*Carousel*/}
      <div id="carouselExample" className="carousel slide" data-bs-ride="carousel">
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
    </div>
  );
};

export default Home;

