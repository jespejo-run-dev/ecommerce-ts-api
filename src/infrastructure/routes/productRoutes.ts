import { Router } from 'express';
import { ProductController } from '../controllers/ProductController';

export function createProductRoutes(controller: ProductController): Router {
  const router = Router();

  router.post('/', (req, res) => controller.create(req, res));
  router.get('/', (req, res) => controller.findAll(req, res));
  router.get('/:id', (req, res) => controller.findById(req, res));
  router.put('/:id', (req, res) => controller.update(req, res));
  router.delete('/:id', (req, res) => controller.delete(req, res));
  router.patch('/:id/stock', (req, res) => controller.updateStock(req, res));
  router.get('/category/:categoryId', (req, res) => controller.findByCategory(req, res));

  return router;
} 