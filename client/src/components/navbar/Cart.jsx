import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Cart({ updateCartItemCount }) {
    const [cartItems, setCartItems] = useState([]);
    const cartId = localStorage.getItem('cartId');
    const [cart, setCart] = useState({});
    const styles = {
        cart: {
          border: '1px solid #ccc',
          padding: '20px',
          backgroundColor: '#fff',
          borderRadius: '5px',
        },
        cartItems: {
          listStyle: 'none',
          padding: '0',
        },
        cartItem: {
          border: '1px solid #ccc',
          margin: '10px 0',
          padding: '10px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        },
        productDetails: {
          display: 'flex',
          alignItems: 'center',
        },
        productImage: {
          marginRight: '10px',
        },
        productImageStyle: {
          width: '100px',
          height: '100px',
          objectFit: 'cover',
        },
        productInfo: {
          flex: 1,
        },
        productDescription: {
          fontSize: '14px',
          color: '#777',
        },
        productActions: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        },
        quantity: {
          display: 'flex',
          alignItems: 'center',
          marginBottom: '10px',
        },
        quantityBtn: {
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          width: '30px',
          height: '30px',
          fontSize: '16px',
          cursor: 'pointer',
        },
        quantityText: {
          margin: '0 10px',
          fontSize: '18px',
        },
        productPrice: {
          fontSize: '18px',
          marginBottom: '10px',
        },
        errorMessage: {
          color: 'red',
          margin: '0',
        },
        removeButton: {
          backgroundColor: '#ff0000',
          color: '#fff',
          border: 'none',
          padding: '5px 10px',
          cursor: 'pointer',
        },
        totalPrice: {
          fontSize: '20px',
          textAlign: 'right',
          marginTop: '20px',
        },
        checkoutButton: {
          display: 'block',
          backgroundColor: 'grey',
          color: '#fff',
          border: 'none',
          padding: '10px 20px',
          textAlign: 'center',
          textDecoration: 'none',
          borderRadius: '5px',
          fontSize: '18px',
          marginTop: '20px',
        },
      };
      
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
    const total = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

    return (
        <div style={styles.cart}>
        <h2>Your Cart</h2>
        <ul style={styles.cartItems}>
            {cartItems.map((item) => (
                <li key={item.product._id} style={styles.cartItem}>
                    <div style={styles.productDetails}>
                        <div style={styles.productImage}>
                            <img src={item.product.productImage} alt={item.product.name} style={styles.productImageStyle} />
                        </div>
                        <div style={styles.productInfo}>
                            <h3>{item.product.name}</h3>
                            <p style={styles.productDescription}>{item.product.description}</p>
                        </div>
                    </div>
                    <div style={styles.productActions}>
                        <div style={styles.quantity}>
                            <button style={styles.quantityBtn} onClick={() => removeFromCart(item.product._id)}>-</button>
                            <span style={styles.quantityText}>{item.quantity}</span>
                            <button style={styles.quantityBtn} onClick={() => handleQuickAddToCart(item.product)}>+</button>
                        </div>
                        <div style={styles.productPrice}>
                            Price: ${item.product.price}
                        </div>
                        {item.error && <p style={styles.errorMessage}>{item.error}</p>}
                        <button style={styles.removeButton} onClick={() => removeFromCart(item.product._id)}>Remove</button>
                    </div>
                </li>
            ))}
        </ul>
        <p style={styles.totalPrice}>Total Price: ${total}</p>
        <Link to={"/paypal-checkout"} style={styles.checkoutButton}>Proceed to PayPal Checkout</Link>
    </div>
    
    
    );
}

export default Cart;
