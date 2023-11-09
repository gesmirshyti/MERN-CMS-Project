import React, { useState } from 'react';
import axios from 'axios';

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [accountType, setAccountType] = useState('');

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`http://localhost:8000/api/customer/forgotpassword`, { email })
      .then((response) => {
        setMessage(response.data.message);
        setAccountType(response.data.accounttype);
        localStorage.setItem('userId', response.data.userId);
        setStep(2);
      })
      .catch((error) => {
        console.log(error);
        setMessage(error.response.data.message);
      });
  };

  const handleTokenSubmit = (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    const apiEndpoint =
      accountType === 'Business'
        ? 'http://localhost:8000/api/business/forgotpassword/verifytoken'
        : 'http://localhost:8000/api/customer/forgotpassword/verifytoken';

    axios
      .post(apiEndpoint, { userId, otp })
      .then((response) => {
        setMessage(response.data.message);
        setStep(3);
      })
      .catch((error) => {
        console.log(error);
        setMessage(error.response.data.message);
      });
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    const apiEndpoint =
      accountType === 'Business'
        ? `http://localhost:8000/api/business/${userId}/passwordreset`
        : `http://localhost:8000/api/customer/${userId}/passwordreset`;

    axios
      .patch(apiEndpoint, {
        newPassword,
        confirmPassword,
      })
      .then((response) => {
        localStorage.removeItem('userId');
        setMessage(response.data.message);
      })
      .catch((error) => {
        console.log(error);
        setMessage(error.response.data.message);
      });
  };

  return (
    <div>
      <h2>Change Password</h2>
      {step === 1 && (
        <form onSubmit={handleEmailSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button type="submit">Send Verification Token</button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleTokenSubmit}>
          <div className="form-group">
            <label htmlFor="otp">Verification Token</label>
            <input
              type="text"
              name="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>
          <button type="submit">Verify Token</button>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleChangePassword}>
          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button type="submit">Change Password</button>
        </form>
      )}

      {message && <p>{message}</p>}
    </div>
  );
}
