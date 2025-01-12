const express = require("express");
const router = express.Router();
const Tag = require("../models/Tag");
const Todo = require("../models/Todo");

router.get("/", async (req, res) => {
  try {
    const tags = await Tag.find().exec();
    res.json(tags);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { todoId, title, color } = req.body;
    const action = await addTagToTodo(todoId, title, color);
    res.status(201).json(action);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

const addTagToTodo = async (todoId, title, color) => {
  const todo = await Todo.findById(todoId);
  if (!todo) {
    throw new Error("Todo introuvable");
  }

  const tag = await Tag.create({
    title,
    color
  });

  todo.tags.push(tag._id);
  await todo.save();

  return tag;
};


module.exports = router;
