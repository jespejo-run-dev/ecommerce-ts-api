import { ProductVariant } from '../entities/ProductVariant';

export interface IProductVariantRepository {
  create(variant: ProductVariant): Promise<ProductVariant>;
  findById(id: string): Promise<ProductVariant | null>;
  findByProductId(productId: string): Promise<ProductVariant[]>;
  update(variant: ProductVariant): Promise<ProductVariant>;
  delete(id: string): Promise<void>;
}