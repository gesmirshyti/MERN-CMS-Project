import React, { useState, useRef } from 'react'
import axios from 'axios';
import { useNavigate,Link } from 'react-router-dom';
import ReCAPTCHA from "react-google-recaptcha"
import './LoginRegister.css'


export default function BusinessLogin({ setStateLogged }) {
    const navigate = useNavigate()
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [recaptchaValue, setRecaptchaValue] = useState('');
    const [val, setVal] = useState({})
    const captchaRef = useRef()

    const sitekey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
    console.log(sitekey)

    const onSubmitHandler = (e) => {
        e.preventDefault();
        const newRecaptchaValue = captchaRef.current.getValue();
        setRecaptchaValue(newRecaptchaValue);
        captchaRef.current.reset();
        axios.post('http://localhost:8000/api/business/login', {

            email,
            password,
            recaptchaValue: newRecaptchaValue,

        }, { withCredentials: true })
            .then(res => {

                console.log(res);
                console.log(res.data);
                setRecaptchaValue('');
                setVal({})
                localStorage.setItem('isLoggedIn', true);
                localStorage.setItem('userId', res.data.userId);
                const userId = localStorage.getItem('userId', res.data.userId);
                setStateLogged(true)
                navigate(`/business/${userId}/update`)
            })
            .catch(err => { console.log(err); err.response.data.errors ? setVal(err.response.data.errors) : console.log(err) })
    }

    return (
<div className="container d-flex justify-content-center align-items-center min-vh-100">
  <div className="row border rounded-5 p-3 bg-white shadow box-area">
    <div className="featured-image col-md-6 rounded-4 d-flex justify-content-center align-items-center flex-column left-box" >
      <p className="text-white fs-2" >Join as Business</p>
      <small className="text-white text-wrap text-center" >Get the best of your business on our website.</small>
    </div>

    <div className="col-md-6 right-box">
      <div className="row align-items-center">
        <form onSubmit={onSubmitHandler}>
          <div className="header-text mb-4">
            <h2>Hello, Again</h2>
            <p>We are happy to have you back.</p>
          </div>
          {val.email ? <p className='error-message'>{val.email.message}</p> : ""}
          <div className="input-group mb-3">
            <input type="text" className="form-control form-control-lg bg-light fs-6" placeholder="Email address" onChange={(e) => setEmail(e.target.value)} />
          </div>
          {val.password ? <p className='error-message'>{val.password.message}</p> : ""}

          <div className="input-group mb-1">
            <input type="password" className="form-control form-control-lg bg-light fs-6" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
          </div><br />
          <ReCAPTCHA
            sitekey={sitekey}
            ref={captchaRef}
          />
          {val.reCaptcha ? <p className='error-message'>{val.reCaptcha.message}</p> : ""}

          <div className="input-group mb-5 d-flex justify-content-between">
            <div className="form-check">
              <input type="checkbox" className="form-check-input" id="formCheck" />
              <label for="formCheck" className="form-check-label text-secondary"><small>Remember Me</small></label>
            </div>
            <div className="forgot">
              <small><a href="#">Forgot Password?</a></small>
            </div>
          </div>
          <div className="input-group mb-3">
            <button className="btn btn-lg btn-primary w-100 fs-6" type="submit">Login</button>
          </div>
        </form>
        <div className="input-group mb-3">
          <button className="btn btn-lg btn-light w-100 fs-6"><img src="images/google.png"  className="me-2" /><small>Sign In with Google</small></button>
        </div>
        <div className="row">
          <small>Don't have an account? <Link to={'/business/register'}>Sign Up</Link></small>
        </div>
      </div>
    </div>
  </div>
</div>

    )
}