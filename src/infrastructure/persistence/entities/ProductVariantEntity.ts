import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ProductEntity } from './ProductEntity';

@Entity('product_variants')
export class ProductVariantEntity {
  @PrimaryColumn()
  id!: string;

  @Column()
  productId!: string;

  @Column()
  sku!: string;

  @Column()
  stock!: number;

  @Column('jsonb')
  attributes!: { [key: string]: string };

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price?: number;

  @Column()
  createdAt!: Date;

  @Column()
  updatedAt!: Date;

  @ManyToOne(() => ProductEntity)
  @JoinColumn({ name: 'productId' })
  product!: ProductEntity;

  constructor() {
    this.id = '';
    this.productId = '';
    this.sku = '';
    this.stock = 0;
    this.attributes = {};
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}