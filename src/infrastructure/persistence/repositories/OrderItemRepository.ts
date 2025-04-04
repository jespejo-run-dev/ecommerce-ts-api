import { Repository } from 'typeorm';
import { OrderItemEntity } from '../entities/OrderItemEntity';
import { IOrderItemRepository } from '../../../domain/repositories/IOrderItemRepository';
import { OrderItem } from '../../../domain/entities/OrderItem';

export class OrderItemRepository implements IOrderItemRepository {
  constructor(private repository: Repository<OrderItemEntity>) {}

  async crear(orderItem: OrderItem): Promise<OrderItem> {
    const entity = this.repository.create({
      ...orderItem
    });

    const savedEntity = await this.repository.save(entity);
    return this.mapToDomain(savedEntity);
  }

  async actualizar(orderItem: OrderItem): Promise<OrderItem> {
    const entity = await this.repository.findOne({ where: { id: orderItem.id } });
    if (!entity) throw new Error('Item de orden no encontrado');

    Object.assign(entity, orderItem);
    const updatedEntity = await this.repository.save(entity);
    return this.mapToDomain(updatedEntity);
  }

  async buscarPorId(id: string): Promise<OrderItem | null> {
    const entity = await this.repository.findOne({ 
      where: { id },
      relations: ['producto', 'variante']
    });
    return entity ? this.mapToDomain(entity) : null;
  }

  async buscarPorOrderId(orderId: string): Promise<OrderItem[]> {
    const entities = await this.repository.find({ 
      where: { orderId },
      relations: ['producto', 'variante']
    });
    return entities.map(entity => this.mapToDomain(entity));
  }

  async buscarPorProductId(productId: string): Promise<OrderItem[]> {
    const entities = await this.repository.find({ 
      where: { productId },
      relations: ['producto', 'variante']
    });
    return entities.map(entity => this.mapToDomain(entity));
  }

  async eliminar(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async eliminarPorOrderId(orderId: string): Promise<void> {
    await this.repository.delete({ orderId });
  }

  private mapToDomain(entity: OrderItemEntity): OrderItem {
    return new OrderItem(
      entity.id,
      entity.orderId,
      entity.productId,
      entity.variantId,
      entity.cantidad,
      entity.precio,
      entity.subtotal
    );
  }
}