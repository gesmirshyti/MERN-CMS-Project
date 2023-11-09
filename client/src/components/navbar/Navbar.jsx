import { useEffect } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import LogOut from '../Logout';
import './Navbar.css'
function Navbar({ cartItemCount,loggedIn,setStateLogged }) {
  const cartId = localStorage.getItem('cartId');
  const userId = localStorage.getItem('userId');

  return (
    <header>
        <div class="logo"><Link to="/product/1" className='text-none'>CMS</Link> </div>
        <input type="checkbox" id="nav_check" hidden/>
        <nav>
            <ul className='text-none'>
                <li>
                    <Link to={"/home"} className='text-none'>Home</Link> 
                </li>
                <li>
                    <Link to={`/business/${userId}`} className='text-none'>Profile</Link> 
                </li>

                <li>
                    <Link to={'/contact'} className="text-none">Contact</Link>
                </li>
                <li>
                    <Link to={'/about'} className="text-none">About</Link>
                </li>
                {loggedIn ? (
  <>
   <li>
   <LogOut setStateLogged={setStateLogged}></LogOut>
   </li>
  </>
) : (
  <>
   <li>
      <Link to={'/business/login'} className="text-none">
        Business Login
      </Link>
    </li>
    <li>
      <Link to={'/customer/login'} className="text-none">
        Customer Login
      </Link>
    </li></>
)}
                <li>
                    <div className="text-none">
                        <Link to={`/cart/${cartId}`}> 
                          <FaShoppingCart size={24} />
                          {cartItemCount > 0 && <span className="cart-count">{cartItemCount}</span>}
                        </Link>
                      </div> 
                              
                       </li>
            </ul>
        </nav>
        <label for="nav_check" class="hamburger">
            <div></div>
            <div></div>
            <div></div>
        </label>
    </header>
  );
}

export default Navbar;
