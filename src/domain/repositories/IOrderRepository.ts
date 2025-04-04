import { Order } from '../entities/Order';

export interface IOrderRepository {
  crear(order: Order): Promise<Order>;
  actualizar(order: Order): Promise<Order>;
  buscarPorId(id: string): Promise<Order | null>;
  buscarPorUsuarioId(userId: string): Promise<Order[]>;
  buscarTodos(): Promise<Order[]>;
  eliminar(id: string): Promise<void>;
}