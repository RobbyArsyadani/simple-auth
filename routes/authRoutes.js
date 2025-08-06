const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getProfile,
  getAllUsers,
  onlyAdmin,
} = require("../controller/authController");
const verifyToken = require("../middleware/verifyToken");
const validate = require("../middleware/validate");
const { body } = require("express-validator");

const registerValidation = [
  body("username").isLength({ min: 3 }),
  body("password").isLength({ min: 3 }),
  body("role").optional().isIn(["user", "admin"]),
];

const loginValidation = [
  body("username").notEmpty(),
  body("password").notEmpty(),
];

router.post("/register", registerValidation, validate, register);
router.post("/login", loginValidation, validate, login);
router.get("/profile", verifyToken, getProfile);
router.get("/allUsers", getAllUsers);
router.get("/admin", verifyToken, onlyAdmin);

module.exports = router;

