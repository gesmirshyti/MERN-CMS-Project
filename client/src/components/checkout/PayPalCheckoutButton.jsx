import React, { useEffect } from 'react';
import axios from 'axios';

function PayPalCheckoutButton({ onSuccess, onError }) {
  const cartId = localStorage.getItem('cartId');

  useEffect(() => {
    axios.get(`http://localhost:8000/api/cart/${cartId}`, { withCredentials: true })
      .then((response) => {
        if (response.status === 200) {
          const cartDetails = response.data;
          renderPayPalButton(cartDetails);
        } else {
          onError('Error fetching cart details');
        }
      })
      .catch((error) => {
        console.error('Fetch cart details error:', error);
        onError('Error fetching cart details');
      });
  }, []);

  const renderPayPalButton = (cartDetails) => {
    const createOrder = (data, actions) => {
      return actions.order.create({
        purchase_units: [
          {
            amount: {
              value: cartDetails.cart.totalPrice,
            },
          },
        ],
      });
    };

    const onApprove = (data, actions) => {
      console.log(data.orderID);
      return actions.order.capture().then((details) => {
  
        axios.post(`http://localhost:8000/api/paypal/${data.orderID}/capture-payment`, {})
          .then((response) => {
            if (response.status === 200 && response.data.success) {
 
              onSuccess();
            } else {
              onError('Error capturing payment');
            }
          })
          .catch((error) => {
            console.error('Capture payment error:', error);
            onError('Error capturing payment');
          });
      });
    };

    window.paypal.Buttons({ createOrder, onApprove, onError }).render('#paypal-button-container');
  };

  return <div id="paypal-button-container"></div>;
}

export default PayPalCheckoutButton;
