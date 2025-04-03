import { Request, Response } from 'express';
import { CreateAddressUseCase } from '../../application/useCases/address/CreateAddressUseCase';
import { IUserAddressRepository } from '../../domain/repositories/IUserAddressRepository';

export class UserAddressController {
  constructor(
    private userAddressRepository: IUserAddressRepository,
    private createAddressUseCase: CreateAddressUseCase
  ) {}

  // Crear una nueva dirección
  async create(req: Request, res: Response): Promise<void> {
    try {

      console.log('Request body:', req.body);
      console.log('User:', req.user);
      
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'No autorizado' });
        return;
      }
  
      const { type, name, street, city, state, country, postalCode, phone } = req.body;
  
      // Llamar a execute pasando cada parámetro por separado
      const address = await this.createAddressUseCase.execute(
        userId, // userId
        type, // type
        name, // name
        street, // street
        city, // city
        state, // state
        country, // country
        postalCode, // postalCode
        phone // phone
      );
      res.status(201).json(address);
    } catch (error) {
      res.status(422).json({ error: error instanceof Error ? error.message : 'Error al crear dirección' });
    }
  }

  // Obtener todas las direcciones de un usuario
  async findAll(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'No autorizado' });
        return;
      }

      const addresses = await this.userAddressRepository.findByUserId(userId);
      res.json(addresses);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : 'Error al obtener direcciones' });
    }
  }

  // Actualizar una dirección existente
  async update(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'No autorizado' });
        return;
      }

      const { id } = req.params;
      const { name, street, city, state, country, postalCode, phone } = req.body;

      // Buscar dirección por ID
      const address = await this.userAddressRepository.findById(id);
      if (!address) {
        res.status(404).json({ error: 'Dirección no encontrada' });
        return;
      }

      // Verificar que la dirección pertenece al usuario
      if (address.userId !== userId) {
        res.status(403).json({ error: 'No autorizado para modificar esta dirección' });
        return;
      }

      // Actualizar la dirección
      address.update(name, street, city, state, country, postalCode, phone);
      const updatedAddress = await this.userAddressRepository.save(address);
      res.json(updatedAddress);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Error al actualizar dirección' });
    }
  }

  // Eliminar una dirección existente
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'No autorizado' });
        return;
      }
  
      const { id } = req.params;
  
      // Buscar la dirección por ID
      const address = await this.userAddressRepository.findById(id);
      if (!address) {
        res.status(404).json({ error: 'Dirección no encontrada' });
        return;
      }
  
      // Verificar que la dirección pertenece al usuario
      if (address.userId !== userId) {
        res.status(403).json({ error: 'No autorizado para eliminar esta dirección' });
        return;
      }
  
      // Eliminar la dirección
      await this.userAddressRepository.delete(id);
      // Cambiar esto para enviar una respuesta
      res.status(200).json({ 
        message: 'Dirección eliminada correctamente',
        deletedAddress: address 
      });
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : 'Error al eliminar dirección' });
    }
  }
}
