import { useState, useEffect } from 'react';
import {useParams, useNavigate, Link} from 'react-router-dom'
import axios from 'axios';

export default function CustomerProfile() {

    const { id } = useParams();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:8000/api/customer/${id}`, { withCredentials: true })
            .then(res => {
                setFirstName(res.data.firstName);
                setLastName(res.data.lastName);
                setEmail(res.data.email);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, [id]);

    return (
<div className="business-profile">
<div class="profile-row d-flex">
        {/* <div class="col-left">
            {profilePicture && (
                <img
                  width={70}
                  height={70}
                  src={profilePicture}
                  alt="Profile Picture"
                  className="profile-image"
                />
              )}        
            </div> */}
        <div class="col-right">
            <h1>First Name :{firstName}</h1>
            <p>Last Name: {lastName}</p>
            <p>Email: {email}</p>
        </div>
        
        
    </div>
</div>
    );
}
