export class OrderItem {
  constructor(
    public readonly id: string,
    public orderId: string,
    public productId: string,
    public variantId?: string,
    public cantidad: number = 1,
    public precio: number = 0,
    public subtotal: number = 0
  ) {
    this.calcularSubtotal();
  }

  private calcularSubtotal(): void {
    this.subtotal = this.precio * this.cantidad;
  }

  actualizarCantidad(cantidad: number): void {
    this.cantidad = cantidad;
    this.calcularSubtotal();
  }
}