import { Repository } from 'typeorm';
import { OrderEntity } from '../entities/OrderEntity';
import { IOrderRepository } from '../../../domain/repositories/IOrderRepository';
import { Order } from '../../../domain/entities/Order';
import { OrderItem } from '../../../domain/entities/OrderItem';
import { UserAddress } from '../../../domain/entities/UserAddress';
import { Payment } from '../../../domain/entities/Payment';

export class OrderRepository implements IOrderRepository {
  constructor(private repository: Repository<OrderEntity>) {}

  async crear(order: Order): Promise<Order> {
    const entity = this.repository.create({
      ...order,
      direccionEnvio: { id: order.direccionEnvio.id },
      direccionFacturacion: { id: order.direccionFacturacion.id },
      pago: order.pago ? { id: order.pago.id } : undefined,
      items: order.items.map(item => ({ ...item }))
    });

    const savedEntity = await this.repository.save(entity);
    return this.mapToDomain(savedEntity);
  }

  async actualizar(order: Order): Promise<Order> {
    const entity = await this.findOrderWithRelations(order.id);
    if (!entity) throw new Error('Orden no encontrada');

    Object.assign(entity, {
      ...order,
      direccionEnvio: { id: order.direccionEnvio.id },
      direccionFacturacion: { id: order.direccionFacturacion.id },
      pago: order.pago ? { id: order.pago.id } : undefined
    });

    const updatedEntity = await this.repository.save(entity);
    return this.mapToDomain(updatedEntity);
  }

  async buscarPorId(id: string): Promise<Order | null> {
    const entity = await this.findOrderWithRelations(id);
    return entity ? this.mapToDomain(entity) : null;
  }

  async buscarPorUsuarioId(userId: string): Promise<Order[]> {
    const entities = await this.repository.find({ 
      where: { userId },
      relations: this.getRelations(),
      order: { createdAt: 'DESC' }
    });
    return entities.map(this.mapToDomain);
  }

  async buscarTodos(): Promise<Order[]> {
    const entities = await this.repository.find({ 
      relations: this.getRelations(),
      order: { createdAt: 'DESC' }
    });
    return entities.map(this.mapToDomain);
  }

  async eliminar(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  private getRelations(): string[] {
    return ['items', 'direccionEnvio', 'direccionFacturacion', 'pago', 'usuario'];
  }

  private async findOrderWithRelations(id: string): Promise<OrderEntity | null> {
    return await this.repository.findOne({ 
      where: { id },
      relations: this.getRelations()
    });
  }

  private mapToDomain(entity: OrderEntity): Order {
    const { id, userId, items, status, total, direccionEnvio, direccionFacturacion, pago, notas, createdAt, updatedAt } = entity;

    return new Order(
      id,
      userId,
      items.map(item => new OrderItem(
        item.id,
        id,
        item.productId,
        item.variantId,
        item.cantidad,
        item.precio,
        item.subtotal
      )),
      status,
      total,
      UserAddress.fromDatabase(
        direccionEnvio.id,
        direccionEnvio.userId,
        'shipping',
        direccionEnvio.name,
        direccionEnvio.street,
        direccionEnvio.city,
        direccionEnvio.state,
        direccionEnvio.country,
        direccionEnvio.postalCode,
        direccionEnvio.phone,
        direccionEnvio.isDefault,
        direccionEnvio.createdAt,
        direccionEnvio.updatedAt
      ),
      UserAddress.fromDatabase(
        direccionFacturacion.id,
        direccionFacturacion.userId,
        'billing',
        direccionFacturacion.name,
        direccionFacturacion.street,
        direccionFacturacion.city,
        direccionFacturacion.state,
        direccionFacturacion.country,
        direccionFacturacion.postalCode,
        direccionFacturacion.phone,
        direccionFacturacion.isDefault,
        direccionFacturacion.createdAt,
        direccionFacturacion.updatedAt
      ),
      pago ? new Payment(
        pago.id,
        id,
        pago.monto,
        pago.metodo,
        pago.estado,
        pago.transactionId,
        pago.createdAt,
        pago.updatedAt
      ) : undefined,
      notas,
      createdAt,
      updatedAt
    );
  }
}