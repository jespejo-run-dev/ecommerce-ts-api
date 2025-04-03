import { Router, Request, Response } from 'express';
import { UserAddressController } from '../controllers/UserAddressController';
import { authMiddleware } from '../middleware/authMiddleware';
import { AuthService } from '../../application/services/AuthService';

export function createUserAddressRoutes(controller: UserAddressController, authService: AuthService): Router {
  const router = Router();

  // Usar el middleware con authService
  router.use(authMiddleware(authService));

  router.post('/', (req: Request, res: Response) => controller.create(req, res));
  router.get('/', (req: Request, res: Response) => controller.findAll(req, res));
  router.put('/:id', (req: Request, res: Response) => controller.update(req, res));
  router.delete('/:id', (req: Request, res: Response) => controller.delete(req, res));

  return router;
}