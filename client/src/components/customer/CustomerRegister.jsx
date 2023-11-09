import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate , Link} from 'react-router-dom';

export default function CustomerRegister({ stateLogged, setStateLogged }) {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [newsLetter, setNewsLetter] = useState(false);
  const [val, setVal] = useState({});
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTermsError, setAcceptTermsError] = useState("");
  const [profilePicture, setprofilePicture] = useState("");
  const [imgErr, setImgErr] = useState("");

  const handleImageUpload = (e) => {
    console.log(e);
    var reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onloadend = function () {
      console.log(reader.result);
      setprofilePicture(reader.result);
    };
    reader.onerror = error => {
      console.log("Error", error);
    }
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8000/api/customer/register', {
      firstName,
      email,
      lastName,
      password,
      acceptTerms,
      newsLetter,
      confirmPassword,
      profilePicture,
    }, { withCredentials: true })

      .then((res) => {
        console.log(res);
        console.log(res.data);
        setVal({});
        // localStorage.setItem('isLoggedIn', true);
        localStorage.setItem('userId', res.data.userId);
        localStorage.setItem('cartId', res.data.cartId);
        // setStateLogged(true);
        navigate("/customer/verify-email");
      })
      .catch((err) => {
        console.log(err);
        err.response.data.errors ? setVal(err.response.data.errors) : console.log(err) ? (err.response && err.response.status === 413) : setImgErr(err.response.statusText);
      });
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
    <div className="row border rounded-5 p-3 bg-white shadow box-area">
      <div className=" featured-image col-md-6 rounded-4 d-flex justify-content-center align-items-center flex-column left-box">
        <div className="featured-image mb-3">
        </div>
        <p className="text-white fs-2">Register as Customer</p>
        <small className="text-white text-wrap text-center">Find the Best Products Here.</small>
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
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control form-control-lg bg-light fs-6"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
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