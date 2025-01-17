import Tag from '../models/Tag';
import Todo from '../models/Todo';
import { ITag } from '../interfaces/ITag';

class TagService {
  /**
   * Crée un tag pour une tâche (todo)
   * @param {string} todoId - L'ID de la tâche à laquelle le tag sera associé
   * @param {string} title - Le titre du tag
   * @param {string} color - La couleur du tag
   * @returns {Promise<Tag>} - Le tag créé
   * @throws {Error} - Si la tâche n'existe pas
   */
  public async createTagForTodo(todoId: string, title: string, color: string): Promise<ITag> {
    const existingTag = await Tag.findOne({ title, color });
    if (existingTag) {
      throw new Error('Un tag avec ce titre et cette couleur existe déjà.');
    }

    const todo = await Todo.findById(todoId);
    if (!todo) {
      throw new Error('Tâche introuvable.');
    }

    const tag = await Tag.create({ title, color });

    todo.tags.push(tag._id);
    await todo.save();

    return tag;
  }

  /**
   * Récupère tous les tags
   * @returns {Promise<Tag[]>} - Liste de tous les tags
   */
  public async getAllTags(): Promise<ITag[]> {
    return await Tag.find().exec();
  }
}

export default new TagService();