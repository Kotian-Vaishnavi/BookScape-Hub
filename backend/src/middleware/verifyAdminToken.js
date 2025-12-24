const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET_KEY || "  "; // fallback for dev

const verifyAdminToken = (req, res, next) => {
  // Expect token in Authorization header as "Bearer <token>"
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access Denied. No token provided" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid credentials" });
    }

    // Attach decoded payload to request
    req.user = decoded;

    // Optional: Ensure only admins can proceed
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Sellers only" });
    }

    next();
  });
};

module.exports = verifyAdminToken;
