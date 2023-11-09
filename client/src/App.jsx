import { Fragment, useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route,Link } from 'react-router-dom';
import './App.css'
//customer
import CustomerRegister from './components/customer/CustomerRegister';
import CustomerUpdate from './components/customer/CustomerUpdate';
import CustomerVerify from './components/customer/CustomerVerify';
import CustomerLogin from './components/customer/CustomerLogin';
import CustomerProfile from './components/customer/CustomerProfile';
import CustomerPasswordLoggedIn from './components/customer/CustomerPasswordLoggedIn';
import ForgotPassword from './components/customer/ForgotPassword';
//business
import BusinessLogin from './components/business/BusinessLogin';
import BusinessRegister from './components/business/BusinessRegister';
import BusinessVerify from './components/business/BusinessVerify';
import BusinessUpdate from './components/business/BusinessUpdate';
import BusinessProfile from './components/business/BusinessProfile';
import BusinessPasswordLoggedIn from './components/business/BusinessPasswordLoggedin';
//products
import CreateProduct from './components/business/CreateProduct';
import ShowProducts from './components/ShowProducts';
import ProductDetail from './components/ProductDetail';
import UpdateProduct from './components/UpdateProduct';
//logout
import LogOut from './components/Logout';
//navbar
import Navbar from './components/navbar/Navbar';
//cart
import Cart from './components/navbar/Cart';
//checkout
import PayPalCheckoutButton from './components/checkout/PayPalCheckoutButton';
//Admin
import AdminProfile from './components/admin/AdminProfile';
import Home from './components/Home';
import ContactForm from './components/ContactForm';


function App() {

  const loggedIn = localStorage.getItem('isLoggedIn');
  const [stateLogged, setStateLogged] = useState(false);
  const [userId, setUserId] = useState(null);

  const [cartItemCount, setCartItemCount] = useState(
    parseInt(localStorage.getItem("cartItemCount")) || 0
  );

  const updateCartItemCount = (newItemCount) => {
    setCartItemCount(newItemCount);
    localStorage.setItem("cartItemCount", newItemCount.toString());
  };

  useEffect(() => {
    console.log("App test");
  }, [stateLogged]);
  return (
    <div>
      
      <BrowserRouter>
      {/* <AdminProfile></AdminProfile> */}
      <Navbar cartItemCount={cartItemCount} setStateLogged={setStateLogged} stateLogged={stateLogged} loggedIn={loggedIn}/>
        {/* {loggedIn ? <LogOut setStateLogged={setStateLogged}></LogOut> :
          <CustomerLogin setStateLogged={setStateLogged}></CustomerLogin>
        } */}
        {/* {!loggedIn ? <ForgotPassword setStateLogged={setStateLogged}></ForgotPassword> :
          null
        } */}
        {loggedIn ? (
          <Routes>
            {/*Home*/}
            <Route path="/home" element={<Home />} />
            <Route path="/contact" element={<ContactForm />} />
            <Route path="/admin" element={<AdminProfile />} />

            <Route path="/customer/register" element={<CustomerRegister setStateLogged={setStateLogged} stateLogged={stateLogged} />} />

            <Route path="/customer/:id/update" element={<CustomerUpdate setStateLogged={setStateLogged} stateLogged={stateLogged} />} />

            <Route path="/customer/:id" element={<CustomerProfile setStateLogged={setStateLogged} stateLogged={stateLogged} />} />

            <Route path="/customer/:id/password-update" element={<CustomerPasswordLoggedIn setStateLogged={setStateLogged} stateLogged={stateLogged} />} />

            <Route path="/logout" element={<LogOut setStateLogged={setStateLogged} stateLogged={stateLogged} />} />

            <Route path="/customer/verify-email" element={<CustomerVerify setStateLogged={setStateLogged} stateLogged={stateLogged} />} />

            {/* cart routes */}
            <Route path="/cart/:id" element={<Cart updateCartItemCount={updateCartItemCount} />} />

            {/* business routes */}

            <Route path="/business/:id/update" element={<BusinessUpdate setStateLogged={setStateLogged} stateLogged={stateLogged} />} />

            <Route path="/business/:id/password-update" element={<BusinessPasswordLoggedIn setStateLogged={setStateLogged} stateLogged={stateLogged} />} />

            <Route path="/business/:id" element={<BusinessProfile setStateLogged={setStateLogged} stateLogged={stateLogged} />} />

            <Route path="/business/verify-email" element={<BusinessVerify setStateLogged={setStateLogged} stateLogged={stateLogged} />} />

            <Route path="/business/register" element={<BusinessRegister />} />

            <Route path="/product/create" default element={<CreateProduct userId={userId} setStateLogged={setStateLogged} stateLogged={stateLogged} />} />

            <Route path="/product/:id/update" default element={<UpdateProduct />} />

            <Route path="/product/:page" element={<ShowProducts updateCartItemCount={updateCartItemCount} />} />


            {/* <Route path="/business/product/details/:id" default element={<ProductDetail/>} /> */}

            <Route path="/product/:id/details" element={<ProductDetail />} />

            <Route path="/business/login" default element={<BusinessLogin setStateLogged={setStateLogged} stateLogged={stateLogged} onLogin={(userId) => setUserId(userId)} />} />

            <Route path="/customer/login" default element={<CustomerLogin setStateLogged={setStateLogged} stateLogged={stateLogged} onLogin={(userId) => setUserId(userId)} />
            }/>

            {/* paypal checkout button */}

            <Route path="/paypal-checkout" element={<PayPalCheckoutButton setStateLogged={setStateLogged} stateLogged={stateLogged} />} />


          </Routes>
        ) : (
          <Routes>
            <Route path="/customer/register" element={<CustomerRegister setStateLogged={setStateLogged} stateLogged={stateLogged} />} />

            {/* <Route path="/product/:productId/details" element={<ProductDetails />} /> */}
            <Route path="/product/:id/update" default element={<UpdateProduct />} />

            {/* to comment out */}
            <Route path="/customer/:id/update" element={<CustomerUpdate setStateLogged={setStateLogged} stateLogged={stateLogged} />} />

            <Route path="/customer/forgotpassword" element={<ForgotPassword setStateLogged={setStateLogged} stateLogged={stateLogged} />} />

            <Route path="/customer/verify-email" element={<CustomerVerify setStateLogged={setStateLogged} stateLogged={stateLogged} />} />

            <Route path="/business/register" element={<BusinessRegister setStateLogged={setStateLogged} stateLogged={stateLogged} />} />

            <Route path="/customer/login" default element={<CustomerLogin setStateLogged={setStateLogged} stateLogged={stateLogged} onLogin={(userId) => setUserId(userId)} />} />

            <Route path="/business/login" default element={<BusinessLogin setStateLogged={setStateLogged} stateLogged={stateLogged} onLogin={(userId) => setUserId(userId)} />} />

            <Route path="/product/:page" element={<ShowProducts updateCartItemCount={updateCartItemCount}/>} />

            <Route path="/product/:id/details" element={<ProductDetail />} />

            {/* cart routes */}
            <Route path="/cart/:id" element={<Cart updateCartItemCount={updateCartItemCount} />} />

            <Route path="/contact" element={<ContactForm />} />

            <Route path="/admin" element={<AdminProfile />} />

          </Routes>)
        }
      </BrowserRouter>
    </div>
  )
}

export default App
