const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const CustomerSchema = new mongoose.Schema({
  accounttype: {
    type: String,
    default: 'Customer'
},
  firstName: {
    type: String,
    required: [true, "Name is required"],
    minlength: [3, "Name must be at least 3 characters"]
  },
  lastName: {
    type: String,
    required: [true, "Last Name is required"],
    minlength: [3, "Name must be at least 3 characters"]
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    minlength: [3, "Name must be at least 3 characters"],
    unique : true,
    validate: {
      validator: (val) => /^([\w-\.]+@([\w-]+\.)+[\w-]+)?$/.test(val),
      message: "Please enter a valid email",
    },
  },
  profilePicture: {
    type: String,
  },
  password: {
    type: String,
    required: [true, "Password is required"]
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cart',
  },
  acceptTerms: {
    type: Boolean,
    default: false,
    required: [true, "Accept Terms & Conditions to register."],
  },
  newsLetter: {
    type: Boolean,
    default: false,
  },
  verified: {
    type: Boolean,
    required: [true, "Please verify your email address"],
    default: false,
  }
}, {
  timestamps: true
});

CustomerSchema.virtual('confirmPassword')
  .get(function () {
    return this._confirmPassword;
  })
  .set(function (value) {
    this._confirmPassword = value;
  });

CustomerSchema.pre('validate', function (next) {
  if (this.password !== this.confirmPassword) {
    this.invalidate('confirmPassword', 'Password must match confirm password');
  }
  next();
});

CustomerSchema.pre('save', function (next) {
  bcrypt.hash(this.password, 10)
    .then((hash) => {
      this.password = hash;
      next();
    });
});

module.exports = mongoose.model('Customer', CustomerSchema);