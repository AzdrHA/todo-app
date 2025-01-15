import { Request, Response } from 'express';
import tagService from '../services/tagService';
import { handleError } from '../handler/errorHandler';

class TagController {
  /**
   * Récupère tous les tags
   * @param {Request} req - Objet de requête Express
   * @param {Response} res - Objet de réponse Express
   * @returns {Promise<void>} - Liste des tags sous forme de réponse JSON
   */
  public getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const tags = await tagService.getAllTags();
      res.status(200).json(tags);
    } catch (error) {
      return handleError(error, res);
    }
  }

  /**
   * Crée un nouveau tag associé à une tâche (todo)
   * @param {Request} req - Objet de requête Express contenant les données du tag
   * @param {Response} res - Objet de réponse Express
   * @returns {Promise<void>} - Le tag créé sous forme de réponse JSON
   */
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const { todoId, title, color } = req.body;

      if (!todoId || !title || !color) {
        res.status(400).json({
          error: "Les champs 'todoId', 'title' et 'color' sont obligatoires.",
        });
      }

      if (typeof todoId !== 'string' || typeof title !== 'string' || typeof color !== 'string') {
        res.status(400).json({
          error: "Les champs 'todoId', 'title' et 'color' doivent être de type string.",
        });
      }

      const newTag = await tagService.createTagForTodo(todoId, title, color);
      res.status(201).json(newTag);
    } catch (error) {
      return handleError(error, res);
    }
  }
}

export default new TagController();