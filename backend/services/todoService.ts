import Todo from '../models/Todo';
import { ISearchParams } from '../interfaces/ISearchParams';
import Tag from '../models/Tag';
import { ISearchCondition } from '../interfaces/ISearchCondition';
import { ITodo } from '../interfaces/ITodo';
import { ISearchResult } from '../interfaces/ISearchResult';

class TodoService {
  /**
   * Récupère une tâche par son ID.
   * @param {string} id - L'ID de la tâche à récupérer
   * @returns {Promise<ITodo | null>} - La tâche ou null si non trouvée
   */
  public async getTodoById(id: string): Promise<ITodo | null> {
    return Todo.findById(id);
  }

  /**
   * Crée une nouvelle tâche.
   * @param {string} title - Le titre de la tâche
   * @returns {Promise<ISearchResult>} - Liste des tâches après création
   */
  public async create(title: string): Promise<ISearchResult> {
    const maxPositionTodo = await Todo.findOne().sort('-position').exec();
    const newPosition = maxPositionTodo ? maxPositionTodo.position + 1 : 1;

    const todo = new Todo({ title, position: newPosition });
    await todo.save();

    return this.search({ page: 1 });
  }

  /**
   * Met à jour une tâche existante.
   * @param {string} todoId - L'ID de la tâche
   * @param {string} [title] - Nouveau titre
   * @param {boolean} [completed] - Nouveau statut de complétion
   * @param {string} [priority] - Nouvelle priorité
   * @returns {Promise<ITodo>} - La tâche mise à jour
   */
  public async updateTodo(
    todoId: string,
    title?: string,
    completed?: boolean,
    priority?: ITodo['priority']
  ): Promise<ITodo> {
    const todo = await Todo.findById(todoId);
    if (!todo) throw new Error('Tâche introuvable.');

    if (title !== undefined) todo.title = title;
    if (completed !== undefined) todo.completed = completed;
    if (priority !== undefined) todo.priority = priority;

    return todo.save();
  }

  /**
   * Supprime une tâche par son ID.
   * @param {string} todoId - L'ID de la tâche à supprimer
   * @returns {Promise<ISearchResult>} - Liste des tâches après suppression
   */
  public async delete(todoId: string): Promise<ISearchResult> {
    const todo = await Todo.findById(todoId);
    if (!todo) throw new Error('Tâche introuvable.');

    await Todo.deleteOne({ _id: todoId });
    await Todo.updateMany({ position: { $gt: todo.position } }, { $inc: { position: -1 } });

    return this.search({ page: 1 });
  }

  /**
   * Modifie l'ordre des tâches.
   * @param {Array<{_id: string}>} todos - Liste des tâches à réorganiser
   * @returns {Promise<void>} - Résultat de l'opération de mise à jour
   */
  public async reorder(todos: Array<{ _id: string }>): Promise<void> {
    const bulkOps = todos.map((todo, index) => ({
      updateOne: {
        filter: { _id: todo._id },
        update: { position: index + 1 }
      }
    }));
    await Todo.bulkWrite(bulkOps as never);
  }

  /**
   * Ajoute un tag à une tâche.
   * @param {string} todoId - L'ID de la tâche
   * @param {string} tagId - L'ID du tag
   * @returns {Promise<ITodo>} - La tâche mise à jour avec le tag ajouté
   */
  public async addTagToTodo(todoId: string, tagId: string): Promise<ITodo> {
    const todo = await Todo.findById(todoId);
    if (!todo) throw new Error('Tâche introuvable.');

    const tag = await Tag.findById(tagId);
    if (!tag) throw new Error('Étiquette non trouvée.');

    const tagExists = todo.tags.some(existingTag => existingTag._id.toString() === tagId);
    if (tagExists) {
      return todo;
    }

    todo.tags.push(tag);
    return todo.save();
  }


  /**
   * Supprime un tag d'une tâche.
   * @param {string} todoId - L'ID de la tâche
   * @param {string} tagId - L'ID du tag à supprimer
   * @returns {Promise<ITodo>} - La tâche mise à jour sans le tag
   */
  public async removeTagFromTodo(todoId: string, tagId: string): Promise<ITodo> {
    const todo = await Todo.findById(todoId);
    if (!todo) throw new Error('Tâche introuvable.');

    const tag = await Tag.findById(tagId);
    if (!tag) throw new Error('Étiquette non trouvée.');

    todo.tags = todo.tags.filter((tag) => tag.toString() !== tagId);
    return todo.save();
  }

  /**
   * Recherche des tâches en fonction de critères donnés.
   * @param {ISearchParams} params - Paramètres de recherche
   * @returns {Promise<ISearchResult>} - Résultats de la recherche avec pagination
   */
  public async search(params: ISearchParams): Promise<ISearchResult> {
    const limit = 10;
    const { title, completed, priority, tags, page = 1 } = params;

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