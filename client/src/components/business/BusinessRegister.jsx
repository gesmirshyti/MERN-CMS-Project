import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './LoginRegister.css'

export default function BusinessRegister({ setStateLogged }) {
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [type, setType] = useState("");
  const [val, setVal] = useState({});
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTermsError, setAcceptTermsError] = useState("");
  // const [profilePicture, setprofilePicture] = useState("");
  // const [imgErr, setImgErr] = useState("");

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

  // const handleImageUpload = (e) => {
  //   console.log(e);
  //   var reader = new FileReader();
  //   reader.readAsDataURL(e.target.files[0]);
  //   reader.onloadend = function () {
  //     console.log(reader.result);
  //     setprofilePicture(reader.result);
  //   };
  //   reader.onerror = error => {
  //     console.log("Error", error);
  //   }
  // };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8000/api/business/register', {
      companyName,
      email,
      address,
      password,
      acceptTerms,
      type,
      confirmPassword,
      // profilePicture,
    }, { withCredentials: true })

      .then((res) => {
        console.log(res);
        console.log(res.data);
        setVal({});
        localStorage.setItem('isLoggedIn', true);
        localStorage.setItem('userId', res.data.userId);
        setStateLogged(true);
        navigate("/business/verify-email");
      })
      .catch((err) => {
        console.log(err);
        err.response.data.errors ? setVal(err.response.data.errors) : console.log(err) ? (err.response && err.response.status === 413) : "";
      });
  };
return(
  <div className="container d-flex justify-content-center align-items-center min-vh-100">
    <div className="row border rounded-5 p-3 bg-white shadow box-area">
      <div className=" featured-image col-md-6 rounded-4 d-flex justify-content-center align-items-center flex-column left-box">
        <div className="featured-image mb-3">
        </div>
        <p className="text-white fs-2">Register as Business</p>
        <small className="text-white text-wrap text-center">Get the best of your business on our website.</small>
      </div>

      <div className="col-md-6 right-box">
        <div className="row align-items-center">
        <form onSubmit={onSubmitHandler}>

          <div className="header-text mb-4">
            <h2>Hello!</h2>
            <p>We are happy to have you here.</p>
          </div>
          {val.companyName ? <p className='error-message'>{val.companyName.message}</p> : ""}
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control form-control-lg bg-light fs-6"
              placeholder="Company Name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>
          {val.address ? <p className='error-message'>{val.address.message}</p> : ""}
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control form-control-lg bg-light fs-6"
              placeholder="Location"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              ref={addressInputRef}
            />
          </div>
          {val.email ? <p className='error-message'>{val.email.message}</p> : ""}
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control form-control-lg bg-light fs-6"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {val.password ? <p className='error-message'>{val.password.message}</p> : ""}
          <div className="input-group mb-3">
            <input
              type="password"
              className="form-control form-control-lg bg-light fs-6"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {val.confirmPassword ? <p className='error-message'>{val.confirmPassword.message}</p> : ""}
          <div className="input-group mb-3">
            <input
              type="password"
              className="form-control form-control-lg bg-light fs-6"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div className="input-group mb-1" >
            <select
              className="form-select form-control-lg bg-light fs-6"
              aria-label="Default select example"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value={""}>Choose a Business Type</option>
              <option value={"Retailer"}>Retailer</option>
              <option value={"Information & Technology"}>Information & Technology</option>
              <option value={"Hospitality"}>Hospitality</option>
              <option value={"Real Estate"}>Real Estate</option>
            </select>
          </div>
          {val.type ? <p className='error-message'>{val.type.message}</p> : ""}
          <div className="form-check form-switch mb-3">
          <input
              className="form-check-input"
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => {
                setAcceptTerms(e.target.checked);
                setAcceptTermsError("");
              }}
            />
            <label className="form-check-label" htmlFor="flexSwitchCheckDefault">

              <a href="#">Terms & Conditions</a>
            </label>
          </div>
          {val.acceptTerms ? <p className='red'>{val.acceptTerms.message}</p> : ""}
          {acceptTermsError && <p className='red'>{acceptTermsError}</p>}
          <div className="input-group mb-5 d-flex justify-content-between">
            <div className="forgot">
              <small><Link to={'/customer/forgotpassword'}>Forgot Password?</Link></small>
            </div>
          </div>
          <div className="input-group mb-3">
            <button className="btn btn-lg btn-primary w-100 fs-6">Register</button>
          </div>
          <div className="row">
            <small className='header-text'>Already have an account? <Link to={'/business/login'}>Log In</Link></small>
          </div>
          </form>

        </div>
      </div>
    </div>
</div>

  );
}