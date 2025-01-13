import Todo from '../models/Todo';
import mongoose from 'mongoose';

class TodoService {
  public async getAll() {
    return Todo.find().populate('tags').sort('position').exec();
  }

  public async getTodoById(id: string) {
    return Todo.findById(id);
  }

  public async create(title: string) {
    const maxPositionTodo = await Todo.findOne().sort('-position').exec();
    const newPosition = maxPositionTodo ? maxPositionTodo.position + 1 : 1;
    const todo = new Todo({ title, position: newPosition });
    return todo.save();
  }

  public async updateTodo(todoId: string, title?: string, completed?: boolean) {
    const todo = await Todo.findById(todoId);
    if (!todo) throw new Error('Todo not found');
    if (title !== undefined) todo.title = title;
    if (completed !== undefined) todo.completed = completed;
    return todo.save();
  }

  public async delete(todoId: string) {
    const todo = await Todo.findById(todoId);
    if (!todo) throw new Error('Todo not found');
    await Todo.deleteOne({ _id: todoId });
    await Todo.updateMany({ position: { $gt: todo.position } }, { $inc: { position: -1 } });
    return todo;
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
    if (!todo) throw new Error('Todo not found');
    todo.tags.push(new mongoose.Types.ObjectId(tagId));
    return todo.save();
  }

  public async removeTagFromTodo(todoId: string, tagId: string) {
    const todo = await Todo.findById(todoId);
    if (!todo) throw new Error('Todo not found');
    todo.tags = todo.tags.filter((tag) => tag.toString() !== tagId);
    return todo.save();
  }
}

export default new TodoService();