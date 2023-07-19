const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the order status schema
const orderStatusSchema = new Schema(
  {
    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Processing", "Cancelled", "Delivered"],
      required: true
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false } // Add this option to prevent creating a separate _id for the subdocument
);

// Define the order schema
const orderSchema = new Schema({
  orderId: {
    type: Number,
    required: true,
    unique: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  products: [
    {
      _id: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
      },
      name: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      },
      quantityFront: {
        type: Number,
        required: true
      },
      category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
      },
      price: {
        type: Number,
        required: true
      }
      // Include other product properties as needed
    }
  ],
  totalProduct: {
    type: Number,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  payMethod: {
    type: String,
    required: true
  },
  orderStatus: [orderStatusSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create the Order model
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
