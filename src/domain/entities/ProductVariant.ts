export class ProductVariant {
  constructor(
    public readonly id: string,
    public readonly productId: string,
    public sku: string,
    public stock: number,
    public attributes: { [key: string]: string }, // Ejemplo: { size: 'XL', color: 'Red' }
    public price?: number, // Precio opcional específico de la variante
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}

  update(
    sku: string,
    stock: number,
    attributes: { [key: string]: string },
    price?: number
  ): void {
    this.sku = sku;
    this.stock = stock;
    this.attributes = attributes;
    this.price = price;
    this.updatedAt = new Date();
  }

  updateStock(quantity: number): void {
    if (quantity < 0) {
      throw new Error('El stock no puede ser negativo');
    }
    this.stock = quantity;
    this.updatedAt = new Date();
  }

  addStock(quantity: number): void {
    this.stock += quantity;
    this.updatedAt = new Date();
  }

  removeStock(quantity: number): void {
    if (this.stock - quantity < 0) {
      throw new Error('Stock insuficiente');
    }
    this.stock -= quantity;
    this.updatedAt = new Date();
  }
}