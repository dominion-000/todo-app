const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();

const User = require("../models/User");
const errorHandler = require("../middleware/errorHandler");

// use error handler
app.use(errorHandler);

// REGISTER
router.post("/register", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // check if user exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).send("User already exists");
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = await User.create({
      username,
      password: hashedPassword
    });

    res.send("User registered ✅");
  } catch (err) {
    next(err);
  }
});

// LOGIN
router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).send("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send("Invalid credentials");
    }

    // store session
    req.session.userId = user._id;

    res.send("Login successful ✅");
  } catch (err) {
    next(err);
  }
});

module.exports = router;
