const CustomerController = require('../controller/customer.controller');
const BusinessController = require('../controller/business.controller');
const ProductController = require('../controller/product.controller');
const CartController = require('../controller/cart.controller');
const PayPalController = require('../controller/paypal.controller');
const AdminController = require('../controller/admin.controller');
const ContactController = require('../controller/contact.controller');

const {
  authenticate
} = require('../config/jwt.config');
const {
  productImages
} = require('../utils/handleImageMulter');


module.exports = (app) => {

    //Contact
    app.post('/api/contact', ContactController.createContact);

  // Business routes
  app.post('/api/business/register', BusinessController.register);
  app.post('/api/business/login', BusinessController.login);
  app.post('/api/business/verify-email', authenticate, BusinessController.verifyEmail);
  app.get('/api/business/:id', authenticate, BusinessController.getBusiness);
  app.patch('/api/business/:id/password-update', authenticate, BusinessController.updateBusinessPassword);
  app.patch('/api/business/:id/update', authenticate, BusinessController.updateBusiness);
  app.patch('/api/business/:id/passwordreset', BusinessController.updateBusinessPassword);
  app.post('/api/business/forgotpassword/verifytoken', BusinessController.verifyToken);
  app.get('/api/business/:userId/pending-products', BusinessController.getPendingProducts);
  app.get('/api/business/:userId/approved-products', BusinessController.getApprovedProducts);
  app.get('/api/business/:userId/rejected-products', BusinessController.getRejectedProducts);

  // Customer routes
  app.post('/api/customer/register', CustomerController.register);
  app.post('/api/customer/login', CustomerController.login);
  app.post('/api/logout', CustomerController.logout);
  app.post('/api/customer/verify-email', authenticate, CustomerController.verifyEmail);
  app.patch('/api/customer/:id/update', authenticate, CustomerController.updateCustomer);
  app.get('/api/customer/:id', authenticate, CustomerController.getCustomer);
  app.patch('/api/customer/:id/password-update', authenticate, CustomerController.updateCustomerPassword);
  app.post('/api/customer/forgotpassword', CustomerController.ForgotPasswordToken);
  app.post('/api/customer/forgotpassword/verifytoken', CustomerController.verifyToken);
  app.patch('/api/customer/:id/passwordreset', CustomerController.updateCustomerPassword);


  //product routes

  // Handle GET request to retrieve a list of all products in stock
  app.get('/api/product', ProductController.allProducts);

  // Handle POST request to create a new product
  app.post('/api/product/create', productImages(), ProductController.createProduct);

  // Handle GET request to retrieve details for a specific product by its ID
  app.get('/api/product/:id/details', ProductController.productDetails);

  // Handle DELETE request to delete a product by its ID
  app.delete('/api/product/:id/delete', ProductController.deleteProduct);

  // Handle PATCH request to update a product by its ID
  app.patch('/api/product/:id/update', productImages(), ProductController.updateProduct);


  //cart routes
  app.post('/api/cart/add-to-cart', authenticate, CartController.addToCart);
  app.get('/api/cart/:id', CartController.getCart);
  app.patch('/api/cart/:id/delete/:id', CartController.removeFromCart);

  //paypal checkout routes
  // app.post('/api/paypal/create-order', PayPalController.createOrder);
  app.post('/api/paypal/:id/capture-payment', PayPalController.capturePayment);


   //Admin Routes
   app.get('/api/admin/verify', AdminController.getPendingProducts);
   app.post('/api/admin/approve/:id', AdminController.confirmProduct);
   app.post('/api/admin/reject/:id', AdminController.rejectProduct);
 
};