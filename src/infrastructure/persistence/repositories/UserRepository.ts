import { Repository } from 'typeorm';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { User } from '../../../domain/entities/User';
import { UserEntity } from '../entities/UserEntity';

export class UserRepository implements IUserRepository {
  constructor(private repository: Repository<UserEntity>) {}

  private toDomain(entity: UserEntity): User {
    return new User(
      entity.id,
      entity.email,
      entity.password,
      entity.nickname,
      entity.role,
      entity.businessName,
      entity.rut,
      entity.phone,
      entity.businessType,
      entity.createdAt,
      entity.updatedAt
    );
  }

  private toEntity(domain: User): UserEntity {
    const entity = new UserEntity();
    entity.id = domain.id;
    entity.email = domain.email;
    entity.password = domain.password;
    entity.nickname = domain.nickname;
    entity.role = domain.role;
    entity.businessName = domain.businessName;
    entity.rut = domain.rut;
    entity.phone = domain.phone;
    entity.businessType = domain.businessType;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }

  async findById(id: string): Promise<User | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const entity = await this.repository.findOne({ where: { email } });
    return entity ? this.toDomain(entity) : null;
  }

  async findByRut(rut: string): Promise<User | null> {
    const entity = await this.repository.findOne({ where: { rut } });
    return entity ? this.toDomain(entity) : null;
  }

  async create(user: User): Promise<User> {
    const entity = this.toEntity(user);
    const savedEntity = await this.repository.save(entity);
    return this.toDomain(savedEntity);
  }

  async update(user: User): Promise<User> {
    const entity = this.toEntity(user);
    const updatedEntity = await this.repository.save(entity);
    return this.toDomain(updatedEntity);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
} 