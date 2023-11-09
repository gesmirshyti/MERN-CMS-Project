import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import './ContactForm.css'
import Navbar from '../components/navbar/Navbar'
const ContactForm = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({
    contactName: '',
    contactEmail: '',
    contactDescription: '',
    location: '',
  });
  const [val, setVal] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [socket] = useState(() => io(':8000'));
  const [socketMessage, setSocketMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    socket.on('Welcome', (data) => {
      setSocketMessage(data);
    });

    return () => socket.off('Welcome');
  }, [socket]);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post('http://localhost:8000/api/contact', formData)
      .then((res) => {
        console.log(res.data);
        setVal({});
        setIsSubmitted(true);

        setFormData({
          contactName: '',
          contactEmail: '',
          contactDescription: '',
          location: '',
        });
      })
      .catch((err) => {
        console.log(err);
        err.response.data.errors
          ? setVal(err.response.data.errors)
          : console.log(err);
      });
  };

  return (
    <div className="contact-container">
    <div className="row contact-row">
      <br />
      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="col-md-7 contact-col-7">
          <h4>Get in touch</h4>
          {val.contactName ? (
            <p className="validation">{val.contactName.message}</p>
          ) : null}
          <div className="mb-3">
            <br />
            <br />
            
            <input
              type="text"
              className="form-control"
              id="formGroupExampleInput"
              placeholder="Enter your name"
              value={formData.contactName}
              onChange={handleChange}
              name="contactName"
            />
          </div>
          {val.contactEmail ? (
            <p className="validation">{val.contactEmail.message}</p>
          ) : null}
          <div className="mb-3">
            <input
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
              type="text"
              className="form-control"
              id="formGroupExampleInput2"
              placeholder="Enter your email"
            />
          </div>
          {val.location ? (
            <span className="validation">{val.location.message}</span>
          ) : null}
          <div className="mb-3">
            <input
              value={formData.location}
              onChange={handleChange}
              name="location"
              type="text"
              className="form-control"
              id="formGroupExampleInput2"
              placeholder="Enter your number"
            />
          </div>
          <div className="mb-3">
            <textarea
              className="form-control"
              id="exampleFormControlTextarea1"
              rows="3"
              type="text"
              name="contactDescription"
              placeholder='Description'
              value={formData.contactDescription}
              onChange={handleChange}
            ></textarea>
          </div>
          <button className="btn btn-primary">Submit</button>
        </form>
      ) : (
        <Col md={6}>
          <Alert variant="primary">
            {socketMessage}
          </Alert>
        </Col>
      )}
      <div className="col-md-5 contact-col-md-5">
        <h4>Contact us</h4>
        <hr />
        <div className="mt-4">
          <div className="d-flex">
            <i className="bi bi-geo-alt-fill"></i>
            <p>Address: 198 West 21th Street, Suite 721 New York NY 10016</p>
          </div>
          <hr />
          <div className="d-flex">
            <i className="bi bi-telephone-fill"></i>
            <p>Contact :- 8888888888</p>
          </div>
          <hr />
          <div className="d-flex">
            <i className="bi bi-envelope-fill"></i>
            <p>Email:- Contact@gmail.com</p>
          </div>
          <hr />
          <div className="d-flex">
            <i className="bi bi-browser-chrome"></i>
            <p>Website: www.contact.com</p>
          </div>
          <hr />
          <br />
        </div>
      </div>
    </div>
  </div>
  
  );
};

export default ContactForm;
