import { Cart } from '../../../domain/entities/Cart';
import { ICartRepository } from '../../../domain/repositories/ICartRepository';
import { IProductRepository } from '../../../domain/repositories/IProductRepository';

export class AddItemToCartUseCase {
  constructor(
    private cartRepository: ICartRepository,
    private productRepository: IProductRepository
  ) {}

  async execute(userId: string, productId: string, quantity: number): Promise<Cart> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new Error('Producto no encontrado');
    }

    if (product.status === 'inactive') {
      throw new Error('El producto no está disponible');
    }

    if (product.stock < quantity) {
      throw new Error('Stock insuficiente');
    }

    const cart = await this.cartRepository.findByUserId(userId);
    if (!cart) {
      throw new Error('Carrito no encontrado');
    }

    cart.addItem(
      {
        id: product.id,
        price: product.price,
        name: product.name,
        image: product.image
      },
      quantity
    );

    await this.cartRepository.save(cart);
    return cart;
  }
} 