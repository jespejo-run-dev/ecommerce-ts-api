import { UserAddress, AddressType } from '../../../domain/entities/UserAddress';
import { IUserAddressRepository } from '../../../domain/repositories/IUserAddressRepository';

export class CreateAddressUseCase {
  constructor(private userAddressRepository: IUserAddressRepository) {}

  async execute(
    userId: string,
    type: AddressType,
    name: string,
    street: string,
    city: string,
    state: string,
    country: string,
    postalCode: string,
    phone: string
  ): Promise<UserAddress> {
    // Validar si ya existe una dirección del mismo tipo para este usuario
    const existingAddress = await this.userAddressRepository.findByUserIdAndType(userId, type);
    if (existingAddress) {
      throw new Error('El usuario ya tiene una dirección de este tipo.');
    }

    // Crear la nueva dirección
    const address = UserAddress.create(
      userId,
      type,
      name,
      street,
      city,
      state,
      country,
      postalCode,
      phone
    );

    // Verificar si es la primera dirección del usuario y marcarla como predeterminada
    const existingAddresses = await this.userAddressRepository.findByUserId(userId);
    if (existingAddresses.length === 0) {
      address.setAsDefault();
    }

    // Guardar la dirección en la base de datos con manejo de errores
    try {
      await this.userAddressRepository.save(address);
    } catch (error) {
      throw new Error('No se pudo guardar la dirección: ' + (error as Error).message);
    }

    return address;
  }
}
