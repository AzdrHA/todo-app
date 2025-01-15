import request from 'supertest';
import tagService from '../services/tagService';
import TodoService from '../services/todoService';
import app from '../server';

jest.mock('../services/todoService');
jest.mock('../services/tagService');

describe('GET /tags', () => {
  it('devrait retourner une liste de tags', async () => {
    (tagService.getAllTags as jest.Mock).mockResolvedValue([
      { _id: '1', title: 'Tag 1', color: 'red' },
      { _id: '2', title: 'Tag 2', color: 'blue' },
    ]);

    const response = await request(app).get('/api/tags');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { _id: '1', title: 'Tag 1', color: 'red' },
      { _id: '2', title: 'Tag 2', color: 'blue' },
    ]);
  });

  it('devrait retourner une erreur si le service échoue', async () => {
    (tagService.getAllTags as jest.Mock).mockRejectedValue(new Error('Erreur inconnue'));

    const response = await request(app).get('/api/tags');

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Erreur inconnue');
  });
});

describe('POST /tags', () => {
  it('devrait créer un nouveau tag', async () => {
    const newTag = { title: 'Tag 1', color: 'green' };

    // Mock du service
    (tagService.createTagForTodo as jest.Mock).mockResolvedValue({
      _id: '1',
      ...newTag,
    });

    const response = await request(app).post('/api/tags').send(newTag);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ _id: '1', ...newTag });
  });

  it('devrait retourner une erreur si la création échoue', async () => {
    const newTag = { title: 'Tag 1', color: 'green' };

    (tagService.createTagForTodo as jest.Mock).mockRejectedValue(new Error('Erreur de création'));

    const response = await request(app).post('/api/tags').send(newTag);

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Erreur de création');
  });
});

describe('POST /todos', () => {
  it('devrait créer une nouvelle tâche', async () => {
    const newTodo = { title: 'Nouvelle tâche' };

    (TodoService.create as jest.Mock).mockResolvedValue({ _id: '1', ...newTodo });

    const response = await request(app).post('/api/todos').send(newTodo);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ _id: '1', ...newTodo });
  });

  it('devrait retourner une erreur si la création échoue', async () => {
    const newTodo = { title: 'Nouvelle tâche' };

    (TodoService.create as jest.Mock).mockRejectedValue(new Error('Erreur de création'));

    const response = await request(app).post('/api/todos').send(newTodo);

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Erreur de création');
  });
});

describe('PATCH /todos/:id', () => {
  it('devrait mettre à jour une tâche existante', async () => {
    const updatedTodo = { title: 'Tâche mise à jour', completed: true, priority: 'high' };

    (TodoService.updateTodo as jest.Mock).mockResolvedValue({ _id: '1', ...updatedTodo });

    const response = await request(app).patch('/api/todos/1').send(updatedTodo);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ _id: '1', ...updatedTodo });
  });

  it('devrait retourner une erreur si la tâche est introuvable', async () => {
    const updatedTodo = { title: 'Tâche mise à jour' };

    (TodoService.updateTodo as jest.Mock).mockRejectedValue(new Error('Tâche introuvable'));

    const response = await request(app).patch('/api/todos/1').send(updatedTodo);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Tâche introuvable');
  });
});


