export enum PaymentStatus {
  PENDING = 'pendiente',
  COMPLETED = 'completado',
  FAILED = 'fallido',
  REFUNDED = 'reembolsado'
}

export enum PaymentMethod {
  CREDIT_CARD = 'tarjeta_credito',
  DEBIT_CARD = 'tarjeta_debito',
  PAYPAL = 'paypal',
  BANK_TRANSFER = 'transferencia_bancaria'
}

export class Payment {
  constructor(
    public readonly id: string,
    public orderId: string,
    public monto: number,
    public metodo: PaymentMethod,
    public estado: PaymentStatus,
    public transactionId?: string,
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}

  actualizarEstado(estado: PaymentStatus): void {
    this.estado = estado;
    this.updatedAt = new Date();
  }
}