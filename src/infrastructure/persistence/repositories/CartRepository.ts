import { Cart, CartItem } from '../../../domain/entities/Cart';
import { ICartRepository } from '../../../domain/repositories/ICartRepository';
import { IStorage } from '../storage/IStorage';
import { v4 as uuidv4 } from 'uuid';

export class CartRepository implements ICartRepository {
  private readonly prefix = 'cart:';
  private readonly ttl = 30 * 24 * 60 * 60; // 30 días en segundos

  constructor(private storage: IStorage) {}

  private getKey(userId: string): string {
    return `${this.prefix}${userId}`;
  }

  private toJSON(cart: Cart): string {
    return JSON.stringify({
      id: cart.id,
      userId: cart.userId,
      items: cart.items,
      summary: {
        total: cart.calculateTotal(),
        itemCount: cart.items.length,
        totalItems: cart.items.reduce((sum, item) => sum + item.quantity, 0)
      },
      createdAt: cart.createdAt.toISOString(),
      updatedAt: cart.updatedAt.toISOString()
    });
  }

  private fromJSON(json: string): Cart {
    const data = JSON.parse(json);
    
    // Reconstruir cada CartItem con sus métodos
    const items = data.items.map((item:CartItem) => new CartItem(
      item.productId,
      item.quantity,
      Number(item.price),
      item.name,
      item.image
    ));

    // Crear nuevo Cart con los items reconstruidos
    return new Cart(
      data.id,
      data.userId,
      items,
      new Date(data.createdAt),
      new Date(data.updatedAt)
    );
  }

  async findByUserId(userId: string): Promise<Cart | null> {
    const key = this.getKey(userId);
    const data = await this.storage.get(key);
    
    if (!data) {
      return null;
    }

    return this.fromJSON(data);
  }

  async createCart(userId: string): Promise<Cart> {
    const existingCart = await this.findByUserId(userId);
    if (existingCart) {
      throw new Error('El usuario ya tiene un carrito');
    }

    const newCart = new Cart(uuidv4(), userId, []);
    await this.save(newCart);
    return newCart;
  }

  async save(cart: Cart): Promise<void> {
    const key = this.getKey(cart.userId);
    await this.storage.set(key, this.toJSON(cart), this.ttl);
  }

  async delete(userId: string): Promise<void> {
    const key = this.getKey(userId);
    await this.storage.del(key);
  }
}