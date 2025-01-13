import express from 'express';
import TodoController from '../controllers/todoController'
import {getTodo} from '../middleware/getTodoMiddleware'

const router = express.Router();

router.get('/', TodoController.getAll);
router.get('/:id', getTodo, TodoController.getTodoById);
router.post('/', TodoController.create);
router.patch('/:id', getTodo, TodoController.patch);
router.delete('/:id', getTodo, TodoController.delete);
router.put('/reorder', getTodo, TodoController.reorder);
router.post('/:id/:tagId', getTodo, TodoController.addTagToTodo);
router.delete('/:id/:tagId', getTodo, TodoController.removeTagFromTodo);

export default router;
