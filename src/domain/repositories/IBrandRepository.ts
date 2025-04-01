import { Brand } from '../entities/Brand';

export interface IBrandRepository {
  findById(id: string): Promise<Brand | null>;
  findAll(): Promise<Brand[]>;
  create(brand: Brand): Promise<Brand>;
  update(brand: Brand): Promise<Brand>;
  delete(id: string): Promise<void>;
  findBySlug(slug: string): Promise<Brand | null>;
} 