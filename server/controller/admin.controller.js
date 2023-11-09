const Business = require('../model/business.model')
const Admin  = require('../model/admin.model')
const Product = require('../model/product.model')
module.exports.getPendingProducts = async (req, res) => {
    try {
        const pendingProducts = await Product.find({ verificationStatus: 'Pending' });
        res.status(200).json(pendingProducts);
      } catch (err) {
        res.status(500).json({ error: 'Error fetching pending products' });
      }
};


module.exports.confirmProduct = async (req, res) => {
    try {
        const productId = req.params.id; 
        await Product.findByIdAndUpdate(productId, { verificationStatus: 'Approved' });
        res.json({ message: 'Product approved' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports.rejectProduct = async (req, res) => {
    try {
        const productId = req.params.id; 
        await Product.findByIdAndUpdate(productId, { verificationStatus: 'Rejected' });
        res.json({ message: 'Product Rejected' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};




