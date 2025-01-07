const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/auth/userModel.js");

const protect = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      res.status(401).json({ message: "Not authorized, please login!" });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      res.status(404).json({ message: "User not found!" });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed!" });
  }
});

module.exports = protect;