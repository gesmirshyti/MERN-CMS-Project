const paypal = require('@paypal/checkout-server-sdk');
const { YOUR_PAYPAL_CLIENT_ID, YOUR_PAYPAL_SECRET } = process.env;

const environment = new paypal.core.SandboxEnvironment(YOUR_PAYPAL_CLIENT_ID, YOUR_PAYPAL_SECRET);
const client = new paypal.core.PayPalHttpClient(environment);

const PayPalController = {
  capturePayment: async (req, res) => {
    try {
      const { authorization_id } = req.params;
  
      if (!authorization_id) {
        return res.status(400).json({ error: 'Authorization ID is missing in the request.' });
      }
  
      const request = new paypal.orders.OrdersGetRequest(authorization_id);
      const response = await client.execute(request);
  
      if (response.result.status === 'AUTHORIZED') {
        const captureRequest = new paypal.orders.OrdersCaptureRequest(authorization_id);
        const captureResponse = await client.execute(captureRequest);
  
        if (captureResponse.result.status === 'COMPLETED') {
          // You may want to update your cart or order status in your database here
          // ...
  
          res.json({ success: true });
        } else {
          res.status(500).json({ error: 'Failed to capture payment' });
        }
      } else {
        res.status(400).json({ error: 'Order not authorized for capture' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to capture payment' });
    }
  },
  
};

module.exports = PayPalController;