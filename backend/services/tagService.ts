import Tag from '../models/Tag';
import Todo from '../models/Todo';

class TagService {
  public async createTagForTodo(todoId: string, title: string, color: string) {
    const todo = await Todo.findById(todoId);
    if (!todo) {
      throw new Error('Todo not found');
    }

    const tag = await Tag.create({ title, color });

    todo.tags.push(tag._id);
    await todo.save();

    return tag;
  }

  public async getAllTags() {
    return await Tag.find().exec();
  }
}

export default new TagService();