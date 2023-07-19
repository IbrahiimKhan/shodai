const User = require("../models/user");
const { errorHandler } = require("../helpers/dbErrorHandler")
const jwt = require("jsonwebtoken")
const jwtMiddleware = require("express-jwt");

//user registration
exports.signup = async (req, res) => {
    const user = new User(req.body);

    try {
        const savedUser = await user.save();
        res.json({ message: "User Created Successfully", data: savedUser });
    } catch (error) {
        res.status(400).json({ error: errorHandler(error) });
    }
};
//user login
exports.login = async (req, res) => {
    try {
      const { phone, password } = req.body;
      
      // Check if the phone number is valid
      if (typeof phone !== 'string' || !phone.match(/^\+\d{1,}$/)) {
        return res.status(400).json({ message: "Invalid phone number" });
      }
      // find the user based on phone
      const user = await User.findOne({ phone });
    //  console.log("our user", user);
      
      if (!user) {
        return res.status(400).json({ message: "User doesn't exist" });
      }
      
      // check if the password matches
      if (!user.authenticate(password)) {
        return res.status(401).json({ message: "Wrong password" });
      }
      
      // generate the token
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
      
      // cookie with expiry date
      res.cookie("t", token, { expire: new Date() + 9999 });
      
      // return response with token to frontend client
      const { _id, name, email, role } = user;
      return res.json({ token: token,message:"Successfully Logged In", data: { _id, name, email, phone, role } });
    } catch (error) {
      console.log(error); // Add this line to log the error
      res.status(400).json({ error: errorHandler(error) });
    }
  };
  
//user logout
exports.logout=(req,res)=>{
    res.clearCookie("t")
    
   return res.json({message:"Logout Successfull"})
   
}
//required siginin method to secure the route

exports.requireSignin = jwtMiddleware({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
    userProperty: "auth",
  });
  //check only logged in user can see only his profile not others
exports.isAuth= async(req,res,next)=>{
  let user = req.profile && req.auth && req.profile._id == req.auth._id
  console.log("check values",req.profile , req.auth  ,req.auth._id)
  if (!user) {
    return res.status(403).json({
      error:"Access Denied"
    })
  }
  next()
}
exports.isAdmin=async(req,res,next)=>{
  if (req.profile.role===0) {
    return res.status(403).json({
      error:"Admin resource! access Denied"
    })
  }
  next()
}