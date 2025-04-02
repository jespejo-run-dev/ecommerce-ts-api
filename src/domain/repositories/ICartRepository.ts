import { Cart } from '../entities/Cart';

export interface ICartRepository {
  findByUserId(userId: string): Promise<Cart | null>;
  createCart(userId: string): Promise<Cart>;
  save(cart: Cart): Promise<void>;
  delete(userId: string): Promise<void>;
} 