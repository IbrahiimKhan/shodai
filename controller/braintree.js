const braintree = require("braintree");
const jwt = require("jsonwebtoken");
const jwtMiddleware = require("express-jwt");
const { errorHandler } = require("../helpers/dbErrorHandler");
const User = require("../models/user");
require("dotenv").config();
const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY
});




exports.generateToken = (req, res) => {
  gateway.clientToken.generate({}, (err, response) => {
    if (err) {
      console.log(err); // Log the error for debugging
      return res.status(500).json({ error: errorHandler(err) });
    }
    res.json({ token: response.clientToken });
  });
};
