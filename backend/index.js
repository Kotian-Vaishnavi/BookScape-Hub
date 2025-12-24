const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const port = process.env.PORT || 5000;
require("dotenv").config();

// middleware
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://book-app-frontend-tau.vercel.app",
    ],
    credentials: true,
  })
);

// routes
const bookRoutes = require("./src/books/book.route");
const orderRoutes = require("./src/orders/order.route");
const userRoutes = require("./src/users/user.route");
const adminRoutes = require("./src/stats/admin.stats");

app.use("/api/books", bookRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/admin", adminRoutes);

// ⚡ Root route (always works, even if DB fails)
app.get("/", (req, res) => {
  res.send("Book Store Server is running!");
});

// connect to MongoDB
async function main() {
  await mongoose.connect(process.env.DB_URL);
  console.log("MongoDB connected successfully!");
}

main().catch((err) => console.log(err));

// start server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
