import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Cart({ updateCartItemCount }) {
    const [cartItems, setCartItems] = useState([]);
    const cartId = localStorage.getItem('cartId');
    const [cart, setCart] = useState({});

    useEffect(() => {
        const fetchCartItems = () => {
            axios.get(`http://localhost:8000/api/cart/${cartId}`, { withCredentials: true })
                .then((response) => {
                    if (response.status === 200) {
                        setCart(response.data.cart)
                        setCartItems(response.data.cart.items);
                        const updatedCartItemCount = response.data.cart.items.length;
                        updateCartItemCount(updatedCartItemCount)
                    } else {
                        console.log('Error fetching cart items');
                    }
                })
                .catch((error) => {
                    console.log('Fetch cart items error:', error);
                });
        };

        fetchCartItems();
    }, [cartId]);

    const removeFromCart = (productId) => {

        axios.patch(`http://localhost:8000/api/cart/${cartId}/delete/${productId}`, {
            cartId: cartId,
            productId: productId,
            withCredentials: true
        })
            .then((response) => {
                if (response.status === 200) {
                    setCart(response.data.cart)
                    const updatedItems = response.data.cart.items;
                    setCartItems(updatedItems);
                    const updatedCartItemCount = updatedItems.length;
                    updateCartItemCount(updatedCartItemCount);
                } else {
                    console.log('Error removing product from the cart');
                }
            })
            .then(() => {
                console.log("Cart Items _id values:");
                cartItems.forEach((item) => {
                    console.log(item.product._id);
                });
            })
            .catch((error) => {
                console.error('Remove from cart error:', error);
            });
    };

    const handleQuickAddToCart = (product) => {
        axios
            .post(`http://localhost:8000/api/cart/add-to-cart`, {
                cartId,
                productId: product._id,
                quantity: 1,
            }, { withCredentials: true })
            .then((response) => {
                if (response.status === 200) {
                    console.log("Product added to the cart");
                    const updatedCartItemCount = response.data.cart.items.length;
                    updateCartItemCount(updatedCartItemCount);

                    const updatedCartItems = cartItems.map((item) => {
                        if (item.product._id === product._id) {
                            return { ...item, quantity: item.quantity + 1 };
                        }
                        return item;
                    });
                    setCartItems(updatedCartItems);
                } else {
                    console.error("Error adding product to the cart");
                }
            })
            .catch((error) => {
                console.log("Axios error:", error);
                const errorMessage = error.response?.data.message || "An error occurred while adding to the cart.";
                const updatedCartItems = cartItems.map((item) => {
                    if (item.product._id === product._id) {
                        return { ...item, error: errorMessage };
                    }
                    return item;
                });
                setCartItems(updatedCartItems);
            });
    };

    return (
        <div>
            
            <h2>Your Cart</h2>
            <ul>
                {cartItems.map((item) => (
                    <li key={item.product._id}>
                        {item.product.name} - Price: ${item.product.price}<br></br>
                        <img
                            src={item.product.productImage}
                            alt={item.product.name}
                            style={{ width: '100px', height: '100px' }}
                        /> - Quantity: {item.quantity}<br></br>
                        Name : {item.product.name}<br></br> - Description: {item.product.description}<br></br>
                        {item.error && <p style={{ color: "red" }}>{item.error}</p>}
                        <button onClick={() => {
                            console.log('Product ID to remove:', item.product._id);
                            removeFromCart(item.product._id);
                        }}>Remove One</button>
                        <button onClick={() => handleQuickAddToCart(item.product)}>Add One</button>

                    </li>
                ))}
            </ul>
            <p>Total Price ${cart.totalPrice}</p>
            <Link to="/paypal-checkout">Proceed to PayPal Checkout</Link>

        </div>
    );
}

export default Cart;
