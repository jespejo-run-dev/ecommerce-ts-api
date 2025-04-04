import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { OrderEntity } from './OrderEntity';
import { PaymentStatus, PaymentMethod } from '../../../domain/entities/Payment';

@Entity('payments')
export class PaymentEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  orderId!: string;

  @Column('decimal', { precision: 10, scale: 2 })
  monto!: number;

  @Column({
    type: 'enum',
    enum: PaymentMethod
  })
  metodo!: PaymentMethod;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING
  })
  estado!: PaymentStatus;

  @Column({ nullable: true })
  transactionId?: string;

  @OneToOne(() => OrderEntity)
  @JoinColumn({ name: 'orderId' })
  order!: OrderEntity;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}