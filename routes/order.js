const express = require("express")
const router = express.Router()
const{ requireSignin,isAuth,isAdmin} = require("../controller/auth")
const {findByUserId,pushOrderDataToUserHistory} = require("../controller/user")
const {createOrder,getAllOrders,findOrderById,updateOrder,purchaseHistory} = require("../controller/order") 
const {decreaseQuantity} = require("../controller/product")   
// product routes
router.post("/order/create/:userId", requireSignin, isAuth, pushOrderDataToUserHistory, decreaseQuantity, createOrder);
router.put("/order/update/:orderId/:userId", requireSignin, isAuth, isAdmin, updateOrder);
router.param("orderId", findOrderById);

router.get("/order-list/:userId", requireSignin, isAuth, isAdmin, getAllOrders);
router.get("/order/by/user/:userId", requireSignin, isAuth,purchaseHistory);
router.param("userId", findByUserId);
module.exports = router;
