import { Repository } from 'typeorm';
import { ProductVariant } from '../../../domain/entities/ProductVariant';
import { ProductVariantEntity } from '../entities/ProductVariantEntity';
import { IProductVariantRepository } from '../../../domain/repositories/IProductVariantRepository';

export class ProductVariantRepository implements IProductVariantRepository {
  constructor(private repository: Repository<ProductVariantEntity>) {}

  async create(variant: ProductVariant): Promise<ProductVariant> {
    const entity = this.toEntity(variant);
    const savedEntity = await this.repository.save(entity);
    return this.toDomain(savedEntity);
  }

  async findById(id: string): Promise<ProductVariant | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async findByProductId(productId: string): Promise<ProductVariant[]> {
    const entities = await this.repository.find({ where: { productId } });
    return entities.map(entity => this.toDomain(entity));
  }

  async update(variant: ProductVariant): Promise<ProductVariant> {
    const entity = this.toEntity(variant);
    const savedEntity = await this.repository.save(entity);
    return this.toDomain(savedEntity);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  private toEntity(variant: ProductVariant): ProductVariantEntity {
    const entity = new ProductVariantEntity();
    entity.id = variant.id;
    entity.productId = variant.productId;
    entity.sku = variant.sku;
    entity.stock = variant.stock;
    entity.attributes = variant.attributes;
    entity.price = variant.price;
    entity.createdAt = variant.createdAt;
    entity.updatedAt = variant.updatedAt;
    return entity;
  }

  private toDomain(entity: ProductVariantEntity): ProductVariant {
    return new ProductVariant(
      entity.id,
      entity.productId,
      entity.sku,
      entity.stock,
      entity.attributes,
      entity.price,
      entity.createdAt,
      entity.updatedAt
    );
  }
}