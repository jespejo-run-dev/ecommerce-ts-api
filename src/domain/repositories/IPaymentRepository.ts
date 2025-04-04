import { Payment } from '../entities/Payment';

export interface IPaymentRepository {
  crear(payment: Payment): Promise<Payment>;
  actualizar(payment: Payment): Promise<Payment>;
  buscarPorId(id: string): Promise<Payment | null>;
  buscarPorOrderId(orderId: string): Promise<Payment | null>;
  eliminar(id: string): Promise<void>;
}