import { Repository } from 'typeorm';
import { Brand } from '../../../domain/entities/Brand';
import { IBrandRepository } from '../../../domain/repositories/IBrandRepository';
import { BrandEntity } from '../entities/BrandEntity';

export class TypeOrmBrandRepository implements IBrandRepository {
  constructor(private repository: Repository<BrandEntity>) {}

  async findById(id: string): Promise<Brand | null> {
    const brand = await this.repository.findOne({ where: { id } });
    return brand ? brand.toDomain() : null;
  }

  async findAll(): Promise<Brand[]> {
    const brands = await this.repository.find();
    return brands.map(brand => brand.toDomain());
  }

  async create(brand: Brand): Promise<Brand> {
    const entity = BrandEntity.fromDomain(brand);
    const savedEntity = await this.repository.save(entity);
    return savedEntity.toDomain();
  }

  async update(brand: Brand): Promise<Brand> {
    const entity = BrandEntity.fromDomain(brand);
    const updatedEntity = await this.repository.save(entity);
    return updatedEntity.toDomain();
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async findBySlug(slug: string): Promise<Brand | null> {
    const brand = await this.repository.findOne({ where: { slug } });
    return brand ? brand.toDomain() : null;
  }
} 