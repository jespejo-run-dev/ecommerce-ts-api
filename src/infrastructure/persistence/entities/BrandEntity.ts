import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Brand } from '../../../domain/entities/Brand';

@Entity('brands')
export class BrandEntity {
  @PrimaryColumn()
  id!: string;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @Column({ unique: true })
  slug!: string;

  @Column({ nullable: true })
  logo?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  toDomain(): Brand {
    return new Brand(
      this.id,
      this.name,
      this.description,
      this.slug,
      this.logo,
      this.createdAt,
      this.updatedAt
    );
  }

  static fromDomain(brand: Brand): BrandEntity {
    const entity = new BrandEntity();
    entity.id = brand.id;
    entity.name = brand.name;
    entity.description = brand.description;
    entity.slug = brand.slug;
    entity.logo = brand.logo;
    entity.createdAt = brand.createdAt;
    entity.updatedAt = brand.updatedAt;
    return entity;
  }
} 