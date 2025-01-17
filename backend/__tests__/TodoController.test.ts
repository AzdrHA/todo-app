import request from 'supertest';
import app from '../server';
import todoService from '../services/todoService';
import Todo from '../models/Todo';
import Tag from '../models/Tag';

jest.mock('../services/todoService');

describe('POST /todos', () => {
  it('devrait renvoyer 400 si le titre est manquant ou n\'est pas une chaîne de caractères', async () => {
    const res = await request(app)
      .post('/api/todos')
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Le titre est requis et doit être une chaîne de caractères.');

    const resInvalidTitle = await request(app)
      .post('/api/todos')
      .send({ title: 123 });

    expect(resInvalidTitle.status).toBe(400);
    expect(resInvalidTitle.body.message).toBe('Le titre est requis et doit être une chaîne de caractères.');
  });

  it('devrait créer une nouvelle tâche et la renvoyer avec le statut 201', async () => {
    const mockTodo = { title: 'Test Todo', position: 1 };
    const mockSearchResult = { results: [mockTodo] };
    (todoService.create as jest.Mock).mockResolvedValue(mockSearchResult);

    const res = await request(app)
      .post('/api/todos')
      .send({ title: 'Test Todo' });

    expect(res.status).toBe(201);
    expect(res.body).toEqual(mockSearchResult);
    expect(todoService.create).toHaveBeenCalledWith('Test Todo');
  });

  it('devrait gérer les erreurs et renvoyer 500 en cas d\'erreur', async () => {
    const errorMessage = 'Database error';
    (todoService.create as jest.Mock).mockRejectedValue(new Error(errorMessage));

    const res = await request(app)
      .post('/api/todos')
      .send({ title: 'Test Todo' });

    expect(res.status).toBe(500);
    expect(res.body.message).toBe(errorMessage);
  });
});

describe('GET /todos/:id', () => {
  it('devrait renvoyer 200 et la tâche si elle a été trouvée', async () => {
    const mockTodo = { _id: '123', title: 'Test Todo' };

    (todoService.getTodoById as jest.Mock).mockResolvedValue(mockTodo)

    const res = await request(app).get('/api/todos/123')
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockTodo);
  });

  it('doit renvoyer 404 si l\'objet n\'est pas trouvé', async () => {
    (todoService.getTodoById as jest.Mock).mockResolvedValue(null);

    const res = await request(app)
      .get('/api/todos/123')
      .set('Accept', 'application/json');

    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Tâche introuvable.');
  });
});

describe('PATCH /todos/:id', () => {
  it('devrait renvoyer 400 si le titre est manquant ou n\'est pas une chaîne de caractères', async () => {
    const mockTodo = { _id: '123', title: 'Test Todo' };
    (todoService.getTodoById as jest.Mock).mockResolvedValue(mockTodo)

    const res = await request(app)
      .patch('/api/todos/123')
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Le titre est requis et doit être une chaîne de caractères.');

    const resInvalidTitle = await request(app)
      .patch('/api/todos/123')
      .send({ title: 123 });

    expect(resInvalidTitle.status).toBe(400);
    expect(resInvalidTitle.body.message).toBe('Le titre est requis et doit être une chaîne de caractères.');
  });

  it('devrait mettre à jour la tâche et la renvoyer avec le statut 200', async () => {
    const mockTodo = { _id: '123', title: 'Test Todo', completed: false, priority: 'low' };
    (todoService.updateTodo as jest.Mock).mockResolvedValue(mockTodo);

    const res = await request(app)
      .patch('/api/todos/123')
      .send({ title: 'Test Todo', completed: false, priority: 'low' });

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockTodo);
    expect(todoService.updateTodo).toHaveBeenCalledWith('123', 'Test Todo', false, 'low');
  });

  it('doit gérer les erreurs et renvoyer 500 en cas d\'erreur', async () => {
    const errorMessage = 'Database error';
    (todoService.updateTodo as jest.Mock).mockRejectedValue(new Error(errorMessage));

    const res = await request(app)
      .patch('/api/todos/123')
      .send({ title: 'Test Todo' });

    expect(res.status).toBe(500);
    expect(res.body.message).toBe(errorMessage);
  });

  it('doit renvoyer 400 si completed n\'est pas true, false', async () => {
    const mockTodo = { _id: '123', title: 'Test Todo' };
    (todoService.getTodoById as jest.Mock).mockResolvedValue(mockTodo)

    const res = await request(app)
      .patch('/api/todos/123')
      .send({ title: 'Test Todo', completed: 'invalidValue', priority: 'medium' });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Valeur invalide pour « completed ». La valeur attendue est « true » ou « false ».");
  });

  it('doit renvoyer 400 si la priorité n\'est pas l\'une des suivantes : high, medium, low, ou all.', async () => {
    const mockTodo = { _id: '123', title: 'Test Todo' };
    (todoService.getTodoById as jest.Mock).mockResolvedValue(mockTodo)

    const res = await request(app)
      .patch('/api/todos/123')
      .send({ title: 'Test Todo', completed: true, priority: 'invalidValue' });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Valeur invalide pour « priority ». Valeur attendue pour « high », « medium », « low ».");
  });
})

describe('DELETE /todos/:id', () => {
  it('devrait supprimer la tâche et renvoyer la liste mise à jour avec le statut 200', async () => {
    const mockSearchResult = { message: 'Tâche supprimée avec succès.' };
    (todoService.delete as jest.Mock).mockResolvedValue(mockSearchResult);

    const res = await request(app).delete('/api/todos/123');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockSearchResult);
    expect(todoService.delete).toHaveBeenCalledWith('123');
  });

  it('doit gérer les erreurs et renvoyer 500 en cas d\'erreur', async () => {
    const errorMessage = 'Database error';
    (todoService.delete as jest.Mock).mockRejectedValue(new Error(errorMessage));

    const res = await request(app).delete('/api/todos/123');

    expect(res.status).toBe(500);
    expect(res.body.message).toBe(errorMessage);
  });
})

