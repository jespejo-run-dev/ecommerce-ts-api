export class Product {
  constructor(
    public readonly id: string,
    public name: string,
    public description: string,
    public price: number,
    public stock: number,
    public sku: string,
    public slug: string,
    public status: 'active' | 'inactive',
    public innerQuantity: number,
    public categoryId?: string,
    public brandId?: string,
    public image?: string,
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}

  update(
    name: string,
    description: string,
    price: number,
    stock: number,
    sku: string,
    status: 'active' | 'inactive',
    categoryId?: string,
    brandId?: string,
    image?: string,
    innerQuantity?: number
  ): void {
    this.name = name;
    this.description = description;
    this.price = price;
    this.stock = stock;
    this.sku = sku;
    this.status = status;
    this.categoryId = categoryId;
    this.brandId = brandId;
    this.image = image;
    if (innerQuantity) this.innerQuantity = innerQuantity;
    this.updatedAt = new Date();
  }

  // Método básico para validar que el stock sea múltiplo de innerQuantity
  validateStock(): boolean {
    return this.stock % this.innerQuantity === 0;
  }

  // Método para obtener el número de inners completos
  getCompleteInners(): number {
    return Math.floor(this.stock / this.innerQuantity);
  }

  // Método para obtener el stock restante (no completo en inners)
  getRemainingStock(): number {
    return this.stock % this.innerQuantity;
  }

  // Método para actualizar el stock asegurando que sea múltiplo de innerQuantity
  updateStock(newStock: number): void {
    if (newStock % this.innerQuantity !== 0) {
      throw new Error(`Stock must be a multiple of ${this.innerQuantity}`);
    }
    this.stock = newStock;
    this.updatedAt = new Date();
  }

  // Método para agregar inners completos
  addInners(quantity: number): void {
    this.stock += quantity * this.innerQuantity;
    this.updatedAt = new Date();
  }

  // Método para remover inners completos
  removeInners(quantity: number): void {
    const newStock = this.stock - (quantity * this.innerQuantity);
    if (newStock < 0) {
      throw new Error('Insufficient stock');
    }
    this.stock = newStock;
    this.updatedAt = new Date();
  }
} 