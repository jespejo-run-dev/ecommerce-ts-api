import { Request, Response } from 'express';
import { AddItemToCartUseCase } from '../../application/useCases/cart/AddItemToCartUseCase';
import { ICartRepository } from '../../domain/repositories/ICartRepository';

export class CartController {
  constructor(
    private cartRepository: ICartRepository,
    private addItemToCartUseCase: AddItemToCartUseCase
  ) {}

  async getCart(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'No autorizado' });
        return;
      }

      const cart = await this.cartRepository.findByUserId(userId);
      if (!cart) {
        res.status(404).json({ error: 'Carrito no encontrado' });
        return;
      }

      if (cart.items.length === 0) {
        res.json({ message: 'El carrito está vacío' });
        return;
      }

      res.json(cart);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : 'Error al obtener el carrito' });
    }
  }

  async addItem(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'No autorizado' });
        return;
      }

      const { productId, quantity } = req.body;
      
      // Primero verificar si existe el carrito
      let cart = await this.cartRepository.findByUserId(userId);
      if (!cart) {
        // Crear carrito solo cuando se agrega el primer item
        cart = await this.cartRepository.createCart(userId);
      }

      const updatedCart = await this.addItemToCartUseCase.execute(userId, productId, quantity);
      res.json(updatedCart);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Error al agregar item al carrito' });
    }
  }

  async removeItem(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'No autorizado' });
        return;
      }

      const { productId } = req.params;
      const cart = await this.cartRepository.findByUserId(userId);
      if (!cart) {
        res.status(404).json({ error: 'Carrito no encontrado' });
        return;
      }

      const itemExists = cart.items.some(item => item.productId === productId);
      if (!itemExists) {
        res.status(404).json({ error: 'Item no encontrado en el carrito' });
        return;
      }

      cart.removeItem(productId);
      await this.cartRepository.save(cart);
      res.json(cart);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Error al remover item del carrito' });
    }
  }

  async updateQuantity(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'No autorizado' });
        return;
      }

      const { productId } = req.params;
      const { quantity } = req.body;
      const cart = await this.cartRepository.findByUserId(userId);

      // Agregar logs de debug
      console.log('Cart:', cart);
      console.log('Cart prototype:', Object.getPrototypeOf(cart));
      console.log('Cart methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(cart)));

      if (!cart) {
        res.status(404).json({ error: 'Carrito no encontrado' });
        return;
      }

      cart.updateQuantity(productId, quantity);
      await this.cartRepository.save(cart);
      res.json(cart);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Error al actualizar cantidad' });
    }
  }

  async clearCart(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'No autorizado' });
        return;
      }

      const cart = await this.cartRepository.findByUserId(userId);
      if (!cart) {
        res.status(404).json({ error: 'Carrito no encontrado' });
        return;
      }

      cart.clear();
      await this.cartRepository.save(cart);
      res.json({ message: 'Carrito vaciado correctamente' });
      
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Error al limpiar el carrito' });
    }
  }
}