const mongoose = require("mongoose");
var mongoosePaginate = require("mongoose-paginate");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    description: {
        type: String,
        required: [true, "Description is required"],
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "Business",
        // required: [true, "Owner is required"],
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
    },
    category: {
        type: String,
        required: [true, "Category is required"],
        enum: ["Furniture", "Electronics", "Clothing", "Books", "RealEstate"],
    },
    numberInStock: {
        type: Number,
        required: [true, "Number in Stock is required"],
    },
    productImage: {
        type: Array,
        required: [true, "Product Images are required"],
        default: [],
    },
    verificationStatus: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
        default: "Pending",
    },
    creationDate: {
        type: Date,
        default: Date.now,
    },
});


ProductSchema.virtual("url").get(function () {
    return "/product/" + this._id;
});

ProductSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Product", ProductSchema);