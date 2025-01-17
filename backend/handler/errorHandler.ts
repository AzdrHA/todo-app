import { Response } from 'express';

/**
 * Gère les erreurs et renvoie une réponse JSON appropriée
 * @param {unknown} error - L'erreur à gérer
 * @param {Response} res - Objet de réponse Express
 */
export const handleError = (error: unknown, res: Response): void => {
  if (error instanceof Error) {
    const message = error.message || 'Erreur inconnue';
    const statusCode = message === 'Tâche introuvable.' ? 404 : 500;
    res.status(statusCode).json({ message });
  } else {
    res.status(500).json({ message: 'Erreur inconnue' });
  }
};