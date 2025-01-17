import TodoService from '../services/todoService';
import Todo from '../models/Todo';
import Tag from '../models/Tag';
import { ISearchParams } from '../interfaces/ISearchParams';

jest.mock('../models/Todo');
jest.mock('../models/Tag');

describe('getTodoById', () => {
  it('returns a todo when found', async () => {
    const todo = { _id: '1', title: 'Test Todo' };
    (Todo.findById as jest.Mock).mockResolvedValue(todo);

    const result = await TodoService.getTodoById('1');
    expect(result).toEqual(todo);
  });

  it('returns null when todo not found', async () => {
    (Todo.findById as jest.Mock).mockResolvedValue(null);

    const result = await TodoService.getTodoById('1');
    expect(result).toBeNull();
  });
});

describe('updateTodo', () => {
  it('should update the todo with the provided fields', async () => {
    const todoId = '1';
    const updatedTitle = 'Updated title';
    const updatedCompleted = true;
    const updatedPriority = 'high';

    const mockTodo = {
      _id: todoId,
      title: 'Old title',
      completed: false,
      priority: 'low',
      save: jest.fn().mockResolvedValue({
        _id: todoId,
        title: updatedTitle,
        completed: updatedCompleted,
        priority: updatedPriority,
      }),
    };

    (Todo.findById as jest.Mock).mockResolvedValue(mockTodo);

    const result = await TodoService.updateTodo(todoId, updatedTitle, updatedCompleted, updatedPriority);

    expect(Todo.findById).toHaveBeenCalledWith(todoId);
    expect(mockTodo.save).toHaveBeenCalled();

    expect(result).toEqual({
      _id: todoId,
      title: updatedTitle,
      completed: updatedCompleted,
      priority: updatedPriority,
    });
  });

  it('should throw an error if the todo is not found', async () => {
    const todoId = '1';

    (Todo.findById as jest.Mock).mockResolvedValue(null);

    await expect(TodoService.updateTodo(todoId)).rejects.toThrow('Tâche introuvable.');
  });

  it('should update only the fields that are provided', async () => {
    const todoId = '1';
    const updatedTitle = 'Updated title';

    const mockTodo = {
      _id: todoId,
      title: 'Old title',
      completed: false,
      priority: 'low',
      save: jest.fn().mockResolvedValue({
        _id: todoId,
        title: updatedTitle,
        completed: false,
        priority: 'low',
      }),
    };

    (Todo.findById as jest.Mock).mockResolvedValue(mockTodo);

    const result = await TodoService.updateTodo(todoId, updatedTitle);

    expect(Todo.findById).toHaveBeenCalledWith(todoId);
    expect(mockTodo.save).toHaveBeenCalled();

    expect(result).toEqual({
      _id: todoId,
      title: updatedTitle,
      completed: false,
      priority: 'low',
    });
  });
})

describe('reorder', () => {
  it('should update the position of todos correctly', async () => {
    const todos = [
      { _id: '1' },
      { _id: '2' },
      { _id: '3' },
    ];

    (Todo.bulkWrite as jest.Mock) = jest.fn().mockResolvedValue(undefined);
    await TodoService.reorder(todos);
    expect(Todo.bulkWrite).toHaveBeenCalledWith([
      {
        updateOne: {
          filter: { _id: '1' },
          update: { position: 1 },
        },
      },
      {
        updateOne: {
          filter: { _id: '2' },
          update: { position: 2 },
        },
      },
      {
        updateOne: {
          filter: { _id: '3' },
          update: { position: 3 },
        },
      },
    ]);

    expect(Todo.bulkWrite).toHaveBeenCalledTimes(1);
  });
})

