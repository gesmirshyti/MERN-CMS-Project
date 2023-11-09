const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
  totalPrice: { type: Number },
  items: [
    {
      product: { type: Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number },
    }
  ]
});

module.exports = mongoose.model("Cart", cartSchema);