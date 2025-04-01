import { Repository } from 'typeorm';
import { Category } from '../../../domain/entities/Category';
import { ICategoryRepository } from '../../../domain/repositories/ICategoryRepository';
import { CategoryEntity } from '../entities/CategoryEntity';

export class CategoryRepository implements ICategoryRepository {
  constructor(private repository: Repository<CategoryEntity>) {}

  async findById(id: string): Promise<Category | null> {
    const category = await this.repository.findOne({ where: { id } });
    return category ? category.toDomain() : null;
  }

  async findAll(): Promise<Category[]> {
    const categories = await this.repository.find();
    return categories.map(category => category.toDomain());
  }

  async create(category: Category): Promise<Category> {
    const entity = CategoryEntity.fromDomain(category);
    const savedEntity = await this.repository.save(entity);
    return savedEntity.toDomain();
  }

  async update(category: Category): Promise<Category> {
    const entity = CategoryEntity.fromDomain(category);
    const updatedEntity = await this.repository.save(entity);
    return updatedEntity.toDomain();
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async findBySlug(slug: string): Promise<Category | null> {
    const category = await this.repository.findOne({ where: { slug } });
    return category ? category.toDomain() : null;
  }
} 