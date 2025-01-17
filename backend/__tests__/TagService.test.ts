import Tag from '../models/Tag';
import Todo from '../models/Todo';
import TagService from '../services/tagService';

jest.mock('../models/Tag');
jest.mock('../models/Todo');

describe('TagService', () => {
  const mockTodo = {
    _id: 'todo123',
    title: 'Test Todo',
    tags: [],
    save: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('devrait créer un tag pour une tâche si la tâche existe et qu\'il n\'existe pas de tag avec le même titre et la même couleur', async () => {
    const title = 'Test Tag';
    const color = 'red';

    (Tag.findOne as jest.Mock).mockResolvedValue(null);
    (Todo.findById as jest.Mock).mockResolvedValue(mockTodo);
    (Tag.create as jest.Mock).mockResolvedValue({ _id: 'tag123', title, color });

    const result = await TagService.createTagForTodo('todo123', title, color);

    expect(Tag.create).toHaveBeenCalledWith({ title, color });
    expect(mockTodo.tags).toContain('tag123');
    expect(result).toEqual({ _id: 'tag123', title, color });
  });

  it('devrait générer une erreur si une balise avec le même titre et la même couleur existe déjà', async () => {
    const title = 'Test Tag';
    const color = 'red';

    (Tag.findOne as jest.Mock).mockResolvedValue({ _id: 'existingTag', title, color });

    await expect(TagService.createTagForTodo('todo123', title, color))
      .rejects
      .toThrowError('Un tag avec ce titre et cette couleur existe déjà');
  });

  it('devrait générer une erreur si la tâche n\'existe pas', async () => {
    const title = 'Test Tag';
    const color = 'blue';

    (Tag.findOne as jest.Mock).mockResolvedValue(null);
    (Todo.findById as jest.Mock).mockResolvedValue(null);

    await expect(TagService.createTagForTodo('todo123', title, color))
      .rejects
      .toThrowError('Tâche introuvable.');
  });

  it('devrait renvoyer tous les tags', async () => {
    const mockTags = [
      { _id: 'tag1', title: 'Tag 1', color: 'green' },
      { _id: 'tag2', title: 'Tag 2', color: 'blue' },
    ];

    (Tag.find as jest.Mock).mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockTags),
    });

    const result = await TagService.getAllTags();

    expect(result).toEqual(mockTags);
    expect(Tag.find).toHaveBeenCalled();
    expect(Tag.find().exec).toHaveBeenCalled();
  });
});