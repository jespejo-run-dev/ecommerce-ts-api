import { UserAddress, AddressType } from '../entities/UserAddress';

export interface IUserAddressRepository {
  findById(id: string): Promise<UserAddress | null>;
  findByUserId(userId: string): Promise<UserAddress[]>;
  findByUserIdAndType(userId: string, type: AddressType): Promise<UserAddress | null>;
  save(address: UserAddress): Promise<UserAddress>; // Devuelve la dirección guardada
  setDefaultAddress(userId: string, addressId: string): Promise<boolean>; // Retorna si tuvo éxito
  delete(id: string): Promise<void>;
}
