const Order = require("./order.model");

const createAOrder = async (req, res) => {
  try {
    const { name, email, phone, address, cartItems, totalPrice, user } =
      req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Map cartItems to match the Mongoose schema
    const orderItems = cartItems.map((item) => ({
      bookId: item.bookId, // <-- match frontend field
      sellerId: item.sellerId, // <-- match frontend field
      sellerName: item.sellerName || "Unknown Seller",
      totalAmount: Number(item.price),
      quantity: Number(item.quantity || 1),
      status: "pending",
    }));

    const newOrder = new Order({
      name,
      email,
      phone,
      address,
      orderItems,
      totalPrice: Number(totalPrice),
      user,
    });

    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  } catch (error) {
    console.error("Error creating order", error);
    res.status(500).json({ message: "Failed to create order" });
  }
};

const getOrderByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const orders = await Order.find({ email })
      .sort({ createdAt: -1 })
      .populate("orderItems.bookId", "title") // optional: populate book title
      .populate("orderItems.sellerId", "username email phone"); // optional: populate seller info

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders", error);
    res.status(500).json({ message: "Failed to fetch order" });
  }
};

module.exports = {
  createAOrder,
  getOrderByEmail,
};
