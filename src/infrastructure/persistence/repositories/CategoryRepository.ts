import { Repository } from 'typeorm';
import { Category } from '../../../domain/entities/Category';
import { ICategoryRepository } from '../../../domain/repositories/ICategoryRepository';
import { CategoryEntity } from '../entities/CategoryEntity';

export class CategoryRepository implements ICategoryRepository {
  constructor(private repository: Repository<CategoryEntity>) {}

  private toDomain(entity: CategoryEntity): Category {
    return new Category(
      entity.id,
      entity.name,
      entity.description,
      entity.slug,
      entity.parentId,
      entity.createdAt,
      entity.updatedAt
    );
  }

  private toEntity(domain: Category): CategoryEntity {
    const entity = new CategoryEntity();
    entity.id = domain.id;
    entity.name = domain.name;
    entity.description = domain.description;
    entity.slug = domain.slug;
    entity.parentId = domain.parentId;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }

  async findById(id: string): Promise<Category | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async findAll(): Promise<Category[]> {
    const entities = await this.repository.find();
    return entities.map(entity => this.toDomain(entity));
  }

  async create(category: Category): Promise<Category> {
    const entity = this.toEntity(category);
    const savedEntity = await this.repository.save(entity);
    return this.toDomain(savedEntity);
  }

  async update(category: Category): Promise<Category> {
    const entity = this.toEntity(category);
    const updatedEntity = await this.repository.save(entity);
    return this.toDomain(updatedEntity);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async findBySlug(slug: string): Promise<Category | null> {
    const entity = await this.repository.findOne({ where: { slug } });
    return entity ? this.toDomain(entity) : null;
  }
} 