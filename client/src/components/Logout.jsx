import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LogOut = ({ setStateLogged }) => {
    const navigate = useNavigate();

    const logOutFunc = () => {
        axios.post('http://localhost:8000/api/logout', {}, { withCredentials: true })
            .then(res => {
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('userId');
                localStorage.removeItem('cartId');
                localStorage.removeItem('cartItemCount');
                
                setStateLogged(false);
                navigate('/customer/register'); 
            })
            .catch(err => alert("Error from Logout: " + err));
    }

    return (
        <input className='logout-button' type="button" value={"logout"} onClick={logOutFunc} />
    )
}

export default LogOut;
