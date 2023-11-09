const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const BusinessSchema = new mongoose.Schema({

    accounttype: {
        type: String,
        default: 'Business'
    },
    companyName: {
        type: String,
        required: [true, "Company Name is required"]
    },
    address: {
        type: String,
        required: [true, "Company Address is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        validate: {
            validator: val => /^([\w-\.]+@([\w-]+\.)+[\w-]+)?$/.test(val),
            message: "Please enter a valid email"
        }
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
        ref: 'Business',
    },
    verified: {
        type: Boolean,
        default: false
    },
    type: {
        type: String,
        enum: [
            'Retailer',
            'Information & Technology',
            'Hospitality',
            'Agriculture',
            'Real Estate'
        ],
        required: [true, "Type is required"]
    },
    acceptTerms: {
        type: Boolean,
        default: false,
        required: [true, "Accept Terms & Conditions to register."]
    },

}, {
    timestamps: true
});


BusinessSchema.virtual('confirmPassword')
    .get(() => this._confirmPassword)
    .set(value => this._confirmPassword = value);

BusinessSchema.pre('validate', function (next) {
    if (this.password !== this.confirmPassword) {
        this.invalidate('confirmPassword', 'Password must match confirm password');
    }
    next();
});
BusinessSchema.pre('save', function (next) {
    bcrypt.hash(this.password, 10)
        .then(hash => {
            this.password = hash;
            next();
        });
});


module.exports = mongoose.model('Business', BusinessSchema);