import { Request, Response } from 'express';
import { IBrandRepository } from '../../domain/repositories/IBrandRepository';
import { CreateBrandUseCase } from '../../application/useCases/brand/CreateBrandUseCase';
import { Brand } from '../../domain/entities/Brand';

export class BrandController {
  constructor(
    private brandRepository: IBrandRepository,
    private createBrandUseCase: CreateBrandUseCase
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const brand = await this.createBrandUseCase.execute(req.body);
      res.status(201).json(brand);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Error al crear marca' });
      }
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const brands = await this.brandRepository.findAll();
      res.json(brands);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener marcas' });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const brand = await this.brandRepository.findById(req.params.id);
      if (!brand) {
        res.status(404).json({ error: 'Marca no encontrada' });
      } else {
        res.json(brand);
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener marca' });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const existingBrand = await this.brandRepository.findById(req.params.id);
      if (!existingBrand) {
        res.status(404).json({ error: 'Marca no encontrada' });
        return;
      }

      const updatedBrand = new Brand(
        existingBrand.id,
        req.body.name || existingBrand.name,
        req.body.description || existingBrand.description,
        req.body.slug || existingBrand.slug,
        req.body.logo || existingBrand.logo,
        existingBrand.createdAt,
        new Date()
      );

      const brand = await this.brandRepository.update(updatedBrand);
      res.json(brand);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Error al actualizar marca' });
      }
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      await this.brandRepository.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar marca' });
    }
  }
} 