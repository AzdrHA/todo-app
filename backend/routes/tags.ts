import express from 'express';
import TagController from '../controllers/tagController';

const router = express.Router();

router.get('/', TagController.getAll);
router.post('/', TagController.create);

export default router;
