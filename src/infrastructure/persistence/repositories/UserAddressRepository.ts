import { Repository } from 'typeorm';
import { UserAddress, AddressType } from '../../../domain/entities/UserAddress';
import { IUserAddressRepository } from '../../../domain/repositories/IUserAddressRepository';
import { AddressEntity } from '../entities/AddressEntity';

export class UserAddressRepository implements IUserAddressRepository {
  constructor(private repository: Repository<AddressEntity>) {}

  private toDomain(entity: AddressEntity): UserAddress {
    return new UserAddress(
      entity.id,
      entity.userId,
      entity.type,
      entity.name,
      entity.street,
      entity.city,
      entity.state,
      entity.country,
      entity.postalCode,
      entity.phone,
      entity.isDefault,
      entity.createdAt,
      entity.updatedAt
    );
  }

  private toEntity(domain: UserAddress): AddressEntity {
    const entity = new AddressEntity();
    entity.id = domain.id;
    entity.userId = domain.userId;
    entity.type = domain.type;
    entity.name = domain.name;
    entity.street = domain.street;
    entity.city = domain.city;
    entity.state = domain.state;
    entity.country = domain.country;
    entity.postalCode = domain.postalCode;
    entity.phone = domain.phone;
    entity.isDefault = domain.isDefault;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }

  async findById(id: string): Promise<UserAddress | null> {
    try {
      const entity = await this.repository.findOne({ where: { id } });
      return entity ? this.toDomain(entity) : null;
    } catch (error) {
      console.error('Error al buscar la dirección:', error);
      throw new Error('No se pudo obtener la dirección');
    }
  }

  async findByUserId(userId: string): Promise<UserAddress[]> {
    try {
      const entities = await this.repository.find({
        where: { userId },
        order: { isDefault: 'DESC', createdAt: 'DESC' }
      });
      return entities.map(entity => this.toDomain(entity));
    } catch (error) {
      console.error('Error al buscar direcciones del usuario:', error);
      throw new Error('No se pudieron obtener las direcciones');
    }
  }

  async findByUserIdAndType(userId: string, type: AddressType): Promise<UserAddress | null> {
    try {
      const entity = await this.repository.findOne({
        where: { userId, type }
      });
      return entity ? this.toDomain(entity) : null;
    } catch (error) {
      console.error('Error al buscar dirección por tipo:', error);
      throw new Error('No se pudo obtener la dirección');
    }
  }

  async save(address: UserAddress): Promise<UserAddress> {
    try {
      if (address.isDefault) {
        await this.repository.update(
          { userId: address.userId, isDefault: true },
          { isDefault: false }
        );
      }
      
      const entity = this.toEntity(address);
      const savedEntity = await this.repository.save(entity);
      return this.toDomain(savedEntity);
    } catch (error) {
      console.error('Error al guardar la dirección:', error);
      throw new Error('No se pudo guardar la dirección');
    }
  }

  async setDefaultAddress(userId: string, addressId: string): Promise<boolean> {
    try {
      const address = await this.findById(addressId);
      
      if (!address || address.userId !== userId) {
        throw new Error('Dirección no encontrada o no pertenece al usuario');
      }
  
      await this.repository.update(
        { userId, isDefault: true },
        { isDefault: false }
      );
  
      await this.repository.update(
        { id: addressId },
        { isDefault: true }
      );
  
      return true;  // Retornar true cuando la operación es exitosa
    } catch (error) {
      console.error('Error al establecer dirección por defecto:', error);
      return false;  // Retornar false si algo sale mal
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.repository.delete(id);
    } catch (error) {
      console.error('Error al eliminar la dirección:', error);
      throw new Error('No se pudo eliminar la dirección');
    }
  }
}