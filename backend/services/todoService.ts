import Todo from '../models/Todo';
import { ISearchParams } from '../interfaces/ISearchParams';
import Tag from '../models/Tag';
import { ISearchCondition } from '../interfaces/ISearchCondition';
import { ITodo } from '../interfaces/ITodo';

class TodoService {
  public async getTodoById(id: string) {
    return Todo.findById(id);
  }

  public async create(title: string) {
    const maxPositionTodo = await Todo.findOne().sort('-position').exec();
    const newPosition = maxPositionTodo ? maxPositionTodo.position + 1 : 1;
    const todo = new Todo({ title, position: newPosition });
    await todo.save();

    return this.search({page: 1})
  }

  public async updateTodo(todoId: string, title?: string, completed?: boolean, priority?: ITodo['priority']) {
    const todo = await Todo.findById(todoId);
    if (!todo) throw new Error('Todo not found');
    if (title !== undefined) todo.title = title;
    if (completed !== undefined) todo.completed = completed;
    if (priority !== undefined) todo.priority = priority;
    return todo.save();
  }

  public async delete(todoId: string) {
    const todo = await Todo.findById(todoId);
    if (!todo) throw new Error('Todo not found');
    await Todo.deleteOne({ _id: todoId });
    await Todo.updateMany({ position: { $gt: todo.position } }, { $inc: { position: -1 } });
    return this.search({page: 1})
  }

  public async reorder(todos: Array<{ _id: string }>) {
    const bulkOps = todos.map((todo, index) => ({
      updateOne: {
        filter: { _id: todo._id },
        update: { position: index + 1 }
      }
    }));
    return Todo.bulkWrite(bulkOps as never);
  }

  public async addTagToTodo(todoId: string, tagId: string) {
    const todo = await Todo.findById(todoId);
    const tag = await Tag.findById(tagId);
    if (!todo) throw new Error('Todo not found');
    if (!tag) throw new Error('Tag not found');
    todo.tags.push(tag);
    return todo.save();
  }

  public async removeTagFromTodo(todoId: string, tagId: string) {
    const todo = await Todo.findById(todoId);
    if (!todo) throw new Error('Todo not found');
    todo.tags = todo.tags.filter((tag) => tag.toString() !== tagId);
    return todo.save();
  }

  public async search(params: ISearchParams) {
    const limit = 10

    const { title, completed, priority, tags, page = 1 } = params;

    if (completed && !['true', 'false', 'all'].includes(completed.toString())) {
      throw new Error("Invalid value for 'completed'. Expected 'true', 'false', or 'all'.");
    }

    if (priority && !['high', 'medium', 'low', 'all'].includes(priority)) {
      throw new Error("Invalid value for 'priority'. Expected 'high', 'medium', 'low', or 'all'.");
    }

    const searchConditions: ISearchCondition = {};

    if (title) {
      searchConditions.title = { $regex: title, $options: 'i' };
    }

    if (completed !== undefined && completed !== "all") {
      searchConditions.completed = completed;
    }

    if (priority !== undefined && priority !== "all") {
      searchConditions.priority = priority;
    }

    if (tags && tags.length > 0) {
      searchConditions.tags = { $in: tags };
    }

    const skip = (page - 1) * limit;

    const results = await Todo.find(searchConditions)
      .populate('tags')
      .sort('position')
      .skip(skip)
      .limit(limit)
      .exec();

    const totalCount = await Todo.countDocuments(searchConditions).exec();

    return {
      results,
      totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit),
    };
  }
}

export default new TodoService();