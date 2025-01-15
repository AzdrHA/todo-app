import express from 'express';
import TodoController from '../controllers/todoController'
import {getTodo} from '../middleware/getTodoMiddleware'

const router = express.Router();

router.post('/', TodoController.create);
router.get('/search', TodoController.search);
router.put('/reorder', getTodo, TodoController.reorder);
router.get('/:id', getTodo, TodoController.getTodoById);
router.patch('/:id', getTodo, TodoController.patch);
router.delete('/:id', getTodo, TodoController.delete);
router.post('/:id/:tagId', getTodo, TodoController.addTagToTodo);
router.delete('/:id/:tagId', getTodo, TodoController.removeTagFromTodo);

export default router;
