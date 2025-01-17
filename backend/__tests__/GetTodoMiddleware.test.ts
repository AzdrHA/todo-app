import { Request, Response } from 'express';
import { getTodoMiddleware } from '../middleware/getTodoMiddleware';
import TodoService from '../services/todoService';

jest.mock('../services/todoService');

describe('getTodoMiddleware', () => {
  it('devrait appeler next() si le todo est trouvé', async () => {
    const todoId = '1';
    const mockTodo = { _id: todoId, title: 'Test Todo', position: 1 };

    (TodoService.getTodoById as jest.Mock).mockResolvedValue(mockTodo);

    const req = { params: { id: todoId } } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: {},
    } as unknown as Response;
    const next = jest.fn();

    await getTodoMiddleware(req, res, next);

    expect(res.locals.todo).toEqual(mockTodo);

    expect(next).toHaveBeenCalled();
  });

  it('devrait envoyer 404 si la tâche n\'est pas trouvée', async () => {
    const todoId = '1';

    (TodoService.getTodoById as jest.Mock).mockResolvedValue(null);

    const req = { params: { id: todoId } } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: {},
    } as unknown as Response;
    const next = jest.fn();

    await getTodoMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Tâche introuvable.' });

    expect(next).not.toHaveBeenCalled();
  });

  it('devrait renvoyer 500 en cas d\'erreur', async () => {
    const todoId = '1';

    (TodoService.getTodoById as jest.Mock).mockRejectedValue(new Error('Database error'));

    const req = { params: { id: todoId } } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: {},
    } as unknown as Response;
    const next = jest.fn();

    await getTodoMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });

    expect(next).not.toHaveBeenCalled();
  });
});
