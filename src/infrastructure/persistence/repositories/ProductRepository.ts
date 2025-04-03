import { Repository } from 'typeorm';
import { Product } from '../../../domain/entities/Product';
import { IProductRepository } from '../../../domain/repositories/IProductRepository';
import { ProductEntity } from '../entities/ProductEntity';

export class ProductRepository implements IProductRepository {
  constructor(private repository: Repository<ProductEntity>) {}

  private toDomain(entity: ProductEntity): Product {
    return new Product(
      entity.id,
      entity.name,
      entity.description,
      entity.price,
      entity.sku,
      entity.slug || entity.name.toLowerCase().replace(/\s+/g, '-'),
      entity.status,
      entity.innerQuantity,
      entity.categoryId,
      entity.brandId,
      entity.image,
      entity.createdAt,
      new Date()
    );
  }

  private toEntity(domain: Product): ProductEntity {
    const entity = new ProductEntity();
    entity.id = domain.id;
    entity.name = domain.name;
    entity.description = domain.description;
    entity.price = domain.price;
    entity.innerQuantity = domain.innerQuantity;
    entity.sku = domain.sku;
    entity.slug = domain.slug;
    entity.image = domain.image;
    entity.categoryId = domain.categoryId;
    entity.brandId = domain.brandId;
    entity.status = domain.status;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    entity.stock = domain.getCurrentStock(); // Usar el método getter en lugar de acceder directamente
    return entity;
  }

  async findById(id: string): Promise<Product | null> {
    const entity = await this.repository.findOne({ 
      where: { id },
      relations: ['category']
    });
    return entity ? this.toDomain(entity) : null;
  }

  async findAll(): Promise<Product[]> {
    const entities = await this.repository.find({
      relations: ['category']
    });
    return entities.map(entity => this.toDomain(entity));
  }

  async create(product: Product): Promise<Product> {
    const entity = this.toEntity(product);
    const savedEntity = await this.repository.save(entity);
    return this.toDomain(savedEntity);
  }

  async update(product: Product): Promise<Product> {
    const entity = this.toEntity(product);
    const updatedEntity = await this.repository.save(entity);
    return this.toDomain(updatedEntity);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async findByCategoryId(categoryId: string): Promise<Product[]> {
    const entities = await this.repository.find({
      where: { categoryId },
      relations: ['category']
    });
    return entities.map(entity => this.toDomain(entity));
  }

  async findBySku(sku: string): Promise<Product | null> {
    const entity = await this.repository.findOne({ where: { sku } });
    return entity ? this.toDomain(entity) : null;
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