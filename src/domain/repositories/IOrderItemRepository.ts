import { OrderItem } from '../entities/OrderItem';

export interface IOrderItemRepository {
  crear(orderItem: OrderItem): Promise<OrderItem>;
  actualizar(orderItem: OrderItem): Promise<OrderItem>;
  buscarPorId(id: string): Promise<OrderItem | null>;
  buscarPorOrderId(orderId: string): Promise<OrderItem[]>;
  buscarPorProductId(productId: string): Promise<OrderItem[]>;
  eliminar(id: string): Promise<void>;
  eliminarPorOrderId(orderId: string): Promise<void>;
}