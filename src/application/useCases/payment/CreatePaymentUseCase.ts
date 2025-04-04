import { Payment, PaymentMethod, PaymentStatus } from '../../../domain/entities/Payment';
import { IPaymentRepository } from '../../../domain/repositories/IPaymentRepository';
import { IOrderRepository } from '../../../domain/repositories/IOrderRepository';

interface CreatePaymentDTO {
  orderId: string;
  monto: number;
  metodo: PaymentMethod;
  transactionId?: string;
}

export class CreatePaymentUseCase {
  constructor(
    private paymentRepository: IPaymentRepository,
    private orderRepository: IOrderRepository
  ) {}

  async execute(data: CreatePaymentDTO): Promise<Payment> {
    const order = await this.orderRepository.buscarPorId(data.orderId);
    if (!order) throw new Error('Orden no encontrada');

    const payment = new Payment(
      crypto.randomUUID(),
      data.orderId,
      data.monto,
      data.metodo,
      PaymentStatus.PENDING,
      data.transactionId
    );

    return await this.paymentRepository.crear(payment);
  }
}