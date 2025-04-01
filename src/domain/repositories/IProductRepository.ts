import { Product } from '../entities/Product';

export interface IProductRepository {
  findById(id: string): Promise<Product | null>;
  findAll(): Promise<Product[]>;
  create(product: Product): Promise<Product>;
  update(product: Product): Promise<Product>;
  delete(id: string): Promise<void>;
  findByCategoryId(categoryId: string): Promise<Product[]>;
  findBySku(sku: string): Promise<Product | null>;
  updateStock(id: string, quantity: number): Promise<Product>;
} 