import { Request, Response } from 'express';
import { CreateCategoryUseCase } from '../../application/useCases/category/CreateCategoryUseCase';
import { ICategoryRepository } from '../../domain/repositories/ICategoryRepository';
import { IProductRepository } from '../../domain/repositories/IProductRepository';

export class CategoryController {
  constructor(
    private categoryRepository: ICategoryRepository,
    private productRepository: IProductRepository,
    private createCategoryUseCase: CreateCategoryUseCase
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, description, slug, parentId } = req.body;
      const category = await this.createCategoryUseCase.execute(
        name,
        description,
        slug,
        parentId
      );
      res.status(201).json(category);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Error al crear categoría' });
    }
  }

  async findAll(req: Request, res: Response): Promise<void> {
    try {
      const categories = await this.categoryRepository.findAll();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : 'Error al obtener categorías' });
    }
  }

  async findById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const category = await this.categoryRepository.findById(id);
      if (!category) {
        res.status(404).json({ error: 'Categoría no encontrada' });
        return;
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : 'Error al obtener categoría' });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, description, slug } = req.body;
      const category = await this.categoryRepository.findById(id);
      if (!category) {
        res.status(404).json({ error: 'Categoría no encontrada' });
        return;
      }
      category.update(name, description, slug);
      const updatedCategory = await this.categoryRepository.update(category);
      res.json(updatedCategory);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Error al actualizar categoría' });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      // Check if category has associated products
      const products = await this.productRepository.findByCategoryId(id);
      if (products.length > 0) {
        res.status(400).json({ 
          error: 'No se puede eliminar la categoría con productos asociados. Por favor, elimine o reasigne los productos primero.' 
        });
        return;
      }

      await this.categoryRepository.delete(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : 'Error al eliminar categoría' });
    }
  }
} 