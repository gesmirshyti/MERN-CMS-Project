import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import './BusinessProfile.css'
export default function BusinessProfile() {
  const { id } = useParams();
  const [companyName, setCompanyName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [pendingProducts, setPendingProducts] = useState([]); 
  const [approvedProducts, setApprovedProducts] = useState([]); 
  const [rejectedProducts, setRejectedProducts] = useState([]); 
 const userId = localStorage.getItem('userId')
  const navigate = useNavigate();

  

  useEffect(() => {
    axios.get(`http://localhost:8000/api/business/${id}`, { withCredentials: true })
      .then(res => {
        setCompanyName(res.data.companyName);
        setAddress(res.data.address);
        setEmail(res.data.email);
        displayMap(res.data.address); 
        setProfilePicture(res.data.profilePicture);
      })
      .catch(error => {
        console.error('Error:', error);
      });

      axios.get(`http://localhost:8000/api/business/${id}/pending-products`)
      .then(res=>{
        setPendingProducts(res.data)
      })
    .catch(err=>console.log(err))

    axios.get(`http://localhost:8000/api/business/${id}/approved-products`)
    .then(res=>{
      setApprovedProducts(res.data)
    })
  .catch(err=>console.log(err))

  axios.get(`http://localhost:8000/api/business/${id}/rejected-products`)
  .then(res=>{
    setRejectedProducts(res.data)
  })
.catch(err=>console.log(err))

  }, [id]);



  const displayMap = (address) => {
    const geocoder = new window.google.maps.Geocoder();
    const mapOptions = {
      zoom: 15,
      center: new window.google.maps.LatLng(0, 0), 
    };

    const map = new window.google.maps.Map(document.getElementById('map'), mapOptions);

    geocoder.geocode({ address: address }, (results, status) => {
      if (status === 'OK') {
        map.setCenter(results[0].geometry.location);
        new window.google.maps.Marker({
          map,
          position: results[0].geometry.location,
        });
      } else {
        console.error('Geocode was not successful for the following reason: ' + status);
      }
    });
  };

  return (
    <div className="business-profile">
      <br />
      <br />   
     <div class="profile-row d-flex">
        <div class="col-left">
            {profilePicture && (
                <img
                  width={70}
                  height={70}
                  src={profilePicture}
                  alt="Profile Picture"
                  className="profile-image"
                />
              )}  
              <div>
                  <a href={`/business/${id}/update`} className='logout-button'>Update Profile</a> <br /> <br />
                  <a href={`/business/${id}/password-update`} className='logout-button'>Update Password</a><br/>

            </div>
            </div>
        <div class="col-right">
        <p>Company Name: {companyName}</p>
    <p>Address: {address}</p>
    <p>Email: {email}</p>
        </div>
        
        
    </div>
    <br />
    <div id="map" style={{ width: '100%', height: '300px' }}></div>
  <br />
  <div className="row">
  <h1>Products Posted :</h1>
  {approvedProducts.length === 0 ? (
    <p>Business has no post for the moment! ;(</p>
  ) : (
    approvedProducts.map((product) => (
      <div className="col-md-3 col-10 mt-5" key={product._id}>
        <div className="card">
          <img className='mx-auto img-thumbnail' src={product.productImage} alt={product.name} />
          <div className="card-body text-center mx-auto d-flex">
            <div className='cvp'>
              <h5 className="card-title font-weight-bold">{product.name}</h5>
              <p className="card-text">Price: ${product.price}</p>
              <p className="card-text">Category: {product.category}</p>

              {product.error && <p className="error-message">{product.error}</p>}

              <Link to={`/product/${product._id}/details`} className="btn details px-auto">View Details</Link><br />
              <button href="#" className="btn cart px-auto">ADD TO CART</button>
            </div>
          </div>
        </div>
      </div>
    ))
  )}
</div>
    {userId === id && (
      <div>
    <h3 className="">Pending Products</h3>
        <div className="row">
    {pendingProducts.map((product) => (
      <div className="col-md-3 col-10 mt-5" key={product._id}>
        <div className="card">
          <img className='mx-auto img-thumbnail' src={product.productImage} alt={product.name} />
          <div className="card-body text-center mx-auto d-flex">
            <div className='cvp'>
              <h5 className="card-title font-weight-bold">{product.name}</h5>
              <p className="card-text">Price: ${product.price}</p>
              <p className="card-text">Category: {product.category}</p>

              {product.error && <p className="error-message">{product.error}</p>}

              <Link to={`/product/${product._id}/details`} className="btn details px-auto">View Details</Link><br />
              <button href="#" className="btn cart px-auto">ADD TO CART</button>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
  
  <h3 className="">Products Rejected</h3>
        <div className="row">
    {rejectedProducts.map((product) => (
      <div className="col-md-3 col-10 mt-5" key={product._id}>
        <div className="card">
          <img className='mx-auto img-thumbnail' src={product.productImage} alt={product.name} />
          <div className="card-body text-center mx-auto d-flex">
            <div className='cvp'>
              <h5 className="card-title font-weight-bold">{product.name}</h5>
              <p className="card-text">Price: ${product.price}</p>
              <p className="card-text">Category: {product.category}</p>

              {product.error && <p className="error-message">{product.error}</p>}

              <Link to={`/product/${product._id}/details`} className="btn details px-auto">View Details</Link><br />
              <button href="#" className="btn cart px-auto">ADD TO CART</button>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
      </div>
    )}
  </div>
  
  );
}
