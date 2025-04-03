import { Router, Request, Response } from 'express';
import { ProductController } from '../controllers/ProductController';

export function createProductVariantRoutes(controller: ProductController): Router {
  const router = Router();

  router.post('/:id/variants', (req: Request, res: Response) => controller.addVariant(req, res));
  router.get('/:id/variants', (req: Request, res: Response) => controller.getVariants(req, res));
  router.patch('/:id/variants/:variantId', (req: Request, res: Response) => controller.updateVariant(req, res));
  router.delete('/:id/variants/:variantId', (req: Request, res: Response) => controller.removeVariant(req, res));

  return router;
}