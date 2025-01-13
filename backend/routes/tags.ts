import express from 'express';
import Tag from '../models/Tag';
import Todo from '../models/Todo';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const tags = await Tag.find().exec();
    res.json(tags);
  } catch (error) {
    let message = 'Erreur inconnue'
    if (error instanceof Error) message = error.message
    res.status(500).json({ message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { todoId, title, color } = req.body;
    const action = await addTagToTodo(todoId, title, color);
    res.status(201).json(action);
  } catch (error) {
    let message = 'Erreur inconnue'
    if (error instanceof Error) message = error.message
    res.status(400).json({ message });
  }
});

const addTagToTodo = async (todoId: number, title: string, color: string) => {
  const todo = await Todo.findById(todoId);
  if (!todo) {
    throw new Error('Todo introuvable');
  }

  const tag = await Tag.create({
    title,
    color
  });

  todo.tags.push(tag._id);
  await todo.save();

  return tag;
};


export default router;