describe('PATCH /todos/reorder', () => {
  it('devrait réorganiser les todos et renvoyer 200', async () => {
    const mockTodos = [{ _id: '123' }, { _id: '456' }];
    const mockSearchResult = { message: 'Ordre mis à jour avec succès.' };
    (todoService.reorder as jest.Mock).mockResolvedValue(mockSearchResult);

    const res = await request(app)
      .patch('/api/todos/reorder')
      .send({ todos: mockTodos });

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockSearchResult);
    expect(todoService.reorder).toHaveBeenCalledWith(mockTodos);
  });

  it('devrait renvoyer 400 si todos n\'est pas un tableau', async () => {
    const res = await request(app)
      .patch('/api/todos/reorder')
      .send({ todos: 'not an array' })

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Les tâches doivent être envoyées sous forme de tableau.');
  });
})

describe('POST /todos/:id/tags/:tagId', () => {
  const mockTodo = { _id: '123', title: 'Test Todo' };
  const mockTag = { _id: '456', name: 'Test Tag' };

  beforeEach(() => {
    Todo.findById = jest.fn().mockResolvedValue(mockTodo);
    Tag.findById = jest.fn().mockResolvedValue(mockTag);
  });

  it('devrait ajouter la balise à la tâche et la renvoyer avec le statut 201', async () => {
    (todoService.addTagToTodo as jest.Mock).mockResolvedValue(mockTodo);

    const res = await request(app)
      .post('/api/todos/123/tags/456');

    expect(res.status).toBe(201);
    expect(res.body).toEqual(mockTodo);
    expect(todoService.addTagToTodo).toHaveBeenCalledWith(mockTodo, '456');
  });

  it('doit gérer les erreurs et renvoyer 500 en cas d\'erreur', async () => {
    const errorMessage = 'Database error';
    (todoService.addTagToTodo as jest.Mock).mockRejectedValue(new Error(errorMessage));

    const res = await request(app)
      .post('/api/todos/123/tags/456');

    expect(res.status).toBe(500);
    expect(res.body.message).toBe(errorMessage);
  });
})

describe('DELETE /todos/:id/tags/:tagId', () => {
  const mockTag = { _id: '1', name: 'Test Tag' };
  const mockTodo = { _id: '1', title: 'Test Todo', tags: [mockTag] };

  beforeEach(() => {
    Todo.findById = jest.fn().mockResolvedValue(mockTodo);
    Tag.findById = jest.fn().mockResolvedValue(mockTag);
  });

  it('devrait supprimer la balise de la tâche et la renvoyer avec le statut 200', async () => {
    (todoService.removeTagFromTodo as jest.Mock).mockResolvedValue(mockTodo);

    const res = await request(app)
      .delete('/api/todos/1/tags/1');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockTodo);
  });
})

describe('GET /todos/search', () => {
  const mockTodos = [
    {
      _id: '1',
      title: 'Todo 1',
      position: 1,
      completed: false,
      priority: 'medium',
      tags: [{ _id: '1', name: 'Tag 1' }],
    },
    {
      _id: '2',
      title: 'Todo 2',
      position: 2,
      completed: true,
      priority: 'high',
      tags: [{ _id: '2', name: 'Tag 2' }],
    },
  ];

  beforeEach(() => {
    (todoService.search as jest.Mock).mockResolvedValue({
      results: mockTodos,
      totalCount: 2,
      page: 1,
      totalPages: 1,
    });
  });

  it('devrait renvoyer 200 et les résultats de la recherche si des paramètres valides sont fournis', async () => {
    const res = await request(app)
      .get('/api/todos/search')
      .query({ title: 'Todo', completed: 'false', priority: 'medium', page: '1' })
      .set('Accept', 'application/json');

    expect(res.status).toBe(200);
    expect(res.body.results).toEqual(mockTodos);
    expect(res.body.totalCount).toBe(2)
    expect(res.body.page).toBe(1);
    expect(res.body.totalPages).toBe(1);
  });

  it('doit renvoyer un tableau vide si aucun résultat n\'est trouvé', async () => {
    (todoService.search as jest.Mock).mockResolvedValue({
      results: [],
      totalCount: 0,
      page: 1,
      totalPages: 1,
    });

    const res = await request(app)
      .get('/api/todos/search')
      .query({ title: 'Nonexistent Todo' })
      .set('Accept', 'application/json');

    expect(res.status).toBe(200);
    expect(res.body.results).toEqual([]);
    expect(res.body.totalCount).toBe(0);
    expect(res.body.page).toBe(1);
    expect(res.body.totalPages).toBe(1);
  });

  it('doit renvoyer 400 si completed n\'est pas true, false ou all', async () => {
    const res = await request(app)
      .get('/api/todos/search')
      .query({ title: 'Todo', completed: 'invalidValue', priority: 'medium', page: '1' })
      .set('Accept', 'application/json');

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Valeur invalide pour « completed ». La valeur attendue est « true », « false » ou « all ».");
  });

  it('doit renvoyer 400 si la priorité n\'est pas l\'une des suivantes : high, medium, low, ou all.', async () => {
    const res = await request(app)
      .get('/api/todos/search')
      .query({ title: 'Todo', priority: 'invalidValue' })
      .set('Accept', 'application/json');

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Valeur invalide pour « priority ». Valeur attendue pour « high », « medium », « low » ou « all ».");
  });
})