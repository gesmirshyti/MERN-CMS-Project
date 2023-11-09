import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import './ContactForm.css'

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
    <div className="container*contact">
    <div className="row ">
        <div>
      <section className="col left ">
        <div className="contactTitle">
          <h2>Get In Touch</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod.
          </p>
        </div>
        <div className="contactInfo">
          <div className="iconGroup">
            <div className="icon">
              <i className="fa-solid fa-phone"></i>
            </div>
            <div className="details">
              <span>Phone</span>
              <span>+355 686 111 523</span>
            </div>
          </div>
          <div className="iconGroup">
            <div className="icon">
              <i className="fa-solid fa-envelope"></i>
            </div>
            <div className="details">
              <span>Email</span>
              <span>Contactus@gmail.com</span>
            </div>
          </div>
          <div className="iconGroup">
            <div className="icon">
              <i className="fa-solid fa-location-dot"></i>
            </div>
            <div className="details">
              <span>Location</span>
              <span>X Street, Tirane,Albania</span>
            </div>
          </div>
        </div>
        <div className="socialMedia">
          <a href="#">
            <i className="fa-brands fa-facebook-f"></i>
          </a>
          <a href="#">
          <i class="fa-brands fa-twitter"></i>
                              </a>
          <a href="#">
            <i className="fa-brands fa-instagram"></i>
          </a>
          <a href="#">
            <i className="fa-brands fa-linkedin-in"></i>
          </a>
        </div>
      </section>
</div>
      <section className="col right">
          {!isSubmitted ? (
            
            <form className="messageForm" onSubmit={handleSubmit}>
              {val.contactName ? (
                <p className="validation">{val.contactName.message}</p>
              ) : null} 
              <div className="inputGroup fullWidth">

                <input
                  value={formData.contactName}
                  onChange={handleChange}
                  name="contactName"
           
                />
                <label>Your Name</label>
                
              </div>
              {val.contactEmail ? (
                <p className="validation">{val.contactEmail.message}</p>
              ) : null}
              <div className="inputGroup fullWidth">
                <input
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                />
                <label>Email</label>
                
              </div>
              {val.contactDescription ? (
                <p className="validation">{val.contactDescription.message}</p>
              ) : null}
              <div className="inputGroup fullWidth">
                <input
                  type="text"
                  name="contactDescription"
                  value={formData.contactDescription}
                  onChange={handleChange}
                />
                <label>Description</label>
                
              </div>
              {val.location ? (
                <span className="validation">{val.location.message}</span>
              ) : null}
              <div className="inputGroup fullWidth">
              
                <input
                  value={formData.location}
                  onChange={handleChange}
                  name='location'
                />
                <label>Location</label>
                
              
              </div>
              <div className="inputGroup fullWidth">
                <button type="submit">Submit</button>
              </div>
              </form>

          ) : (
            <Col md={6}>
            <Alert variant="primary">
              {socketMessage}
            </Alert>
          </Col>
          )}
      </section>
    </div>
  </div>
  );
};

export default ContactForm;
