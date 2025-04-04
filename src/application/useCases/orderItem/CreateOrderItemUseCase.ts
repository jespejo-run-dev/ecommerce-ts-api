import { OrderItem } from '../../../domain/entities/OrderItem';
import { IOrderItemRepository } from '../../../domain/repositories/IOrderItemRepository';
import { IProductRepository } from '../../../domain/repositories/IProductRepository';
import { v4 as uuidv4 } from 'uuid';

interface CreateOrderItemDTO {
  orderId: string;
  productId: string;
  variantId?: string;
  cantidad: number;
}

export class CreateOrderItemUseCase {
  constructor(
    private orderItemRepository: IOrderItemRepository,
    private productRepository: IProductRepository
  ) {}

  async execute(data: CreateOrderItemDTO): Promise<OrderItem> {
    const product = await this.productRepository.findById(data.productId);
    if (!product) throw new Error('Producto no encontrado');

    let precio = product.price;
    if (data.variantId) {
      const variantPrice = product.getVariantPrice(data.variantId);
      if (variantPrice === null) {
        throw new Error('Variante no encontrada o producto sin variantes habilitadas');
      }
      precio = variantPrice;
    }

    const orderItem = new OrderItem(
      uuidv4(),
      data.orderId,
      data.productId,
      data.variantId || undefined, // Cambiamos null por undefined
      data.cantidad,
      precio,
      precio * data.cantidad
    );

    return await this.orderItemRepository.crear(orderItem);
  }
}