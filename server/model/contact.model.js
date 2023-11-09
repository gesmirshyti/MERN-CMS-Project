const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  contactName: {
    type: String,
    required: [true, "Name is required"]
  },
  contactEmail: { type: String,
    required:[true,"Email is required"] ,
    validate: {
        validator: val => /^([\w-\.]+@([\w-]+\.)+[\w-]+)?$/.test(val),
        message: "Please enter a valid email"
    } },
  contactDescription: {
    type: String,
    required: [true, "Description is required"]
  },
  location: {
    type: String,
    required: [true, "Location is required"]
  },
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);
