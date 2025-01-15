import { Request, Response, NextFunction } from 'express';
import TodoService from '../services/todoService'

/**
 * Middleware pour récupérer une tâche (Todo) par son ID.
 * @param {Request} req - L'objet de requête Express contenant l'ID de la tâche
 * @param {Response} res - L'objet de réponse Express
 * @param {NextFunction} next - La fonction next pour passer au middleware suivant
 * @returns {void} - Aucune valeur retournée directement, mais passe au middleware suivant si la tâche est trouvée
 */
export async function getTodo(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const todo = await TodoService.getTodoById(req.params.id);

    if (!todo) {
      res.status(404).json({ message: 'Tâche introuvable' });
    }

    res.locals.todo = todo;

    next();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue';
    res.status(500).json({ message });
  }
}