// generateToken.js
const jwt = require("jsonwebtoken");

// Replace this with the JWT secret used in your backend
const JWT_SECRET_KEY = " // ";

// Payload can be anything your backend expects (usually admin id or email)
const payload = {
  id: "abc123", // you can put any string here for testing
  role: "admin", // optional, if your backend checks role
};

// Generate token (expires in 1 day)
const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: "30d" });

console.log("Your token:\n", token);
