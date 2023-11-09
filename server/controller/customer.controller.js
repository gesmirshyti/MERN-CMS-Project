const Customer = require('../model/customer.model')
const Business = require('../model/business.model')
const Cart = require('../model/cart.model')
const VerificationToken = require('../model/verificationToken')
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
// const session = require('../utils/session');
const {
  generateOTP,
  mailTransport,
  generateEmailTemplate,
} = require('../utils/mail');
const {
  isValidObjectId
} = require('mongoose');
require('dotenv').config();
const {
  verifyRecaptcha
} = require('../utils/recaptcha');


module.exports.register = async (req, res) => {
  console.log("This comes from Customer Register");
  console.log(process.env.FIRST_SECRET_KEY);
  const {
    acceptTerms,
    profilePicture
  } = req.body;

  const base64Regex = /^data:image\/(bmp|gif|ico|jpg|png|svg|webp|x-icon|svg\+xml)+;base64,[a-zA-Z0-9,+/]+={0,2}$/;

  if (profilePicture && !base64Regex.test(profilePicture)) {
    return res.status(409).json({
      errors: {
        email: {
          message: 'Invalid image format'
        }
      }
    });
  }

  if (!acceptTerms) {
    return res.status(409).json({
      errors: {
        acceptTerms: {
          message: 'Please accept terms and conditions'
        }
      }
    });
  }

  try {
    const existingUser = await Customer.findOne({
      email: req.body.email
    });
    if (existingUser) {
      return res.status(409).json({
        errors: {
          email: {
            message: 'Email already in use'
          }
        }
      });
    }

    const OTP = generateOTP();
    const user = await Customer.create(req.body);

    const verificationToken = new VerificationToken({
      owner: user._id,
      token: OTP,
    });

    await verificationToken.save();

    const userToken = jwt.sign({
      id: user._id
    }, process.env.FIRST_SECRET_KEY);

    const cart = await Cart.create({ user: user._id, totalPrice: 0, items: [] });

    

    mailTransport().sendMail({
      from: 'emailverification@email.com',
      to: user.email,
      subject: "Verify your email",
      html: generateEmailTemplate(OTP),
    });

    // req.session.cartId = cart._id;
    // req.session.userId = user._id;
    res
      .cookie("usertoken", userToken, {
        httpOnly: true,
      })
      .json({
        msg: "success!",
        user,
        verificationToken,
        userId: user._id,
        cartId: cart._id
      });
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports.verifyEmail = async (req, res) => {
  const {
    userId,
    otp
  } = req.body;

  // if (!userId || !otp.trim()) {
  //   return res.status(400).json({ msg: "Invalid request" });
  // }
  if (!isValidObjectId(userId)) {
    return res.status(400).json({
      msg: "Invalid user id"
    });
  }

  try {
    let user = await Customer.findById(userId);

    if (!user) {
      return res.status(400).json({
        msg: "Invalid user id"
      });
    }

    if (user.verified) {
      return res.status(400).json({
        msg: "Account already verified"
      });
    }

    const token = await VerificationToken.findOne({
      owner: user._id
    });

    if (!token) {
      return res.status(400).json({
        msg: "Token not found"
      });
    }

    const isMatched = await token.compareToken(otp);

    if (!isMatched) {
      return res.status(400).json({
        msg: "Please provide a valid token"
      });
    }

    user.verified = true;
    await Customer.updateOne({
      _id: user._id
    }, {
      $set: {
        verified: true
      }
    });

    await VerificationToken.findOneAndDelete(token._id);

    user = await Customer.findById(userId);


    //here new code
    // transporter.sendMail(mailOptions(user.email), function(err, data) {
    //   if (err) {
    //     console.log("Error " + err + data);
    //   } else {
    //     console.log("Email sent successfully");
    //   }
    // });

    res.status(200).json({
      msg: "Email verified",
      user,
      error: null
    });
  } catch (error) {
    res.status(500).json({
      msg: "An error occurred",
      error
    });
  }
};

module.exports.logout = (req, res) => {
  res.clearCookie('usertoken');
  res.sendStatus(200);
}

module.exports.login = async (req, res) => {
  const recaptchaResponse = req.body.recaptchaValue;

  const recaptchaVerification = await verifyRecaptcha(recaptchaResponse);

  if (!recaptchaVerification) {
    return res.status(401).json({
      errors: {
        reCaptcha: {
          message: "ReCaptcha Validation failed"
        }
      }
    });
  }

  const user = await Customer.findOne({
    email: req.body.email
  });

  if (user === null) {
    return res.status(401).json({
      errors: {
        email: {
          message: "User Does Not Exist"
        }
      }
    });
  }

  const correctPassword = await bcrypt.compare(req.body.password, user.password);

  if (!correctPassword) {
    return res.status(401).json({
      errors: {
        password: {
          message: "Password is not correct"
        }
      }
    });
  }

  if(user.verified === false){
    return res.status(401).json({
      errors: {
        email: {
          message: "Please verify your email first"
        }
      }
    });
  }

  const userToken = jwt.sign({
    id: user._id
  }, process.env.FIRST_SECRET_KEY);

   const cart = await Cart.findOne({ user: user._id });

   const cartId = cart ? cart._id : null;

  res.cookie("usertoken", userToken, {
    httpOnly: true
  });

  res.status(200).json({
    msg: "success!",
    userId: user._id,
    name: user.name,
    cartId
  });
};

module.exports.getAllCustomers = (request, response) => {
  Customer.find({}).sort({
      name: 'asc'
    })
    .then(persons => {
      response.json(persons);
    })
    .catch(err => {
      response.json(err)
    })
}

module.exports.updateCustomer = (req, res) => {
  const { id } = req.params;
    const { email, firstName, lastName, profilePicture, ...userData } = req.body;

  const base64Regex = /^data:image\/(bmp|gif|ico|jpg|png|svg|webp|x-icon|svg\+xml)+;base64,[a-zA-Z0-9,+/]+={0,2}$/;

  if (profilePicture && !base64Regex.test(profilePicture)) {
    return res.status(400).json({
      message: 'Invalid base64 format for profilePicture'
    });
  } else {
    updateUser();
  }

  function updateUser() {
    Customer.findOne({
        email: userData.email,
        _id: {
          $ne: id
        }
      })
      .then(existingUser => {
        if (existingUser) {
          return res.status(409).json({
            errors: {
              email: {
                message: 'Email already in use'
              }
            }
          });
        } else {
          Customer.findByIdAndUpdate(id, {userData, profilePicture, email, firstName, lastName}, {
            new: true,
            runValidators: true
        })
            .then(updatedUser => {
              if (!updatedUser) {
                return res.status(404).json({
                  message: 'Customer not found'
                });
              }
              res.status(200).json(updatedUser);
            })
            .catch(err => {
              res.status(400).json(err);
            });
        }
      })
      .catch(err => {
        res.status(500).json(err);
      });
  }
};

module.exports.updateCustomerPassword = async (req, res) => {
  try {
    const customerId = req.params.id;

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({
        message: 'Customer not found'
      });
    }

    const {
      newPassword: password
    } = req.body;

    const {
      confirmPassword
    } = req.body;
    if (password !== confirmPassword) {
      return res.status(400).json({
        message: 'Password and Confirm Password do not match'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedCustomer = await Customer.findByIdAndUpdate(customerId, {
      password: hashedPassword
    }, {
      new: true
    });

    if (!updatedCustomer) {
      return res.status(404).json({
        message: 'Customer not found'
      });
    }

    res.status(200).json({
      message: 'Password updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Internal Server Error',
      error: error.message
    });
  }
};

module.exports.getCustomer = (request, response) => {
  Customer.findOne({
      _id: request.params.id
    })
    .then(person => response.json(person))
    .catch(err => response.json(err));
}

module.exports.ForgotPasswordToken = async (req, res) => {
  try {
    const email = req.body.email;
    let user;

    // Check if the user is a Business
    user = await Business.findOne({ email });

    if (!user) {
      // If not a Business, check if it's a Customer
      user = await Customer.findOne({ email });
    }

    if (!user) {
      return res.status(404).json({
        message: 'Account not found'
      });
    }

    const OTP = generateOTP();

    const verificationToken = new VerificationToken({
      owner: user._id,
      token: OTP,
    });

    await verificationToken.save();

    // Use a conditional to set the 'verified' status to false for the user
    if (user instanceof Business) {
      await Business.findByIdAndUpdate(user._id, { $set: { verified: false } });
    } else if (user instanceof Customer) {
      await Customer.findByIdAndUpdate(user._id, { $set: { verified: false } });
    }

    const userToken = jwt.sign({
      id: user._id
    }, process.env.FIRST_SECRET_KEY);

    mailTransport().sendMail({
      from: 'emailverification@email.com',
      to: user.email,
      subject: "Reset Your Password",
      html: generateEmailTemplate(OTP),
    });

    res
      .cookie("usertoken", userToken, {
        httpOnly: true,
      })
      .json({
        msg: "Success! Reset password token sent.",
        userId: user._id,
        accounttype: user.accounttype
      });
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports.verifyToken = async (req, res) => {
  const {
    userId,
    otp
  } = req.body;

  if (!isValidObjectId(userId)) {
    return res.status(400).json({
      message: "Invalid user id"
    });
  }

  try {
    let user = await (Customer.findById(userId));

    if (!user) {
      return res.status(400).json({
        message: "Invalid user id"
      });
    }

    if (user.verified) {
      return res.status(400).json({
        msg: "Account already verified"
      });
    }

    const token = await VerificationToken.findOne({
      owner: user._id
    });

    if (!token) {
      return res.status(400).json({
        message: "Token not found"
      });
    }

    const isMatched = await token.compareToken(otp);

    if (!isMatched) {
      return res.status(400).json({
        message: "Please provide a valid token"
      });
    }

    user.verified = true;
    await Customer.updateOne({
      _id: user._id
    }, {
      $set: {
        verified: true
      }
    });

    await VerificationToken.findOneAndDelete(token._id);

    user = await Customer.findById(userId);


    //here new code
    // transporter.sendMail(mailOptions(user.email), function(err, data) {
    //   if (err) {
    //     console.log("Error " + err + data);
    //   } else {
    //     console.log("Email sent successfully");
    //   }
    // });

    res.status(200).json({
      message: "Email verified",
      user,
      error: null
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred",
      error
    });
  }
};