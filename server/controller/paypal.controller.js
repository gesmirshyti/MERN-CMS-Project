const paypal = require('@paypal/checkout-server-sdk');

const { YOUR_PAYPAL_CLIENT_ID, YOUR_PAYPAL_SECRET } = process.env;
const environment = new paypal.core.LiveEnvironment(YOUR_PAYPAL_CLIENT_ID, YOUR_PAYPAL_SECRET);
const client = new paypal.core.PayPalHttpClient(environment);

const PayPalController = {
  createOrder: async (req, res) => {
    try {
      const { cart } = req.body;

      if (!cart || !cart.totalPrice) {
        return res.status(400).json({ error: 'Cart data is missing or incomplete in the request.' });
      }

      const orderDetails = {
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: cart.totalPrice.toString(),
            },
          },
        ],
      };

      const request = new paypal.orders.OrdersCreateRequest();
      request.requestBody(orderDetails);

      const response = await client.execute(request);
      res.json({ orderID: response.result.id });
      console.log(response);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Failed to create a PayPal order' });
    }
  },

  capturePayment: async (req, res) => {
    try {
      const { id } = req.params; 
      console.log(id);

      if (!id) {
        return res.status(400).json({ error: 'Order ID is missing in the request.' });
      }

      const request = new paypal.orders.OrdersCaptureRequest(id); 
      const response = await client.execute(request);

      if (response.result.status === 'COMPLETED') {
        res.json({ success: true });
      } else {
        res.status(500).json({ error: 'Failed to capture payment' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to capture payment' });
    }
  },
};

module.exports = PayPalController;
