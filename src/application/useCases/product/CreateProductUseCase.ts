import { Product } from '../../../domain/entities/Product';
import { IProductRepository } from '../../../domain/repositories/IProductRepository';
import { ICategoryRepository } from '../../../domain/repositories/ICategoryRepository';
import { v4 as uuidv4 } from 'uuid';

export class CreateProductUseCase {
  constructor(
    private productRepository: IProductRepository,
    private categoryRepository: ICategoryRepository
  ) {}

  async execute(data: {
    name: string;
    description: string;
    price: number;
    stock: number;
    innerQuantity: number;
    sku: string;
    slug?: string;
    image?: string;
    categoryId?: string;
    brandId?: string;
    status: 'active' | 'inactive';
  }): Promise<Product> {
    const existingProduct = await this.productRepository.findBySku(data.sku);
    if (existingProduct) {
      throw new Error('El producto con este SKU ya existe');
    }

    if (data.categoryId) {
      const category = await this.categoryRepository.findById(data.categoryId);
      if (!category) {
        throw new Error('Categoría no encontrada');
      }
    }

    if (data.stock % data.innerQuantity !== 0) {
      throw new Error(`El stock debe ser un múltiplo de ${data.innerQuantity}`);
    }

    const product = new Product(
      uuidv4(),
      data.name,
      data.description,
      data.price,
      data.sku,
      data.slug || data.name.toLowerCase().replace(/\s+/g, '-'),
      data.status,
      data.innerQuantity,
      data.categoryId,
      data.brandId,
      data.image,
      new Date(),
      new Date()
    );

    // Si hay stock inicial, actualizarlo
    if (data.stock > 0) {
      product.updateStock(data.stock);
    }

    return this.productRepository.create(product);
  }
}