import express from 'express';
import TodoController from '../controllers/todoController'
import { getTodoMiddleware } from '../middleware/getTodoMiddleware';

const router = express.Router();

router.post('/', TodoController.create);
router.get('/search', TodoController.search);
router.patch('/reorder', TodoController.reorder);
router.get('/:id', getTodoMiddleware, TodoController.getTodoById);
router.patch('/:id', getTodoMiddleware, TodoController.patch);
router.delete('/:id', getTodoMiddleware, TodoController.delete);
router.post('/:id/tags/:tagId', getTodoMiddleware, TodoController.addTagToTodo);
router.delete('/:id/tags/:tagId', getTodoMiddleware, TodoController.removeTagFromTodo);

export default router;
