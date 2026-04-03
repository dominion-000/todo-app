const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");

const User = require("./models/User");
const Task = require("./models/Task");
const session = require("express-session");
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");
const errorHandler = require("./middleware/errorHandler");


// allow sessions
app.use(session({
  secret: "secret-key",
  resave: false,
  saveUninitialized: false
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.set("view engine", "ejs");
app.set("views", "./ui");
app.use(express.static("public"));

// routes
app.get("/", (req, res) => {
  if (!req.session.userId) {
    return res.redirect("/login");
  }

  res.render("dashboard");
});

// ui
app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/login", (req, res) => {
  res.render("login");
});

// auth
app.use("/auth", authRoutes);

// tasks
app.use("/tasks", taskRoutes);

// test db
app.get("/test-db", async (req, res, next) => {
  try {
    const testCollection = mongoose.connection.db.collection("test");
    await testCollection.insertOne({ message: "DB works" });

    res.send("Inserted into DB");
  } catch (err) {
    next(err);
  }
});

// test models
app.get("/test-models", async (req, res, next) => {
  try {
    const user = await User.create({
      username: "testuser",
      password: "123456"
    });

    const task = await Task.create({
      title: "My first task",
      userId: user._id
    });

    res.json({ user, task });
  } catch (err) {
    next(err);
  }
});

// error handler
app.use(errorHandler);

// export
module.exports = app;
