import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

export default function CustomerUpdate() {
  const { id } = useParams();
  const [val, setVal] = useState({});
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePicture, setprofilePicture] = useState("");
  const navigate = useNavigate();
  const [imgErr, setImgErr] = useState("");

  useEffect(() => {
    axios.get(`http://localhost:8000/api/customer/${id}`, { withCredentials: true })
      .then(res => {
        setFirstName(res.data.firstName);
        setLastName(res.data.lastName);
        setEmail(res.data.email);
        setprofilePicture(res.data.profilePicture);
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
      .patch(`http://localhost:8000/api/customer/${id}/update`, {
        firstName: firstName,
        lastName: lastName,
        email: email,
        profilePicture: profilePicture,
      }, { withCredentials: true })
      .then((res) => {
        console.log(res);
        console.log(res.data);
        setVal({});
        navigate(`/customer/${id}`)
      })
      .catch((err) => {
        console.log(err);
        err.response.data.errors ? setVal(err.response.data.errors) : console.log(err) ? (err.response && err.response.status === 413) : setImgErr(err.response.statusText);
      });
  };

  return (
    <form onSubmit={onSubmitHandler} className='update-profile'>
      <h2>Update Customer Information</h2>
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
      {val.firstName ? <p className='red'>{val.firstName.message}</p> : ""}
      <div className="form-floating mb-3">
        <input
          type="text"
          name="firstName"
          className="form-control"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <label htmlFor="floatingInput">First Name</label>
      </div>
      {val.lastName ? <p className='red'>{val.lastName.message}</p> : ""}
      <div className="form-floating mb-3">
        <input
          type="text"
          name="lastName"
          className="form-control"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <label htmlFor="floatingInput">Last Name</label>
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
    </form>
  );
}
