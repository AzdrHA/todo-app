import { handleError } from '../handler/errorHandler';
import { Response } from 'express';

const mockResponse = () => {
  const res = {} as Partial<Response>;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('handleError', () => {
  let res: Partial<Response>;

  beforeEach(() => {
    res = mockResponse();
  });

  it('devrait gérer une erreur de type inconnu et renvoyer "Erreur inconnue"', () => {
    const error: unknown = {};

    handleError(error, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Erreur inconnue' });
  });

  it('devrait gérer une erreur avec message "Tâche introuvable" et renvoyer le statut 404', () => {
    const error = new Error('Tâche introuvable.');

    handleError(error, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Tâche introuvable.' });
  });

  it('devrait gérer une erreur avec message générique et renvoyer le statut 500', () => {
    const error = new Error('Autre erreur');

    handleError(error, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Autre erreur' });
  });

  it('devrait gérer une erreur inconnue sans message et renvoyer le statut 500', () => {
    const error: unknown = {};

    handleError(error, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Erreur inconnue' });
  });

  it('devrait gérer une erreur de type non Error et renvoyer le statut 500', () => {
    const error = null;

    handleError(error, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Erreur inconnue' });
  });
});