const Cart = require('../model/cart.model');
const Product = require('../model/product.model');

// Add a product to the cart
module.exports.addToCart = async (req, res) => {
  const { cartId, productId, quantity } = req.body;

  try {
    const cart = await Cart.findById(cartId);
    const product = await Product.findById(productId);

    if (!cart || !product) {
      return res.status(404).json({ message: 'Cart or product not found' });
    }

    if (product.numberInStock < quantity) {
      return res.status(400).json({ message: 'Insufficient quantity in stock' });
    }

    const existingItem = cart.items.find((item) => item.product.equals(productId));

    if (existingItem) {
      const totalQuantity = existingItem.quantity + quantity;
      if (totalQuantity > product.numberInStock) {
        return res.status(400).json({ message: 'Adding more exceeds available stock' });
      }
      existingItem.quantity = totalQuantity;
    } else {
      const newItem = {
        product: productId,
        quantity,
      };
      cart.items.push(newItem);
    }

    cart.totalPrice += product.price * quantity;

    await cart.save();

    return res.status(200).json({ message: 'Product added to the cart', cart });
  } catch (error) {
    console.error('Error adding product to the cart:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


// Remove an item from the cart
module.exports.removeFromCart = async (req, res) => {
  const { productId, cartId } = req.body;
  console.log(productId, cartId);

  try {
    const cart = await Cart.findById(cartId);

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const itemToRemove = cart.items.find((item) => item.product.toString() === productId);

    if (!itemToRemove) {
      return res.status(404).json({ message: 'Item not found in the cart' });
    }

    if (itemToRemove.quantity > 1) {
      itemToRemove.quantity--;
    } else {
      const indexToRemove = cart.items.indexOf(itemToRemove);
      cart.items.splice(indexToRemove, 1);
    }

    const productPrice = product.price;
    cart.totalPrice -= productPrice;

    await cart.save(); 

    const updatedCartDetails = await Cart.findOne({ _id: cartId })
      .populate('items.product')
      .exec();

    return res.status(200).json({
      cart: {
        items: updatedCartDetails.items,
        totalPrice: updatedCartDetails.totalPrice,
        user: updatedCartDetails.user,
      },
    });
  } catch (error) {
    console.error('Error removing product from the cart:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get the cart contents for a customer
module.exports.getCart = async (req, res) => {
  try {
    const cartId = req.params.id;

    const cart = await Cart.findOne({ _id: cartId });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const customerId = cart.user; 

    const cartDetails = await Cart.findOne({ user: customerId })
      .populate('user')
      .populate('items.product')
      .exec();

    if (!cartDetails) {
      return res.status(404).json({ message: 'Cart not found for the customer' });
    }

    return res.status(200).json({ cart: { items: cartDetails.items, totalPrice : cartDetails.totalPrice, user: cartDetails.user } });
  } catch (error) {
    console.error('Error while fetching cart:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

