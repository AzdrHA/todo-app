import { Request, Response } from 'express';
import TodoService from '../services/todoService'
import { handleError } from '../handler/errorHandler';
import { ISearchParams } from '../interfaces/ISearchParams';

class TodoController {
  public async getTodoById(req: Request, res: Response): Promise<void> {
    try {
      const todo = res.locals.todo;
      res.json(todo);
    } catch (error) {
      handleError(error, res);
    }
  }

  public async create(req: Request, res: Response): Promise<void> {
    try {
      const newTodo = await TodoService.create(req.body.title);
      res.status(201).json(newTodo);
    } catch (error) {
      handleError(error, res);
    }
  }

  public async patch(req: Request, res: Response): Promise<void> {
    try {
      const updatedTodo = await TodoService.updateTodo(req.params.id, req.body.title, req.body.completed, req.body.priority);
      res.json(updatedTodo);
    } catch (error) {
      handleError(error, res);
    }
  }

  public async delete(req: Request, res: Response): Promise<void> {
    try {
      await TodoService.delete(req.params.id);
      res.json({ message: 'Todo deleted' });
    } catch (error) {
      handleError(error, res);
    }
  }

  public async reorder(req: Request, res: Response): Promise<void> {
    try {
      await TodoService.reorder(req.body.todos);
      res.json({ message: 'Order updated' });
    } catch (error) {
      handleError(error, res);
    }
  }

  public async addTagToTodo(req: Request, res: Response): Promise<void> {
    try {
      const updatedTodo = await TodoService.addTagToTodo(res.locals.todo, req.params.tagId);
      res.json(updatedTodo);
    } catch (error) {
      handleError(error, res);
    }
  }

  public async removeTagFromTodo(req: Request, res: Response): Promise<void> {
    try {
      const updatedTodo = await TodoService.removeTagFromTodo(res.locals.todo, req.params.tagId);
      res.json(updatedTodo);
    } catch (error) {
      handleError(error, res);
    }
  }

  public async search(req: Request, res: Response): Promise<void> {
    try {
      const { title, completed, priority } = req.query;

      const searchParams: ISearchParams = {};

      if (title) {
        searchParams.title = title as string;
      }

      if (completed !== undefined && completed !== 'all') {
        searchParams.completed = completed === 'true';
      }

      if (priority && priority !== 'all') {
        searchParams.priority = priority as 'high' | 'medium' | 'low';
      }

      const tasks = await TodoService.search(searchParams);
      res.status(200).json(tasks);
    } catch (error) {
      handleError(error, res);
    }
  }
}

export default new TodoController()