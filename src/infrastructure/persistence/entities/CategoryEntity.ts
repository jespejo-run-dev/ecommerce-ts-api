import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Category } from '../../../domain/entities/Category';

@Entity('categories')
export class CategoryEntity {
  @PrimaryColumn()
  id!: string;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @Column({ unique: true })
  slug!: string;

  @Column({ nullable: true })
  parentId?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  toDomain(): Category {
    return new Category(
      this.id,
      this.name,
      this.description,
      this.slug,
      this.parentId,
      this.createdAt,
      this.updatedAt
    );
  }

  static fromDomain(category: Category): CategoryEntity {
    const entity = new CategoryEntity();
    entity.id = category.id;
    entity.name = category.name;
    entity.description = category.description;
    entity.slug = category.slug;
    entity.parentId = category.parentId;
    entity.createdAt = category.createdAt;
    entity.updatedAt = category.updatedAt;
    return entity;
  }
} 