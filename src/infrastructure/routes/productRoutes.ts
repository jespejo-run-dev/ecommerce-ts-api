import { Router, Request, Response } from 'express';
import { ProductController } from '../controllers/ProductController';

export function createProductRoutes(controller: ProductController): Router {
  const router = Router();

  router.post('/', (req: Request, res: Response) => controller.create(req, res));
  router.get('/', (req: Request, res: Response) => controller.getAll(req, res));
  router.get('/:id', (req: Request, res: Response) => controller.getById(req, res));
  router.put('/:id', (req: Request, res: Response) => controller.update(req, res));
  router.delete('/:id', (req: Request, res: Response) => controller.delete(req, res));
  router.patch('/:id/stock', (req: Request, res: Response) => controller.updateStock(req, res));
  router.get('/category/:categoryId', (req: Request, res: Response) => controller.findByCategory(req, res));

  return router;
} 