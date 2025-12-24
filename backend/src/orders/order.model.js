const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    address: {
      city: {
        type: String,
        required: true,
      },
      country: String,
      state: String,
      zipcode: String,
    },
    phone: {
      type: Number,
      required: true,
    },
    orderItems: [
      {
        bookId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Book",
          required: true,
        },
        sellerId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        sellerName: {
          type: String,
        },
        totalAmount: { type: Number, required: true },
        quantity: { type: Number, default: 1 },
        status: {
          type: String,
          enum: ["pending", "confirmed", "canceled"],
          default: "pending",
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // optional: link order to logged-in user
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
