const mongoose = require("mongoose");
const express = require("express");
const Order = require("../orders/order.model");
const Book = require("../books/book.model");
const verifyAdminToken = require("../middleware/verifyAdminToken");
const router = express.Router();

// Function to calculate Seller stats
// ⚡ UPDATED: Make route explicitly /seller-dashboard
router.get("/seller-dashboard", verifyAdminToken, async (req, res) => {
  try {
    const username = req.user.username; // ✅ directly from JWT

    // 1. Total number of orders
    const totalOrders = await Order.countDocuments();

    // 2. Total sales (sum of all totalPrice from orders)
    const totalSalesAgg = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$totalPrice" }, // ⚡ FIXED: removed '₹', must be numeric
        },
      },
    ]);
    const totalSales = totalSalesAgg[0]?.totalSales || 0;

    // 3. Trending books statistics
    const trendingBooksCount = await Book.aggregate([
      { $match: { trending: true } },
      { $count: "trendingBooksCount" },
    ]);
    const trendingBooks =
      trendingBooksCount.length > 0
        ? trendingBooksCount[0].trendingBooksCount
        : 0;

    // 4. Total number of books
    const totalBooks = await Book.countDocuments();

    // 5. Monthly sales (optional, numeric only)
    const monthlySales = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          totalSales: { $sum: "$totalPrice" }, // ⚡ FIXED
          totalOrders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      username,
      totalOrders,
      totalSales,
      trendingBooks,
      totalBooks,
      monthlySales,
    });
  } catch (error) {
    console.error("Error fetching Seller stats:", error);
    res.status(500).json({ message: "Failed to fetch Seller stats" });
  }
});

module.exports = router;
