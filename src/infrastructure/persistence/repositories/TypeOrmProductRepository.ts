import { Repository } from 'typeorm';
import { Product } from '../../../domain/entities/Product';
import { IProductRepository } from '../../../domain/repositories/IProductRepository';
import { ProductEntity } from '../entities/ProductEntity';

export class TypeOrmProductRepository implements IProductRepository {
  constructor(private repository: Repository<ProductEntity>) {}

  async findById(id: string): Promise<Product | null> {
    const product = await this.repository.findOne({ 
      where: { id },
      relations: ['category']
    });
    return product ? product.toDomain() : null;
  }

  async findAll(): Promise<Product[]> {
    const products = await this.repository.find({
      relations: ['category']
    });
    return products.map(product => product.toDomain());
  }

  async create(product: Product): Promise<Product> {
    const entity = ProductEntity.fromDomain(product);
    const savedEntity = await this.repository.save(entity);
    return savedEntity.toDomain();
  }

  async update(product: Product): Promise<Product> {
    const entity = ProductEntity.fromDomain(product);
    const updatedEntity = await this.repository.save(entity);
    return updatedEntity.toDomain();
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async findByCategoryId(categoryId: string): Promise<Product[]> {
    const products = await this.repository.find({
      where: { categoryId },
      relations: ['category']
    });
    return products.map(product => product.toDomain());
  }

  async findBySku(sku: string): Promise<Product | null> {
    const product = await this.repository.findOne({ where: { sku } });
    return product ? product.toDomain() : null;
  }

  async updateStock(id: string, quantity: number): Promise<Product> {
    const product = await this.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }

    product.updateStock(quantity);
    return this.update(product);
  }
} 