describe('addTagToTodo', () => {
  it('adds a tag to the todo successfully', async () => {
    const todoId = '1';
    const tagId = 'tag2';

    const mockTodo = {
      _id: todoId,
      tags: [{ _id: 'tag1', name: 'Important' }],
      save: jest.fn().mockResolvedValue({
        _id: todoId,
        tags: [{ _id: 'tag1', name: 'Important' }, { _id: 'tag2', name: 'Urgent' }],
      }),
    };
    const mockTag = { _id: tagId, name: 'Urgent' };

    (Todo.findById as jest.Mock).mockResolvedValue(mockTodo);
    (Tag.findById as jest.Mock).mockResolvedValue(mockTag);

    const result = await TodoService.addTagToTodo(todoId, tagId);

    expect(Todo.findById).toHaveBeenCalledWith(todoId);
    expect(Tag.findById).toHaveBeenCalledWith(tagId);
    expect(mockTodo.tags).toEqual([
      { _id: 'tag1', name: 'Important' },
      { _id: 'tag2', name: 'Urgent' },
    ]);
    expect(mockTodo.save).toHaveBeenCalled();
    expect(result).toEqual({
      _id: todoId,
      tags: [{ _id: 'tag1', name: 'Important' }, { _id: 'tag2', name: 'Urgent' }],
    });
  });

  it('throws an error when the todo is not found', async () => {
    const todoId = '1';
    const tagId = 'tag2';

    (Todo.findById as jest.Mock).mockResolvedValue(null);

    await expect(TodoService.addTagToTodo(todoId, tagId)).rejects.toThrow('Tâche introuvable.');

    expect(Todo.findById).toHaveBeenCalledWith(todoId);
  });

  it('throws an error when the tag is not found', async () => {
    const todoId = '1';
    const tagId = 'tag2';

    const mockTodo = {
      _id: todoId,
      tags: ['tag1'],
      save: jest.fn().mockResolvedValue({
        _id: todoId,
        tags: ['tag1'],
      }),
    };

    (Todo.findById as jest.Mock).mockResolvedValue(mockTodo);
    (Tag.findById as jest.Mock).mockResolvedValue(null);

    await expect(TodoService.addTagToTodo(todoId, tagId)).rejects.toThrow('Étiquette non trouvée');

    expect(Todo.findById).toHaveBeenCalledWith(todoId);
    expect(Tag.findById).toHaveBeenCalledWith(tagId);
  });

  it('does nothing if the tag is already present in the todo', async () => {
    const todoId = '1';
    const tagId = 'tag1';

    const mockTodo = {
      _id: todoId,
      tags: [{ _id: 'tag1', name: 'Important' }],
      save: jest.fn().mockResolvedValue({
        _id: todoId,
        tags: [{ _id: 'tag1', name: 'Important' }],
      }),
    };

    const mockTag = { _id: tagId, name: 'Important' };

    (Todo.findById as jest.Mock).mockResolvedValue(mockTodo);
    (Tag.findById as jest.Mock).mockResolvedValue(mockTag);

    const result = await TodoService.addTagToTodo(todoId, tagId);

    expect(Todo.findById).toHaveBeenCalledWith(todoId);
    expect(Tag.findById).toHaveBeenCalledWith(tagId);

    expect(mockTodo.tags).toEqual(expect.arrayContaining([{ _id: 'tag1', name: 'Important' }]));

    expect(mockTodo.save).not.toHaveBeenCalled();

    const { save, ...resultWithoutSave } = result;
    expect(resultWithoutSave).toEqual({
      _id: todoId,
      tags: [{ _id: 'tag1', name: 'Important' }],
    });
  });


});

