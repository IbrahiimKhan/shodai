const express = require("express")
const router = express.Router()
const {expressSignupValidator}= require("../validator/index")
const{ generateToken} = require("../controller/braintree")
const{ findByUserId} = require("../controller/user")
const {requireSignin,isAuth,isAdmin} = require("../controller/auth")
router.get("/braintree/getToken/:userId",requireSignin,isAuth,generateToken)
router.param("userId",findByUserId) 


module.exports = router