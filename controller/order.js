// controllers/orderController.js

const { errorHandler } = require('../helpers/dbErrorHandler');
const Order = require('../models/order');


// Create a new order
exports.createOrder = async (req, res) => {
  const { products, amount, address,payMethod ,totalProduct} = req.body;
  const userId = req.params.userId;
  try {
    const order = new Order({ products, amount, address,payMethod,totalProduct,user:userId, orderId: Math.floor(Math.random() * 1000000) });
    order.orderStatus.push({ status: "Pending" });
    const savedOrder = await order.save();
    res.json(savedOrder);
  } catch (error) {
    res.status(500).json({ error:error });
  }
};
//get all orders
exports.getAllOrders = async (req, res) => {
    try {
      const orders = await Order.find({})
        .populate("user", "_id name address")
        .sort("-createdAt")
        .exec();
  
      if (orders.length === 0) {
        return res.status(400).json({ message: "No orders found" });
      }
  
      return res.json({
        message: "All orders fetched successfully",
        orders: orders,
      });
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  };

  // Find order by ID
exports.findOrderById = (req, res, next, id) => {
  Order.findById(id)
    .exec()
    .then((order) => {
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      req.order = order;
      next();
    })
    .catch((err) => {
      res.status(500).json({ error: "Internal server error" });
    });
};
exports.updateOrder = (req, res) => {
  const orderId = req.params.orderId;
  const { status } = req.body;

  Order.findOneAndUpdate(
    { _id: orderId },
    { $set: { "orderStatus.$[].status": status } }, // Update the status of all subdocuments within the orderStatus array
    { new: true }
  )
    .exec()
    .then((order) => {
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json({ message: "Order updated successfully", order: order });
    })
    .catch((err) => {
      res.status(400).json({ error: "Failed to update order" });
    });
};

//user purchase history
exports.purchaseHistory = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId })
      .populate("user", "_id name address")
      .sort("-createdAt")
      .exec();

    if (orders.length === 0) {
      return res.status(400).json({ message: "No orders found" });
    }

    return res.json({
      message: "All orders fetched successfully",
      orders: orders,
    });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
}