import { Request, Response } from 'express';
import TodoService from '../services/todoService'
import { handleError } from '../handler/errorHandler';
import { ISearchParams } from '../interfaces/ISearchParams';

class TodoController {
  /**
   * Récupère une tâche par son ID depuis res.locals (middleware préalable)
   * @param {Request} req - L'objet de requête Express
   * @param {Response} res - L'objet de réponse Express
   * @returns {Promise<void>} - Réponse avec la tâche
   */
  public async getTodoById(req: Request, res: Response): Promise<void> {
    res.status(200).json(res.locals.todo);
  }

  /**
   * Crée une nouvelle tâche
   * @param {Request} req - L'objet de requête Express
   * @param {Response} res - L'objet de réponse Express
   * @returns {Promise<void>} - Réponse avec la tâche créée
   */
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const { title } = req.body;

      if (!title || typeof title !== 'string') {
        res.status(400).json({ message: 'Le titre est requis et doit être une chaîne de caractères.' });
        return;
      }

      const newTodo = await TodoService.create(title);
      res.status(201).json(newTodo);
    } catch (error) {
      handleError(error, res);
    }
  }

  /**
   * Met à jour une tâche existante
   * @param {Request} req - L'objet de requête Express
   * @param {Response} res - L'objet de réponse Express
   * @returns {Promise<void>} - Réponse avec la tâche mise à jour
   */
  public async patch(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { title, completed, priority } = req.body;

      if (!title || typeof title !== 'string') {
        res.status(400).json({ message: 'Le titre est requis et doit être une chaîne de caractères.' });
        return;
      }

      if (completed && !['true', 'false'].includes(completed.toString())) {
        res.status(400).json({ message: 'Valeur invalide pour « completed ». La valeur attendue est « true » ou « false ».' });
        return
      }

      if (priority && !['high', 'medium', 'low'].includes(priority.toString())) {
        res.status(400).json({ message: 'Valeur invalide pour « priority ». Valeur attendue pour « high », « medium », « low ».' });
        return
      }

      const updatedTodo = await TodoService.updateTodo(id, title, completed, priority);
      res.status(200).json(updatedTodo);
    } catch (error) {
      handleError(error, res);
    }
  }

  /**
   * Supprime une tâche par son ID
   * @param {Request} req - L'objet de requête Express
   * @param {Response} res - L'objet de réponse Express
   * @returns {Promise<void>} - Réponse avec confirmation de suppression
   */
  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await TodoService.delete(id);
      res.status(200).json({ message: 'Tâche supprimée avec succès.' });
    } catch (error) {
      handleError(error, res);
    }
  }

  /**
   * Modifie l'ordre des tâches
   * @param {Request} req - L'objet de requête Express
   * @param {Response} res - L'objet de réponse Express
   * @returns {Promise<void>} - Réponse avec confirmation de modification
   */
  public async reorder(req: Request, res: Response): Promise<void> {
    try {
      const { todos } = req.body;

      if (!Array.isArray(todos)) {
        res.status(400).json({ message: 'Les tâches doivent être envoyées sous forme de tableau.' });
        return;
      }

      await TodoService.reorder(todos);
      res.status(200).json({ message: 'Ordre mis à jour avec succès.' });
    } catch (error) {
      handleError(error, res);
    }
  }

  /**
   * Ajoute un tag à une tâche
   * @param {Request} req - L'objet de requête Express
   * @param {Response} res - L'objet de réponse Express
   * @returns {Promise<void>} - Réponse avec le tag ajouté à la tâche
   */
  public async addTagToTodo(req: Request, res: Response): Promise<void> {
    try {
      const { tagId } = req.params;
      const todo = res.locals.todo;
      const updatedTodo = await TodoService.addTagToTodo(todo, tagId);
      res.status(201).json(updatedTodo);
    } catch (error) {
      handleError(error, res);
    }
  }

  /**
   * Supprime un tag d'une tâche
   * @param {Request} req - L'objet de requête Express
   * @param {Response} res - L'objet de réponse Express
   * @returns {Promise<void>} - Réponse avec confirmation de la suppression du tag
   */
  public async removeTagFromTodo(req: Request, res: Response): Promise<void> {
    try {
      const { tagId } = req.params;
      const todo = res.locals.todo;
      const updatedTodo = await TodoService.removeTagFromTodo(todo, tagId);
      res.status(200).json(updatedTodo);
    } catch (error) {
      handleError(error, res);
    }
  }

  /**
   * Recherche des tâches avec des paramètres spécifiques
   * @param {Request} req - L'objet de requête Express
   * @param {Response} res - L'objet de réponse Express
   * @returns {Promise<void>} - Réponse avec la liste des tâches trouvées
   */
  public async search(req: Request, res: Response): Promise<void> {
    try {
      const { title, completed, priority, tags, page } = req.query;

      const searchParams: ISearchParams = {
        page: Number(page) || 1
      };

      if (completed && !['true', 'false', 'all'].includes(completed.toString())) {
        res.status(400).json({ message: 'Valeur invalide pour « completed ». La valeur attendue est « true », « false » ou « all ».' });
        return
      }

      if (priority && !['high', 'medium', 'low', 'all'].includes(priority.toString())) {
        res.status(400).json({ message: 'Valeur invalide pour « priority ». Valeur attendue pour « high », « medium », « low » ou « all ».' });
        return
      }

      if (title) searchParams.title = title as string;
      if (completed !== undefined && completed !== 'all') searchParams.completed = completed === 'true';
      if (priority && priority !== 'all') searchParams.priority = priority as 'high' | 'medium' | 'low';
      if (tags) searchParams.tags = (tags as string).split(',');

      const tasks = await TodoService.search(searchParams);
      res.status(200).json(tasks);
    } catch (error) {
      handleError(error, res);
    }
  }
}

export default new TodoController()