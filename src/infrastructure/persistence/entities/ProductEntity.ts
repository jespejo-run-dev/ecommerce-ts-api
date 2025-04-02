import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { CategoryEntity } from './CategoryEntity';
import { BrandEntity } from './BrandEntity';

@Entity('products')
export class ProductEntity {
  @PrimaryColumn()
  id!: string;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price!: number;

  @Column()
  stock!: number;

  @Column()
  innerQuantity!: number;

  @Column({ unique: true })
  sku!: string;

  @Column({ unique: true, nullable: true })
  slug?: string;

  @Column({ nullable: true })
  image?: string;

  @Column({ nullable: true })
  categoryId?: string;

  @Column({ nullable: true })
  brandId?: string;

  @Column()
  status!: 'active' | 'inactive';

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => CategoryEntity, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'categoryId' })
  category?: CategoryEntity;

  @ManyToOne(() => BrandEntity, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'brandId' })
  brand?: BrandEntity;
} 