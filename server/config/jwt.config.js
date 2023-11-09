const jwt = require("jsonwebtoken");
require('dotenv').config();
module.exports.authenticate = (req, res, next) => {
    console.log(req)
  jwt.verify(req.cookies.usertoken, process.env.FIRST_SECRET_KEY, (err, payload) => {
    if (err) { 
      return res.status(401).json({verified: false});
    } else {
      req.userId = payload.id;
      next();
    }
  });
}

