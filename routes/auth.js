const express = require("express")
const router = express.Router()
const { signup,login,logout,requireSignin } = require("../controller/auth")

const {expressSignupValidator}= require("../validator/index")
router.post("/signup",expressSignupValidator, signup)
router.post("/login", login)
router.get("/logout", logout)
router.get("/hello",requireSignin, (req,res)=>{
    res.json({message:"hellow "})
})


module.exports = router