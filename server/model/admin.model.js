const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const AdminSchema = new mongoose.Schema({
name: { type: String ,
    required:[true,"Name is required"]},
email: { type: String,
    required:[true,"Email is required"] ,
    validate: {
        validator: val => /^([\w-\.]+@([\w-]+\.)+[\w-]+)?$/.test(val),
        message: "Please enter a valid email"
    } },
password: { type: String,
        required:[true,"Password is required"] },
userId : { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
}, 

}, { timestamps: true });


AdminSchema.virtual('confirmPassword')
.get( () => this._confirmPassword )
.set( value => this._confirmPassword = value );

AdminSchema.pre('validate', function(next) {
    if (this.password !== this.confirmPassword) {
    this.invalidate('confirmPassword', 'Password must match confirm password');
    }
    next();
});
AdminSchema.pre('save', function(next) {
bcrypt.hash(this.password, 10)
    .then(hash => {
    this.password = hash;
    next();
    });
});


module.exports = mongoose.model('Admin', AdminSchema);
