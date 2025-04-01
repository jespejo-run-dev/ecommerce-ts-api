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
      throw new Error('Product with this SKU already exists');
    }

    if (data.categoryId) {
      const category = await this.categoryRepository.findById(data.categoryId);
      if (!category) {
        throw new Error('Category not found');
      }
    }

    if (data.stock % data.innerQuantity !== 0) {
      throw new Error(`Stock must be a multiple of ${data.innerQuantity}`);
    }

    const product = new Product(
      uuidv4(),
      data.name,
      data.description,
      data.price,
      data.stock,
      data.sku,
      data.slug || data.name.toLowerCase().replace(/\s+/g, '-'),
      data.categoryId,
      data.brandId,
      data.image,
      data.status,
      data.innerQuantity,
      new Date(),
      new Date()
    );

    return this.productRepository.create(product);
  }
} 