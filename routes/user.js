// routes/user.js

const express = require("express");
const router = express.Router();
const { requireSignin, isAuth, isAdmin } = require("../controller/auth");
const {
  findByUserId,
  getUser,
  updateUser,
  getAllUsers,
  getUserById
} = require("../controller/user");

router.param("userId", findByUserId);

router.get("/me/:userId", requireSignin, isAuth, getUser);
router.get("/user/:userId", requireSignin, isAuth, getUser);

//get all users
router.get("/users/:userId", requireSignin, isAuth, isAdmin, getAllUsers);
// get single user
router.get("/singleuser/:userId/:customerId",isAdmin, getUserById);
router.patch("/user/:userId", requireSignin, isAuth, updateUser);

module.exports = router;
