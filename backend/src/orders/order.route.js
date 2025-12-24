const express = require("express");
const { createAOrder, getOrderByEmail } = require("./order.controller");
const Order = require("./order.model");
const mongoose = require("mongoose");
const verifyAdminToken = require("../middleware/verifyAdminToken");
const router = express.Router();

// create order endpoint
router.post("/", createAOrder);

// get orders by user email
router.get("/email/:email", getOrderByEmail);

// ==================== Get orders for logged-in "seller" (actually admin) ====================
router.get("/seller-orders", verifyAdminToken, async (req, res) => {
  try {
    const sellerId = req.user.id; // from JWT
    console.log("Logged-in sellerId from JWT:", sellerId);

    // NEW: get status from query parameters
    const { status } = req.query; // e.g., ?status=pending
    console.log("Status filter:", status);

    // FIXED: check your DB type for sellerId (ObjectId or string)
    // If stored as string in DB, do NOT convert to ObjectId
    let query = { "orderItems.sellerId": sellerId };

    // NEW: filter by order item status if provided
    if (status) {
      query["orderItems.status"] = status;
    }

    const orders = await Order.find(query)
      .populate("orderItems.bookId", "title")
      .populate("orderItems.sellerId", "username");

    console.log("Orders fetched from DB:", orders);

    res.status(200).json({ orders });
  } catch (err) {
    console.error("Error in /seller-orders:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update status of a single order item
router.put("/update-item-status/:orderId/:itemId", async (req, res) => {
  const { orderId, itemId } = req.params;
  const { status } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const item = order.orderItems.id(itemId);
    if (!item) return res.status(404).json({ message: "Order item not found" });

    item.status = status; // update status
    await order.save();

    res.status(200).json({ message: "Status updated", item });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update status" });
  }
});

module.exports = router;
