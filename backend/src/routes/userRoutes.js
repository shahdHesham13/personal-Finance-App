const express = require("express");
const { registerUser, loginUser, logoutUser, getUser, updateUser, changePassword } = require("../controllers/auth/userController.js");
const protect  = require("../middleware/authMiddleware.js");

const router = express.Router();

router.post('/register', registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/user", protect, getUser);
router.patch("/user", protect, updateUser);
router.patch("/change-password", protect, changePassword);

module.exports = router;