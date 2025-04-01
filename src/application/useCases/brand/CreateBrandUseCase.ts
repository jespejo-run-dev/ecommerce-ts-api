import { IBrandRepository } from '../../../domain/repositories/IBrandRepository';
import { Brand } from '../../../domain/entities/Brand';
import { v4 as uuidv4 } from 'uuid';

export class CreateBrandUseCase {
  constructor(private brandRepository: IBrandRepository) {}

  async execute(data: {
    name: string;
    description: string;
    slug: string;
    logo?: string;
  }): Promise<Brand> {
    const existingBrand = await this.brandRepository.findBySlug(data.slug);
    if (existingBrand) {
      throw new Error('Brand with this slug already exists');
    }

    const brand = new Brand(
      uuidv4(),
      data.name,
      data.description,
      data.slug,
      data.logo,
      new Date(),
      new Date()
    );

    return this.brandRepository.create(brand);
  }
} 