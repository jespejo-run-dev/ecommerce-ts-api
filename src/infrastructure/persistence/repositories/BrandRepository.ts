import { Repository } from 'typeorm';
import { Brand } from '../../../domain/entities/Brand';
import { IBrandRepository } from '../../../domain/repositories/IBrandRepository';
import { BrandEntity } from '../entities/BrandEntity';

export class BrandRepository implements IBrandRepository {
  constructor(private repository: Repository<BrandEntity>) {}

  private toDomain(entity: BrandEntity): Brand {
    return new Brand(
      entity.id,
      entity.name,
      entity.description,
      entity.slug,
      entity.logo,
      entity.createdAt,
      entity.updatedAt
    );
  }

  private toEntity(domain: Brand): BrandEntity {
    const entity = new BrandEntity();
    entity.id = domain.id;
    entity.name = domain.name;
    entity.description = domain.description;
    entity.slug = domain.slug;
    entity.logo = domain.logo;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }

  async findById(id: string): Promise<Brand | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async findAll(): Promise<Brand[]> {
    const entities = await this.repository.find();
    return entities.map(entity => this.toDomain(entity));
  }

  async create(brand: Brand): Promise<Brand> {
    const entity = this.toEntity(brand);
    const savedEntity = await this.repository.save(entity);
    return this.toDomain(savedEntity);
  }

  async update(brand: Brand): Promise<Brand> {
    const entity = this.toEntity(brand);
    const updatedEntity = await this.repository.save(entity);
    return this.toDomain(updatedEntity);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async findBySlug(slug: string): Promise<Brand | null> {
    const entity = await this.repository.findOne({ where: { slug } });
    return entity ? this.toDomain(entity) : null;
  }
} 