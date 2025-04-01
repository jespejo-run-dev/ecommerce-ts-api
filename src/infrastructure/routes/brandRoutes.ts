import { Router } from 'express';
import { BrandController } from '../controllers/BrandController';

export function createBrandRoutes(brandController: BrandController): Router {
  const router = Router();

  router.post('/', (req, res) => brandController.create(req, res));
  router.get('/', (req, res) => brandController.getAll(req, res));
  router.get('/:id', (req, res) => brandController.getById(req, res));
  router.put('/:id', (req, res) => brandController.update(req, res));
  router.delete('/:id', (req, res) => brandController.delete(req, res));

  return router;
} 