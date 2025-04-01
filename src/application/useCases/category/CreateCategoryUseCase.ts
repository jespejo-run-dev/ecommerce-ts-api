import { Category } from '../../../domain/entities/Category';
import { ICategoryRepository } from '../../../domain/repositories/ICategoryRepository';
import { v4 as uuidv4 } from 'uuid';

export class CreateCategoryUseCase {
  constructor(private categoryRepository: ICategoryRepository) {}

  async execute(name: string, description: string, slug: string, parentId?: string): Promise<Category> {
    const existingCategory = await this.categoryRepository.findBySlug(slug);
    if (existingCategory) {
      throw new Error('Category with this slug already exists');
    }

    const category = new Category(
      uuidv4(),
      name,
      description,
      slug,
      parentId
    );

    return await this.categoryRepository.create(category);
  }
} 