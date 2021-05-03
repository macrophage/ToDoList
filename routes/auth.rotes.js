require("dotenv").config();
const { Router } = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { check, validationResult } = require("express-validator");
const router = Router();
// /api/auth/register
router.post(
  "/register",
  [
    check("email", "Email is incorrect").isEmail(),
    check("password", "Minimum password length is 6 symbols").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { password, email, username } = req.body;

      const userExist = User.findOne({ email });

      if (userExist) {
        res.status(400).json({ message: "User already exist" });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({
        email: email,
        password: hashedPassword,
        username: username,
      });
      await user.save();

      res.status(201).json({ message: "User have been created" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Something went wrong, please try again" });
    }
  }
);
// /api/auth/login
router.post(
  "/login",
  [
    check("email", "Email is incorrect").normalizeEmail().isEmail(),
    check("password").exists(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, username } = req.body;

      const userExist = await User.findOne({ email });

      if (!userExist) {
        return res.status(400).json({ message: "Email or password incorrect" });
      }

      const isMatch = bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Email or password incorrect" });
      }

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      res.json({ token, userId: user.id });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Something went wrong, please try again" });
    }
  }
);
module.exports = router;
