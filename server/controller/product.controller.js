const Product = require("../model/product.model");
const Business = require('../model/business.model')

// Handle GET request at /api/product to get a list of all products in stock
module.exports.allProducts = (req, res) => {
  const page = req.query.page || 1;
  const perPage = parseInt(req.query.perPage) || 8;

  Product.paginate(
    { numberInStock: { $ne: 0 } },
    { sort: { creationDate: -1 }, page, limit: perPage, populate: 'owner' },
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(400).json({ message: "Couldn't find products" });
      } else {
        const productsWithOwner = result.docs.map(product => {
          return {
            ...product.toObject(),
            owner: {
              id: product.owner?._id||null,
              companyName: product.owner?.companyName||null,
            }
          };
        });

        res.status(200).json({ products: productsWithOwner, pagesCount: result.pages });
      }
    }
  );
};

// Handle POST request at /api/product/create to create a new product
exports.createProduct = async (req, res) => {
  const userId = req.body.userId;

  try {
    const user = await Business.findById(userId);

    if (!user) {
      return res.status(409).json({
        errors: {
          accounttype: {
            message: 'Please Log in as a business to create products'
          }
        }
      });
    }
    if (!req.files || req.files.length === 0) {
      return res.status(409).json({
        errors: {
          productImage: {
            message: 'Please upload at least one image'
          }
        }
      });
    }

    const images_url = req.files.map(image => image.path);

    const newProduct = new Product({
      name: req.body.name,
      description: req.body.description,
      owner: userId,
      category: req.body.category,
      price: req.body.price,
      numberInStock: req.body.numberInStock,
      productImage: images_url
    });

    const product = await newProduct.save();

    res.status(200).json({
      message: 'Added Successfully',
      product
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

// Handle GET request at /api/product/:id/details to get details for a specific product
module.exports.productDetails = (req, res) => {
  const {id} = req.params
  // console.log(id);
  Product.findById(id)
    .populate("owner")
    .exec()
    .then((result) => {
      if (!result) {
        res.status(404).json({ message: "Product not found" });
      } else {
        res.json(result);
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "Internal server error" });
    });
  }
// Handle DELETE request at /api/product/:id/delete to delete a product by its ID
module.exports.deleteProduct = (req, res) => {
  const { id } = req.params;

  Product.findOne({ _id: id })
    .then((product) => {
      if (!product) {
        return res.status(400).json({ message: "Product not found or you don't have permission to delete it" });
      }

      Product.findByIdAndDelete(id)
        .then(() => {
          return res.status(200).json({ message: "Deleted Successfully" });
        })
        .catch((err) => {
          return res.status(400).json({ message: "Couldn't delete, please try again" });
        });
    })
    .catch((err) => {
      return res.status(400).json({ message: "Error finding the product" });
    });
};

// Handle POST request at /api/product/:id/update to update a product by its ID
exports.updateProduct = async (req, res) => {
  console.log(req.body.name);
  try {
    if (!req.files) {
      return res.status(400).json({ message: "Please upload an image" });
    }

    const images_url = req.files.map(image => image.path);

    const product = await Product.findOne({ _id: req.params.id });

    if (!product) {
      console.error("Product not found:", req.params.id);
      return res.status(404).json({ message: "Product not found" });
    }

    const updatedProduct = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      numberInStock: req.body.numberInStock,
      category: req.body.category,
      productImage: req.files[0] ? images_url : product.productImage,
    };

    const updatedProductInstance = new Product(updatedProduct);

    const validationError = updatedProductInstance.validateSync();

    if (validationError) {
      console.error("Validation error:", validationError);
      return res.status(400).json({ errors: validationError.errors });
    }

    const updatedProductDocument = await Product.findByIdAndUpdate(
      req.params.id,
      updatedProduct,
      { new: true, useFindAndModify: false }
    );

    if (!updatedProductDocument) {
      console.error("Product not updated:", req.params.id);
      return res.status(500).json({ message: "Product not updated" });
    }

    console.log("Product updated successfully:", updatedProductDocument);

    res.status(200).json({
      message: "Successfully Updated",
      product: updatedProductDocument,
    });
  } catch (err) {
    console.error("Error updating the product:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
