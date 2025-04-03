import { ProductVariant } from '../../../domain/entities/ProductVariant';
import { IProductVariantRepository } from '../../../domain/repositories/IProductVariantRepository';
import { v4 as uuidv4 } from 'uuid';

export class CreateProductVariantUseCase {
  constructor(private productVariantRepository: IProductVariantRepository) {}

  async execute(
    productId: string,
    sku: string,
    stock: number,
    attributes: { [key: string]: string },
    price?: number
  ): Promise<ProductVariant> {
    const variant = new ProductVariant(
      uuidv4(),
      productId,
      sku,
      stock,
      attributes,
      price
    );

    return await this.productVariantRepository.create(variant);
  }
}