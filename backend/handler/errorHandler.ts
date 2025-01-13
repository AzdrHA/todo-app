import { Response } from 'express';

export const handleError = (error: unknown, res: Response): void => {
  if (error instanceof Error) {
    const message = error.message || 'Unknown error';
    const statusCode = message === 'Todo not found' ? 404 : 500;
    res.status(statusCode).json({ message });
  } else {
    res.status(500).json({ message: 'Unknown error' });
  }
};