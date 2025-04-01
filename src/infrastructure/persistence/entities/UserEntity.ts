import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User, UserRole } from '../../../domain/entities/User';

@Entity('users')
export class UserEntity {
  @PrimaryColumn()
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ unique: true })
  nickname!: string;

  @Column({
    type: 'enum',
    enum: ['admin', 'client'],
    default: 'client'
  })
  role!: UserRole;

  @Column()
  businessName!: string;

  @Column()
  rut!: string;

  @Column()
  phone!: string;

  @Column()
  businessType!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  toDomain(): User {
    return new User(
      this.id,
      this.email,
      this.password,
      this.nickname,
      this.role,
      this.businessName,
      this.rut,
      this.phone,
      this.businessType,
      this.createdAt,
      this.updatedAt
    );
  }

  static fromDomain(user: User): UserEntity {
    const entity = new UserEntity();
    entity.id = user.id;
    entity.email = user.email;
    entity.password = user.password;
    entity.nickname = user.nickname;
    entity.role = user.role;
    entity.businessName = user.businessName;
    entity.rut = user.rut;
    entity.phone = user.phone;
    entity.businessType = user.businessType;
    entity.createdAt = user.createdAt;
    entity.updatedAt = user.updatedAt;
    return entity;
  }
} 