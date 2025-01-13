import express, {Request, Response, NextFunction} from 'express';
import Todo from '../models/Todo';
import mongoose from 'mongoose';
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const todos = await Todo.find().populate('tags').sort('position').exec();
    res.json(todos);
  } catch (error) {
    let message = 'Erreur inconnue'
    if (error instanceof Error) message = error.message
    res.status(500).json({ message });
  }
});

// GET one todo
router.get('/:id', getTodo, (req, res) => {
  res.json(res.locals.todo);
});

// CREATE a todo
router.post('/', async (req, res) => {
  try {
    const maxPositionTodo = await Todo.findOne().sort('-position').exec();
    const newPosition = maxPositionTodo ? maxPositionTodo.position + 1 : 1;

    const todo = new Todo({
      title: req.body.title,
      position: newPosition
    });
    const newTodo = await todo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    let message = 'Erreur inconnue'
    if (error instanceof Error) message = error.message
    res.status(400).json({ message });
  }
});

// UPDATE a todo
router.patch('/:id', getTodo, async (req, res) => {
  if (req.body.title != null) {
    res.locals.todo.title = req.body.title;
  }
  if (req.body.completed != null) {
    res.locals.todo.completed = req.body.completed;
  }
  try {
    const updatedTodo = await res.locals.todo.save();
    res.json(updatedTodo);
  } catch (error) {
    let message = 'Erreur inconnue'
    if (error instanceof Error) message = error.message
    res.status(400).json({ message });
  }
});

// DELETE a todo
router.delete('/:id', getTodo, async (req, res) => {
  try {
    const deletedTodo = await Todo.findById(req.params.id);

    if (!deletedTodo) {
      res.status(404).json({ message: 'Todo not found' });
      return
    }

    await Todo.deleteOne({ _id: req.params.id });

    // Mettre à jour les positions des todos restants
    await Todo.updateMany(
      { position: { $gt: deletedTodo.position } },
      { $inc: { position: -1 } }
    );

    res.json({ message: 'Deleted Todo' });
  } catch (error) {
    let message = 'Erreur inconnue'
    if (error instanceof Error) message = error.message
    res.status(500).json({ message });
  }
});

// REORDER todos
router.put('/reorder', async (req, res) => {
  const { todos } = req.body; // Array de todos avec les nouvelles positions

  if (!Array.isArray(todos)) {
    res.status(400).json({ message: 'Invalid data format' });
    return
  }

  try {
    const bulkOps = todos.map((todo, index) => ({
      updateOne: {
        filter: { _id: todo._id },
        update: { position: index + 1 }
      }
    }));

    await Todo.bulkWrite(bulkOps);
    res.json({ message: 'Order updated successfully' });
  } catch (error) {
    let message = 'Unknown error';
    if (error instanceof Error) message = error.message;
    res.status(500).json({ message });
  }
});

router.post('/:id/:tagId', getTodo, async (req, res) => {
  try {
    const todo = await Todo.findById(res.locals.todo);

    if (!todo) {
      res.status(404).json({ message: 'Todo not found' });
      return
    }

    const tagId = new mongoose.Types.ObjectId(req.params.tagId); // Convert tagId to ObjectId
    todo.tags.push(tagId); // Assuming tags is an array of ObjectId
    await todo.save();

    res.json(todo);
  } catch (error) {
    let message = 'Unknown error';
    if (error instanceof Error) message = error.message;
    res.status(500).json({ message });
  }
});

router.delete('/:id/:tagId', getTodo, async (req, res) => {
  const todo = await Todo.findById(res.locals.todo);

  if (!todo) {
    res.status(404).json({ message: 'Todo not found' });
    return
  }

  todo.tags = todo.tags.filter((tag) => tag._id.toString() !== req.params.tagId);
  await todo.save();

  res.json(res.locals.todo);
});

async function getTodo(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      res.status(404).json({ message: 'Todo not found' });
    }

    res.locals.todo = todo;
    return next();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message });
  }
}

export default router;
