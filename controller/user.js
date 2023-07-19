const User = require("../models/user");
const { errorHandler } = require("../helpers/dbErrorHandler");
//get single user
exports.findByUserId = async (req, res, next, id) => {
  try {
    const user = await User.findById(id).exec();
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    req.profile = user;
    next();
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

//get user
exports.getUser = async (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  return res.json({message:"User data fetched successfully",data:req.profile});
}
exports.updateUser = async (req, res) => {
  User.findOneAndUpdate({id:req.profile._id},{$set:req.body},{new:true},(err,user)=>{
    if(err){
      return res.status(400).json({message:"You are not authorized to perform this action"})
    }
    user.hashed_password = undefined;
    user.salt = undefined;
    return res.json({message:"User data updated successfully",data:user});
  })
}
// get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, { hashed_password: 0, salt: 0 }).exec();
    res.json({ message: "Users fetched successfully", data: users });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.customerId).exec();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const { _id, name,phone, email, createdAt,history} = user; // Extract specific fields you want to return
    return res.json({
      message: "User data fetched successfully",
      data: { _id, name, phone,email, createdAt,history },
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.pushOrderDataToUserHistory = async (req, res, next) => {
  try {
    let history = [];
    req.body.products.forEach((item) => {
      history.push({
        _id: item._id,
        name: item.name,
        description: item.description,
        category: item.category,
        quantity: item.quantityFront,
        // transaction_id: req.body.transaction_id,
        amount: req.body.price,
      });
    });

    // Now update the user
    const updatedUser = await User.findOneAndUpdate(
      {
        _id: req.profile._id,
      },
      {
        $push: { history: history },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res
        .status(400)
        .json({ message: "You are not authorized to perform this action" });
    }

    // req.updatedUser = updatedUser; // You can attach the updated user to the request object for further use
    next(); // Invoke the next middleware
  } catch (error) {
    return res
      .status(400)
      .json({ message: "An error occurred while updating user history" });
  }
};

