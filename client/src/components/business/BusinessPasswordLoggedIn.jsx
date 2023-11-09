import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function BusinessPasswordLoggedIn() {

  const {id} = useParams()  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleChangePassword = (e) => {
    e.preventDefault();
    console.log(newPassword)
    console.log(confirmPassword)
    // Check if the password and confirm password match
    // if (password !== confirmPassword) {
    //   setMessage('Password and Confirm Password do not match.');
    //   return;
    // }

    // Send a request to your backend to change the password
    axios
      .patch(`http://localhost:8000/api/business/${id}/password-update`, {
        id,
        newPassword,
        confirmPassword,
      }, {withCredentials : true})
      .then((response) => {
        setMessage(response.data.message);
      })
      .catch((error) => {
        setMessage(error.response.data.message);
      });
  };

  return (
    <div>
      <h2>Change Password</h2>
      <form onSubmit={handleChangePassword}>
        <div className="form-group">
          <label htmlFor="password">New Password</label>
          <input
            type="password"
            name="password"
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

      {message && <p>{message}</p>}
    </div>
  );
}
