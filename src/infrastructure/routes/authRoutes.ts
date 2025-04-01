import { Router, Request, Response } from 'express';
import { AuthController } from '../controllers/AuthController';
import { authMiddleware } from '../middleware/authMiddleware';

export function createAuthRoutes(authController: AuthController): Router {
  const router = Router();

  router.post('/register', (req: Request, res: Response) => authController.register(req, res));
  router.post('/login', (req: Request, res: Response) => authController.login(req, res));
  router.post('/change-password', authMiddleware, (req: Request, res: Response) => authController.changePassword(req, res));

  return router;
} 