import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryColumn()
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column()
  nickname!: string;

  @Column()
  role!: 'admin' | 'client';

  @Column({ nullable: true })
  businessName?: string;

  @Column({ nullable: true, unique: true })
  rut?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  businessType?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
} 