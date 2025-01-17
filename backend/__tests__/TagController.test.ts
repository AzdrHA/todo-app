import request from 'supertest';
import tagService from '../services/tagService';
import app from '../server';

jest.mock('../services/tagService');

describe('POST /tags', () => {
  it('devrait créer un nouveau tag si les données sont valides', async () => {
    const newTag = { _id: '1', title: 'Tag 1', color: 'red' };
    (tagService.createTagForTodo as jest.Mock).mockResolvedValue(newTag);

    const response = await request(app)
      .post('/api/tags')
      .send({ todoId: '123', title: 'Tag 1', color: 'red' });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(newTag);
    expect(tagService.createTagForTodo).toHaveBeenCalledWith('123', 'Tag 1', 'red');
  });

  it('devrait retourner une erreur 500 si le service échoue', async () => {
    (tagService.createTagForTodo as jest.Mock).mockRejectedValue(new Error('Erreur inconnue'));

    const response = await request(app)
      .post('/api/tags')
      .send({ todoId: '123', title: 'Tag 1', color: 'red' });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Erreur inconnue');
  });

  it('devrait retourner 400 si le champ todoId ou title ou color est manquant', async () => {
    const response = await request(app)
      .post('/api/tags')
      .send({ todoId: '123' });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Les champs 'todoId', 'title' et 'color' sont obligatoires.");
  })

  it('devrait retourner 400 si le champ todoId ou title ou color n\'est pas une chaîne de caractères', async () => {
    const response = await request(app)
      .post('/api/tags')
      .send({ todoId: 123, title: 'Tag 1', color: 'red' });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Les champs 'todoId', 'title' et 'color' doivent être de type string.");
  })
});

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
