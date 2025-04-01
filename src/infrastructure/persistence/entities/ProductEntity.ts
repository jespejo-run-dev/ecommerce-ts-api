import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from '../../../domain/entities/Product';
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

  toDomain(): Product {
    return new Product(
      this.id,
      this.name,
      this.description,
      this.price,
      this.stock,
      this.sku,
      this.slug || this.name.toLowerCase().replace(/\s+/g, '-'),
      this.status,
      this.innerQuantity,
      this.categoryId,
      this.brandId,
      this.image,
      this.createdAt,
      this.updatedAt
    );
  }

  static fromDomain(product: Product): ProductEntity {
    const entity = new ProductEntity();
    entity.id = product.id;
    entity.name = product.name;
    entity.description = product.description;
    entity.price = product.price;
    entity.stock = product.stock;
    entity.innerQuantity = product.innerQuantity;
    entity.sku = product.sku;
    entity.slug = product.slug || product.name.toLowerCase().replace(/\s+/g, '-');
    entity.image = product.image;
    entity.categoryId = product.categoryId;
    entity.brandId = product.brandId;
    entity.status = product.status;
    entity.createdAt = product.createdAt;
    entity.updatedAt = product.updatedAt;
    return entity;
  }
} 