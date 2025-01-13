import { Request, Response } from 'express';
import tagService from '../services/tagService';
import { handleError } from '../handler/errorHandler';

class TagController {
  public async getAll(req: Request, res: Response): Promise<void> {
    try {
      const tags = await tagService.getAllTags();
      res.json(tags);
    } catch (error) {
      handleError(error, res);
    }
  }

  public async create(req: Request, res: Response): Promise<void> {
    try {
      const { todoId, title, color } = req.body;
      const tag = await tagService.createTagForTodo(todoId, title, color);
      res.status(201).json(tag);
    } catch (error) {
      handleError(error, res);
    }
  }
}

export default new TagController();