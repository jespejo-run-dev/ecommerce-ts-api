import { Repository } from 'typeorm';
import { PaymentEntity } from '../entities/PaymentEntity';
import { IPaymentRepository } from '../../../domain/repositories/IPaymentRepository';
import { Payment } from '../../../domain/entities/Payment';

export class PaymentRepository implements IPaymentRepository {
  constructor(private repository: Repository<PaymentEntity>) {}

  async crear(payment: Payment): Promise<Payment> {
    const entity = this.repository.create({
      ...payment
    });

    const savedEntity = await this.repository.save(entity);
    return this.mapToDomain(savedEntity);
  }

  async actualizar(payment: Payment): Promise<Payment> {
    const entity = await this.repository.findOne({ where: { id: payment.id } });
    if (!entity) throw new Error('Pago no encontrado');

    Object.assign(entity, payment);
    const updatedEntity = await this.repository.save(entity);
    return this.mapToDomain(updatedEntity);
  }

  async buscarPorId(id: string): Promise<Payment | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.mapToDomain(entity) : null;
  }

  async buscarPorOrderId(orderId: string): Promise<Payment | null> {
    const entity = await this.repository.findOne({ where: { orderId } });
    return entity ? this.mapToDomain(entity) : null;
  }

  async eliminar(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  private mapToDomain(entity: PaymentEntity): Payment {
    return new Payment(
      entity.id,
      entity.orderId,
      entity.monto,
      entity.metodo,
      entity.estado,
      entity.transactionId,
      entity.createdAt,
      entity.updatedAt
    );
  }
}