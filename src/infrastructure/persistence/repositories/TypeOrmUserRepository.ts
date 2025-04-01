import { Repository } from 'typeorm';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { User } from '../../../domain/entities/User';
import { UserEntity } from '../entities/UserEntity';

export class TypeOrmUserRepository implements IUserRepository {
  constructor(private repository: Repository<UserEntity>) {}

  async findById(id: string): Promise<User | null> {
    const user = await this.repository.findOne({ where: { id } });
    return user ? user.toDomain() : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.repository.findOne({ where: { email } });
    return user ? user.toDomain() : null;
  }

  async findByRut(rut: string): Promise<User | null> {
    const user = await this.repository.findOne({ where: { rut } });
    return user ? user.toDomain() : null;
  }

  async create(user: User): Promise<User> {
    const entity = UserEntity.fromDomain(user);
    const savedEntity = await this.repository.save(entity);
    return savedEntity.toDomain();
  }

  async update(user: User): Promise<User> {
    const entity = UserEntity.fromDomain(user);
    const updatedEntity = await this.repository.save(entity);
    return updatedEntity.toDomain();
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
} 