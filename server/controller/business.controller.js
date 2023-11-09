const Business = require('../model/business.model')
const VerificationToken = require('../model/verificationToken')
const Product = require('../model/product.model')
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
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




module.exports.getPendingProducts =async (req,res)=> {
  try {
    const ownerId = req.params.userId; 
    const pendingProducts = await Product.find({
        owner: ownerId,
        verificationStatus: 'Pending'
    });
    res.status(200).json(pendingProducts);
} catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching pending products' });
}
}

module.exports.getApprovedProducts =async (req,res)=> {
  try {
    const ownerId = req.params.userId; 
    const approvedProducts = await Product.find({
        owner: ownerId,
        verificationStatus: 'Approved'
    });
    res.status(200).json(approvedProducts);
} catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching pending products' });
}
}

module.exports.getRejectedProducts =async (req,res)=> {
  try {
    const ownerId = req.params.userId; 
    const rejectedProducts = await Product.find({
        owner: ownerId,
        verificationStatus: 'Rejected'
    });
    res.status(200).json(rejectedProducts);
} catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching pending products' });
}
}

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
        profilePicture: {
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
    const existingUser = await Business.findOne({
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
    const user = await Business.create(req.body);

    const verificationToken = new VerificationToken({
      owner: user._id,
      token: OTP,
    });

    await verificationToken.save();

    const userToken = jwt.sign({
      id: user._id
    }, process.env.FIRST_SECRET_KEY);

    mailTransport().sendMail({
      from: 'emailverification@email.com',
      to: user.email,
      subject: "Verify your email",
      html: generateEmailTemplate(OTP),
    });

    res
      .cookie("usertoken", userToken, {
        httpOnly: true,
      })
      .json({
        msg: "success!",
        user,
        verificationToken,
        userId: user._id
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
        msg: "Invalid user id line 110"
      });
    }
  
    try {
      let user = await Business.findById(userId);
  
      if (!user) {
        return res.status(400).json({
          msg: "Invalid user id line 119"
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
      await Business.updateOne({
        _id: user._id
      }, {
        $set: {
          verified: true
        }
      });
  
      await VerificationToken.findOneAndDelete(token._id);
  
      user = await Business.findById(userId);
  
  
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

module.exports.verifyToken = async (req, res) => {
    const {
      userId,
      otp
    } = req.body;
  
    if (!isValidObjectId(userId)) {
      return res.status(400).json({
        message: "Invalid user id line 191"
      });
    }
  
    try {
      let user = await (Business.findById(userId));
  
      if (!user) {
        return res.status(400).json({
          message: "Invalid user id line 200"
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
      
      console.log(token);
      console.log(otp);
      const isMatched = await token.compareToken(otp);
  
      if (!isMatched) {
        return res.status(400).json({
          message: "Please provide a valid token"
        });
      }
  
      user.verified = true;
      await Business.updateOne({
        _id: user._id
      }, {
        $set: {
          verified: true
        }
      });
  
      await VerificationToken.findOneAndDelete(token._id);
  
      user = await Business.findById(userId);
  
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

module.exports.logout = (req, res) => {
    res.clearCookie('usertoken');
    res.sendStatus(200);
};

module.exports.updateBusinessPassword = async (req, res) => {
    try {
      const businessId = req.params.id;
  
      const business = await Business.findById(businessId);
      if (!business) {
        return res.status(404).json({
          message: 'Business not found'
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
  
      const updatedBusiness = await Business.findByIdAndUpdate(businessId, {
        password: hashedPassword
      }, {
        new: true
      });
  
      if (!updatedBusiness) {
        return res.status(404).json({
          message: 'Business not found'
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
  
    const user = await Business.findOne({
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
  
    res.cookie("usertoken", userToken, {
      httpOnly: true
    });
  
    res.status(200).json({
      msg: "success!",
      userId: user._id,
      name: user.name
    });
  };

module.exports.getAllBusiness = (request, response) => {
    Business.find({}).sort({
            name: 'asc'
        })
        .then(persons => {
            response.json(persons);
        })
        .catch(err => {
            response.json(err)
        })
}

module.exports.updateBusiness = (req, res) => {
    const { id } = req.params;
      const { email, companyName, address, profilePicture, ...userData } = req.body;
  
    const base64Regex = /^data:image\/(bmp|gif|ico|jpg|png|svg|webp|x-icon|svg\+xml)+;base64,[a-zA-Z0-9,+/]+={0,2}$/;
  
    if (profilePicture && !base64Regex.test(profilePicture)) {
      return res.status(400).json({
        message: 'Invalid base64 format for profilePicture'
      });
    } else {
      updateUser();
    }
  
    function updateUser() {
        Business.findOne({
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
            Business.findByIdAndUpdate(id, {userData, profilePicture, email, companyName, address}, {
              new: true,
              runValidators: true
          })
              .then(updatedUser => {
                if (!updatedUser) {
                  return res.status(404).json({
                    message: 'Business not found'
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

module.exports.getBusiness = (request, response) => {
    Business.findOne({
            _id: request.params.id
        })
        .then(person => response.json(person))
        .catch(err => response.json(err));
}

