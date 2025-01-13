import { Request, Response, NextFunction } from 'express';
import TodoService from '../services/todoService'

export async function getTodo(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const todo = await TodoService.getTodoById(req.params.id);

    if (!todo) {
      res.status(404).json({ message: 'Todo not found' });
      return
    }

    res.locals.todo = todo;
    return next();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message });
  }
}