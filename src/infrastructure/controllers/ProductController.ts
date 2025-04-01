import { Request, Response } from 'express';
import { CreateProductUseCase } from '../../application/useCases/product/CreateProductUseCase';
import { IProductRepository } from '../../domain/repositories/IProductRepository';
import { Product } from '../../domain/entities/Product';

export class ProductController {
  constructor(
    private productRepository: IProductRepository,
    private createProductUseCase: CreateProductUseCase
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const product = await this.createProductUseCase.execute(req.body);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const products = await this.productRepository.findAll();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const product = await this.productRepository.findById(req.params.id);
      if (!product) {
        res.status(404).json({ error: 'Product not found' });
      } else {
        res.json(product);
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const existingProduct = await this.productRepository.findById(req.params.id);
      if (!existingProduct) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }

      const updatedProduct = new Product(
        existingProduct.id,
        req.body.name || existingProduct.name,
        req.body.description || existingProduct.description,
        req.body.price || existingProduct.price,
        req.body.stock || existingProduct.stock,
        req.body.sku || existingProduct.sku,
        req.body.slug || existingProduct.slug,
        req.body.categoryId || existingProduct.categoryId,
        req.body.brandId || existingProduct.brandId,
        req.body.image || existingProduct.image,
        req.body.status || existingProduct.status,
        existingProduct.createdAt,
        new Date()
      );

      const product = await this.productRepository.update(updatedProduct);
      res.json(product);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      await this.productRepository.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async updateStock(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { quantity } = req.body;
      const product = await this.productRepository.updateStock(id, quantity);
      res.json(product);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async findByCategory(req: Request, res: Response): Promise<void> {
    try {
      const { categoryId } = req.params;
      const products = await this.productRepository.findByCategoryId(categoryId);
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
} 