describe('removeTagFromTodo', () => {
  it('removes a tag from the todo successfully', async () => {
    const todoId = '1';
    const tagId = 'tag2';

    const mockTodo = {
      _id: todoId,
      tags: ['tag1', 'tag2', 'tag3'],
      save: jest.fn().mockResolvedValue({
        _id: todoId,
        tags: ['tag1', 'tag3'],
      }),
    };

    (Todo.findById as jest.Mock).mockResolvedValue(mockTodo);

    const result = await TodoService.removeTagFromTodo(todoId, tagId);

    expect(Todo.findById).toHaveBeenCalledWith(todoId);
    expect(mockTodo.tags).toEqual(['tag1', 'tag3']);
    expect(mockTodo.save).toHaveBeenCalled();
    expect(result).toEqual({
      _id: todoId,
      tags: ['tag1', 'tag3'],
    });
  });

  it('throws an error when the todo is not found', async () => {
    const todoId = '1';
    const tagId = 'tag2';

    (Todo.findById as jest.Mock).mockResolvedValue(null);

    await expect(TodoService.removeTagFromTodo(todoId, tagId)).rejects.toThrow('Tâche introuvable.');

    expect(Todo.findById).toHaveBeenCalledWith(todoId);
  });

  it('does nothing if the tag is not present in the todo', async () => {
    const todoId = '1';
    const tagId = 'tag4';

    const mockTodo = {
      _id: todoId,
      tags: ['tag1', 'tag2', 'tag3'],
      save: jest.fn().mockResolvedValue({
        _id: todoId,
        tags: ['tag1', 'tag2', 'tag3'],
      }),
    };

    (Todo.findById as jest.Mock).mockResolvedValue(mockTodo);

    const result = await TodoService.removeTagFromTodo(todoId, tagId);

    expect(Todo.findById).toHaveBeenCalledWith(todoId);
    expect(mockTodo.tags).toEqual(['tag1', 'tag2', 'tag3']);
    expect(mockTodo.save).toHaveBeenCalled();
    expect(result).toEqual({
      _id: todoId,
      tags: ['tag1', 'tag2', 'tag3'],
    });
  });
});

describe('search', () => {
  it('returns results with pagination and total count', async () => {
    const params: ISearchParams = {
      title: 'Test',
      completed: true,
      priority: 'high',
      tags: ['tag1', 'tag2'],
      page: 2
    };

    const mockResults = [
      { _id: '1', title: 'Test Todo 1', completed: true },
      { _id: '2', title: 'Test Todo 2', completed: true },
    ];
    const mockTotalCount = 25;

    (Todo.find as jest.Mock).mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockResults),
      }),
    });

    (Todo.countDocuments as jest.Mock).mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockTotalCount),
    });

    const result = await TodoService.search(params);

    expect(Todo.find).toHaveBeenCalledWith({
      completed: true,
      priority: 'high',
      title: { $regex: 'Test', $options: 'i' },
      tags: { $in: ['tag1', 'tag2'] },
    });

    expect(result).toEqual({
      results: mockResults,
      totalCount: mockTotalCount,
      page: 2,
      totalPages: 3,
    });
  });

  it('handles search without optional parameters', async () => {
    const params: ISearchParams = { page: 1 };
    const mockResults = [{ _id: '1', title: 'Default Todo', completed: false }];
    const mockTotalCount = 1;

    (Todo.find as jest.Mock).mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockResults),
      }),
    });

    (Todo.countDocuments as jest.Mock).mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockTotalCount),
    });

    const result = await TodoService.search(params);

    expect(Todo.find).toHaveBeenCalledWith({});

    expect(result).toEqual({
      results: mockResults,
      totalCount: mockTotalCount,
      page: 1,
      totalPages: 1,
    });
  });

  it('returns empty results when no todos match', async () => {
    const params = { title: 'NonExistent', page: 1 };

    (Todo.find as jest.Mock).mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue([]),
      }),
    });

    (Todo.countDocuments as jest.Mock).mockReturnValue({
      exec: jest.fn().mockResolvedValue(0),
    });

    const result = await TodoService.search(params);

    expect(Todo.find).toHaveBeenCalledWith({
      title: { $regex: 'NonExistent', $options: 'i' },
    });

    expect(result).toEqual({
      results: [],
      totalCount: 0,
      page: 1,
      totalPages: 0,
    });
  });
});
