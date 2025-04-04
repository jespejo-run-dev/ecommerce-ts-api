import { Order, OrderStatus } from '../../../domain/entities/Order';
import { IOrderRepository } from '../../../domain/repositories/IOrderRepository';
import { ICartRepository } from '../../../domain/repositories/ICartRepository';
import { IUserAddressRepository } from '../../../domain/repositories/IUserAddressRepository';
import { OrderItem } from '../../../domain/entities/OrderItem';

interface CreateOrderDTO {
  userId: string;
  cartId: string;
  direccionEnvioId: string;
  direccionFacturacionId: string;
  notas?: string;
}

export class CreateOrderUseCase {
  constructor(
    private orderRepository: IOrderRepository,
    private cartRepository: ICartRepository,
    private userAddressRepository: IUserAddressRepository
  ) {}

  async execute(data: CreateOrderDTO): Promise<Order> {
    const cart = await this.cartRepository.findByUserId(data.userId);
    if (!cart) throw new Error('Carrito no encontrado');
    if (cart.items.length === 0) throw new Error('El carrito está vacío');

    const [direccionEnvio, direccionFacturacion] = await Promise.all([
      this.userAddressRepository.findById(data.direccionEnvioId),
      this.userAddressRepository.findById(data.direccionFacturacionId)
    ]);

    if (!direccionEnvio || !direccionFacturacion) {
      throw new Error('Direcciones no válidas');
    }

    const orderId = crypto.randomUUID();
    const orderItems = cart.items.map(cartItem => new OrderItem(
      crypto.randomUUID(),
      orderId,
      cartItem.productId,
      undefined,
      cartItem.quantity,
      cartItem.price,
      cartItem.price * cartItem.quantity
    ));

    const total = orderItems.reduce((sum, item) => sum + item.subtotal, 0);

    const order = new Order(
      orderId,
      data.userId,
      orderItems,
      OrderStatus.PENDING,
      total,
      direccionEnvio,
      direccionFacturacion,
      undefined,
      data.notas
    );

    const savedOrder = await this.orderRepository.crear(order);
    await this.cartRepository.delete(data.userId);

    return savedOrder;
  }
}