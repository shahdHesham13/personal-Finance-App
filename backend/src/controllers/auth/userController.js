const asyncHandler = require("express-async-handler");
const User = require("../../models/auth/userModel.js");
const generateToken = require("../../helpers/generateToken.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register User
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Validation
  if (!name || !email || !password) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  // Check password length
  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  // Check if user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Create new user
  const user = await User.create({
    name,
    email,
    password,
  });

  // Generate token with user id
  const token = generateToken(user._id);

  // Send back the user and token in the response to the client
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    sameSite: "none",
    secure: true,
  });

  if (user) {
    const { _id, name, email, photo } = user;
    res.status(201).json({
      _id,
      name,
      email,
      photo,
      token,
    });
  } else {
    res.status(400).json({ message: "Invalid user data" });
  }
});

// Login User
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check if user exists
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "User not found, please sign up!" });
  }

  // Check if the password matches the hashed password in the database
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  // Generate token with user id
  const token = generateToken(user._id);

  if (user && isMatch) {
    const { _id, name, email, photo } = user;

    // Set the token in the cookie
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      sameSite: "none",
      secure: true,
    });

    // Send back the user and token in the response to the client
    res.status(200).json({
      _id,
      name,
      email,
      photo,
      token,
    });
  } else {
    res.status(400).json({ message: "Invalid email or password" });
  }
});

// Logout User
const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    path: "/",
  });

  res.status(200).json({ message: "User logged out" });
});

// Get User
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

// Update User
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.photo = req.body.photo || user.photo;

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      photo: updatedUser.photo,
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

// Change Password
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const user = await User.findById(req.user._id);

  // Compare current password with the hashed password in the database
  const isMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isMatch) {
    return res.status(400).json({ message: "Invalid password!" });
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.status(200).json({ message: "Password changed successfully" });
});

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  updateUser,
  changePassword,
};