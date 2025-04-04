import { OrderItem } from './OrderItem';
import { UserAddress } from './UserAddress';
import { Payment } from './Payment';

export enum OrderStatus {
  PENDING = 'pendiente',
  PROCESSING = 'procesando',
  COMPLETED = 'completado',
  CANCELLED = 'cancelado',
  REFUNDED = 'reembolsado',
}

export class Order {
  constructor(
    public readonly id: string,
    public userId: string,
    public items: OrderItem[],
    public status: OrderStatus,
    public total: number,
    public direccionEnvio: UserAddress,
    public direccionFacturacion: UserAddress,
    public pago?: Payment,
    public notas?: string,
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}

  actualizarEstado(estado: OrderStatus): void {
    this.status = estado;
    this.updatedAt = new Date();
  }

  agregarPago(pago: Payment): void {
    this.pago = pago;
    this.updatedAt = new Date();
  }

  calcularTotal(): number {
    return this.items.reduce((suma, item) => suma + item.subtotal, 0);
  }
}