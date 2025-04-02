import { Router, Request, Response } from 'express';
import { CartController } from '../controllers/CartController';
import { authMiddleware } from '../middleware/authMiddleware';
import { AuthService } from '../../application/services/AuthService';

export function createCartRoutes(controller: CartController, authService: AuthService): Router {
  const router = Router();

  // Usar el middleware con authService
  router.use(authMiddleware(authService));

  router.get('/', (req: Request, res: Response) => controller.getCart(req, res));
  router.post('/items', (req: Request, res: Response) => controller.addItem(req, res));
  router.delete('/items/:productId', (req: Request, res: Response) => controller.removeItem(req, res));
  router.patch('/items/:productId/quantity', (req: Request, res: Response) => controller.updateQuantity(req, res));
  router.delete('/clear', (req: Request, res: Response) => controller.clearCart(req, res));

  return router;
}