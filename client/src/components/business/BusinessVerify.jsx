import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function BusinessVerify({ stateLogged, setStateLogged }) {
    const [otp, setUserToken] = useState('');
    const [verificationStatus, setVerificationStatus] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const userId = localStorage.getItem('userId')

    const handleVerify = () => {

        axios.post('http://localhost:8000/api/business/verify-email', { userId, otp }
        ,{ withCredentials: true })
        
            .then((response) => {
                if (response.data.msg === "Email verified") {
                    console.log(response.data);
                    console.log(userId);
                    console.log(otp);
                    localStorage.setItem('isLoggedIn', true);
                    setStateLogged(true);
                    setVerificationStatus('Verification successful.');
                    navigate(`/business/${userId}/update`)
                } else {
                    console.log(response.data);
                    console.log(userId);
                    console.log(otp);
                }
            })
            .catch((err) => {
                console.log(err);
                err.response.data.msg ? setError(err.response.data.msg) : console.log(err);
              });
    };

    return (
        <div>
            <h2>Verify your Business Account</h2>
            <div>
                <label>Insert Verification Code </label> <br />
                <input type="text"  value={otp} onChange={(e) => setUserToken(e.target.value)} />
            </div>
            <br />
            <button onClick={handleVerify} class="btn btn-outline-success">Verify</button>
            {verificationStatus && <p>{verificationStatus}</p>}
            {error && <p>{error}</p>}
        </div>
    );
}
