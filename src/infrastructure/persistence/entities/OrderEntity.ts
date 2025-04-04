import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { UserEntity } from './UserEntity';
import { OrderItemEntity } from './OrderItemEntity';
import { PaymentEntity } from './PaymentEntity';
import { AddressEntity } from './AddressEntity';
import { OrderStatus } from '../../../domain/entities/Order';

@Entity('orders')
export class OrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING
  })
  status!: OrderStatus;

  @Column('decimal', { precision: 10, scale: 2 })
  total!: number;

  @Column({ nullable: true })
  notas?: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  usuario!: UserEntity;

  @OneToMany(() => OrderItemEntity, (item: OrderItemEntity) => item.order)
  items!: OrderItemEntity[];

  @OneToOne(() => PaymentEntity)
  @JoinColumn()
  pago!: PaymentEntity;

  @ManyToOne(() => AddressEntity)
  @JoinColumn({ name: 'direccionEnvioId' })
  direccionEnvio!: AddressEntity;

  @ManyToOne(() => AddressEntity)
  @JoinColumn({ name: 'direccionFacturacionId' })
  direccionFacturacion!: AddressEntity;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}