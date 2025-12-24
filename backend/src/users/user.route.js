const express = require("express");
const User = require("./user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const verifyAdminToken = require("../middleware/verifyAdminToken");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET_KEY || "yoursecretkey";

// ==================== Admin Login ====================
router.post("/admin", async (req, res) => {
  console.log("Admin login attempt:", req.body);
  const { username, password } = req.body;

  try {
    // Find admin with role "admin"
    const admin = await User.findOne({ username, role: "admin" });
    if (!admin) {
      return res.status(404).json({ message: "Seller not found!" });
    }
    console.log("Login password:", password);
    console.log("DB password:", admin.password);

    // Compare password (bcrypt handles hashing)
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password!" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id, username: admin.username, role: admin.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "Authentication successful",
      token,
      user: {
        username: admin.username,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Failed to login as Seller:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ==================== Admin Registration ====================
router.post("/admin/register", async (req, res) => {
  console.log("Received Admin registration:", req.body);
  const { username, password, phone } = req.body;

  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ username, role: "admin" });
    if (existingAdmin) {
      return res.status(400).json({ message: "Seller already exists" });
    }

    // Create new admin (this will trigger pre("save") and hash password automatically)
    const newAdmin = new User({
      username,
      password, // plain password → will get hashed by pre("save")
      role: "admin",
      phone,
    });

    await newAdmin.save(); // ensure pre("save") runs

    console.log(
      "Submitting Seller registration:",
      JSON.stringify(req.body, null, 2)
    );

    res.status(201).json({
      message: "Seller registered successfully",
      user: {
        username: newAdmin.username,
        role: newAdmin.role,
        phone: newAdmin.phone,
      },
    });
  } catch (error) {
    console.error("Error registering admin:", error);
    res
      .status(500)
      .json({ message: error.message || "Failed to register admin" });
  }
});

// ==================== Seller Login ====================
router.post("/seller", async (req, res) => {
  const { username, password } = req.body;

  try {
    const seller = await User.findOne({ username, role: "seller" });
    if (!seller) {
      return res.status(404).json({ message: "Seller not found!" });
    }

    const isMatch = await bcrypt.compare(password, seller.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password!" });
    }

    const token = jwt.sign(
      { id: seller._id, username: seller.username, role: seller.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "Authentication successful",
      token,
      user: {
        username: seller.username,
        role: seller.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
// ==================== Seller Dashboard ====================
router.get("/seller/dashboard", verifyAdminToken, async (req, res) => {
  try {
    if (req.user.role !== "seller") {
      return res.status(403).json({ message: "Access denied" });
    }

    const sellerId = req.user.id; // comes from JWT middleware

    // 1. Total books uploaded by this seller
    const totalBooks = await Book.countDocuments({
      "uploadedBy.seller": sellerId, // because uploadedBy is an array of objects
    });

    // 2. Total orders that include this seller
    const totalOrders = await Order.countDocuments({
      "orderItems.sellerId": sellerId,
    });

    // 3. Trending books uploaded by this seller
    const trendingBooks = await Book.countDocuments({
      "uploadedBy.seller": sellerId,
      trending: true,
    });

    // 4. Total sales for this seller
    const totalSalesData = await Order.aggregate([
      { $unwind: "$orderItems" },
      {
        $match: {
          "orderItems.sellerId": new mongoose.Types.ObjectId(sellerId),
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$orderItems.totalAmount" }, // use orderItems.totalAmount
        },
      },
    ]);

    res.status(200).json({
      totalBooks,
      totalOrders,
      trendingBooks,
      totalSales: totalSalesData[0]?.total || 0,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch seller dashboard" });
  }
});

module.exports = router;
