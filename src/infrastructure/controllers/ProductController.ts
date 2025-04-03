import { Request, Response } from 'express';
import { CreateProductUseCase } from '../../application/useCases/product/CreateProductUseCase';
import { IProductRepository } from '../../domain/repositories/IProductRepository';
import { Product } from '../../domain/entities/Product';
import { CreateProductVariantUseCase } from '../../application/useCases/product/CreateProductVariantUseCase';
import { IProductVariantRepository } from '../../domain/repositories/IProductVariantRepository';

export class ProductController {
  constructor(
    private productRepository: IProductRepository,
    private createProductUseCase: CreateProductUseCase,
    private createProductVariantUseCase: CreateProductVariantUseCase,
    private productVariantRepository: IProductVariantRepository // Agregar esta inyección
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const product = await this.createProductUseCase.execute(req.body);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Error al crear producto' });
      }
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const products = await this.productRepository.findAll();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener productos' });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const product = await this.productRepository.findById(req.params.id);
      if (!product) {
        res.status(404).json({ error: 'Producto no encontrado' });
      } else {
        res.json(product);
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener producto' });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const existingProduct = await this.productRepository.findById(req.params.id);
      if (!existingProduct) {
        res.status(404).json({ error: 'Producto no encontrado' });
        return;
      }

      const updatedProduct = new Product(
        existingProduct.id,
        req.body.name || existingProduct.name,
        req.body.description || existingProduct.description,
        req.body.price || existingProduct.price,
        req.body.sku || existingProduct.sku,
        req.body.slug || existingProduct.slug,
        req.body.status || existingProduct.status,
        req.body.innerQuantity || existingProduct.innerQuantity,
        req.body.categoryId || existingProduct.categoryId,
        req.body.brandId || existingProduct.brandId,
        req.body.image || existingProduct.image,
        existingProduct.createdAt,
        new Date()
      );

      const product = await this.productRepository.update(updatedProduct);
      res.json(product);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Error al actualizar producto' });
      }
    }
  }

  async updateStock(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { quantity, variantId } = req.body;
      
      const product = await this.productRepository.findById(id);
      if (!product) {
        res.status(404).json({ error: 'Producto no encontrado' });
        return;
      }

      if (variantId) {
        // Actualizar stock de variante
        product.updateStock(variantId, quantity);
      } else {
        // Actualizar stock del producto principal
        product.updateStock(quantity);
      }

      const updatedProduct = await this.productRepository.update(product);
      res.json(updatedProduct);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Error al actualizar stock' });
    }
  }

  // Nuevos métodos para manejar variantes
  async addVariant(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { sku, stock, attributes, price } = req.body;
      
      const product = await this.productRepository.findById(id);
      if (!product) {
        res.status(404).json({ error: 'Producto no encontrado' });
        return;
      }

      if (!product.hasVariants()) {
        product.enableVariants();
      }

      const variant = await this.createProductVariantUseCase.execute(
        id,
        sku,
        stock,
        attributes,
        price
      );

      const updatedProduct = await this.productRepository.update(product);
      res.status(201).json({ product: updatedProduct, variant });
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Error al agregar variante' });
    }
  }

  async removeVariant(req: Request, res: Response): Promise<void> {
    try {
      const { id, variantId } = req.params;
      const product = await this.productRepository.findById(id);
      if (!product) {
        res.status(404).json({ error: 'Producto no encontrado' });
        return;
      }

      const variant = await this.productVariantRepository.findById(variantId);
      if (!variant) {
        res.status(404).json({ error: 'Variante no encontrada' });
        return;
      }

      // Eliminar la variante de la base de datos directamente
      await this.productVariantRepository.delete(variantId);
      
      // Send success message with product and variant details
      res.json({ 
        message: `Variante ${variant.sku} eliminada exitosamente del producto ${product.name}`,
        productId: id,
        variantId: variantId
      });
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Error al eliminar variante' });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      await this.productRepository.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar producto' });
    }
  }

  async findByCategory(req: Request, res: Response): Promise<void> {
    try {
      const { categoryId } = req.params;
      const products = await this.productRepository.findByCategoryId(categoryId);
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : 'Error al encontrar productos por categoría' });
    }
  }

  async getVariants(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const product = await this.productRepository.findById(id);
      
      if (!product) {
        res.status(404).json({ error: 'Producto no encontrado' });
        return;
      }

      // Use productVariantRepository instead of product.getVariants()
      const variants = await this.productVariantRepository.findByProductId(id);
      res.json(variants);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener variantes del producto' });
    }
  }

  async updateVariant(req: Request, res: Response): Promise<void> {
    try {
      const { id, variantId } = req.params;
      const { sku, stock, attributes, price } = req.body;

      const product = await this.productRepository.findById(id);
      if (!product) {
        res.status(404).json({ error: 'Producto no encontrado' });
        return;
      }

      const variant = await this.productVariantRepository.findById(variantId);
      if (!variant) {
        res.status(404).json({ error: 'Variante no encontrada' });
        return;
      }

      variant.update(sku, stock, attributes, price);
      const updatedVariant = await this.productVariantRepository.update(variant);
      res.json(updatedVariant);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Error al actualizar variante' });
    }
  }
}