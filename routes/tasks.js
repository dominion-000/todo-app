const express = require("express");
const router = express.Router();

const Task = require("../models/Task");
const authMiddleware = require("../middleware/authMiddleware");
const errorHandler = require("../middleware/errorHandler");


// CREATE TASK
router.post("/", authMiddleware, async (req, res, next) => {
  try {
    const { title } = req.body;

    const task = await Task.create({
      title,
      userId: req.session.userId
    });

    res.json(task);
  } catch (err) {
    next(err);
  }
});

// GET TASKS (for logged-in user only)
router.get("/", authMiddleware, async (req, res, next) => {
  try {
    const { status } = req.query;

    const filter = {
      userId: req.session.userId,
      status: { $ne: "deleted" }
    };

    // If user requests specific status
    if (status) {
      filter.status = status;
    }

    const tasks = await Task.find(filter);

    res.json(tasks);
  } catch (err) {
    next(err);
  }
});

// UPDATE TASK STATUS (complete/delete)
router.put("/:id", authMiddleware, async (req, res, next) => {
  try {
    const { status } = req.body;

    // Validate status
    if (!["pending", "completed", "deleted"].includes(status)) {
      return res.status(400).send("Invalid status");
    }

    const task = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.session.userId // ensures user owns task
      },
      { status },
      { new: true }
    );

    if (!task) {
      return res.status(404).send("Task not found");
    }

    res.json(task);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
