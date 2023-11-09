import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

export default function CustomerUpdate() {
  const { id } = useParams();
  const [val, setVal] = useState({});
  const [companyName, setCompanyName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [profilePicture, setprofilePicture] = useState("");
  const navigate = useNavigate();
  const [imgErr, setImgErr] = useState("");

  const addressInputRef = useRef(null);
  let autocomplete;

  useEffect(() => {
    autocomplete = new window.google.maps.places.Autocomplete(addressInputRef.current);
    autocomplete.setFields(['formatted_address']);
    autocomplete.addListener('place_changed', onPlaceChanged);
  }, []);

  const onPlaceChanged = () => {
    const place = autocomplete.getPlace();
    if (place && place.formatted_address) {
      setAddress(place.formatted_address);
    }
  };

  useEffect(() => {
    axios.get(`http://localhost:8000/api/business/${id}`, { withCredentials: true })
      .then(res => {
        setCompanyName(res.data.companyName);
        setAddress(res.data.address);
        setEmail(res.data.email);
        setprofilePicture(res.data.profilePicture);
        displayMap(res.data.address); 
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, [id]);

  const handleImageUpload = (e) => {
    console.log(e);
    var reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onloadend = function () {
        console.log(reader.result);
        setprofilePicture(reader.result);
        console.log(profilePicture);
    };
    reader.onerror = error =>{
        console.log("Error" , error);
    }
};

  const onSubmitHandler = (e) => {
    e.preventDefault();

    axios
      .patch(`http://localhost:8000/api/business/${id}/update`, {
        companyName: companyName,
        address: address,
        email: email,
        profilePicture: profilePicture,
      }, { withCredentials: true })
      .then((res) => {
        console.log(res);
        console.log(res.data);
        setVal({});
        navigate(`/business/${id}`)
      })
      .catch((err) => {
        console.log(err);
        err.response.data.errors ? setVal(err.response.data.errors) : console.log(err) ? (err.response && err.response.status === 413) : setImgErr(err.response.statusText);
      });
  };

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
    <form onSubmit={onSubmitHandler} className='update-profile'>
      <h2>Update Business Information</h2><br />
      <img src={profilePicture} width={150} height={150} alt="Profile Picture" />
      <div className="upload-profile-container">
  <label htmlFor="profile-picture" className="upload-label">
    <span>Upload Profile Picture</span>
    <input
      type="file"
      id="profile-picture"
      name="profilePicture"
      accept="image/jpeg, image/png"
      onChange={handleImageUpload}
    />
  </label>
  {profilePicture && (
    <img
      width={70}
      height={70}
      src={profilePicture}
      alt="Profile Picture"
      className="rounded-full"
    />
  )}
  {imgErr && <p className="error-message">Image too large</p>}
</div>
      {val.companyName ? <p className='red'>{val.companyName.message}</p> : ""}
      <div className="form-floating mb-3">
        <input
          type="text"
          name="companyName"
          className="form-control"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />
        <label htmlFor="floatingInput">Company Name</label>
      </div>
      {val.address ? <p className='red'>{val.address.message}</p> : ""}
      <div className="form-floating mb-3">
        <input
          type="text"
          className="form-control"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          ref={addressInputRef}
        />
        <label htmlFor="floatingInput">Company Address</label>
      </div>
      {val.email ? <p className='red'>{val.email.message}</p> : ""}
      <div className="form-floating mb-3">
        <input
          type="email"
          name="email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="floatingInput">Email address</label>
      </div>
      <div className="d-grid gap-2 d-md-flex mb-3">
        <button type="submit" className="btn btn-outline-success">
          Update
        </button>
      </div>
      <div id="map" style={{ width: '100%', height: '300px' }}></div>
    </form>
  );
}
