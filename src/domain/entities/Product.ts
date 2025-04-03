import { ProductVariant } from "./ProductVariant";

export class Product {
  private variants: ProductVariant[] = [];
  private hasVariantsEnabled: boolean = false;
  private stock: number = 0;

  constructor(
    public readonly id: string,
    public name: string,
    public description: string,
    public price: number,
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
    this.sku = sku;
    this.status = status;
    this.categoryId = categoryId;
    this.brandId = brandId;
    this.image = image;
    if (innerQuantity) this.innerQuantity = innerQuantity;
    this.updatedAt = new Date();
  }

  // Métodos adaptados para trabajar con variantes
  // Métodos unificados para gestión de stock
  validateStock(variantId?: string): boolean {
    if (!this.hasVariantsEnabled) {
      return this.stock % this.innerQuantity === 0;
    }
    if (variantId) {
      const variant = this.variants.find(v => v.id === variantId);
      return variant ? variant.stock % this.innerQuantity === 0 : false;
    }
    return this.validateAllStock();
  }

  getCompleteInners(variantId?: string): number {
    if (!this.hasVariantsEnabled) {
      return Math.floor(this.stock / this.innerQuantity);
    }
    if (variantId) {
      const variant = this.variants.find(v => v.id === variantId);
      return variant ? Math.floor(variant.stock / this.innerQuantity) : 0;
    }
    return this.getTotalCompleteInners();
  }

  getRemainingStock(variantId?: string): number {
    if (!this.hasVariantsEnabled) {
      return this.stock % this.innerQuantity;
    }
    if (variantId) {
      const variant = this.variants.find(v => v.id === variantId);
      return variant ? variant.stock % this.innerQuantity : 0;
    }
    return 0;
  }

  updateStock(stockOrVariantId: number | string, newStock?: number): void {
    if (!this.hasVariantsEnabled) {
      const stock = stockOrVariantId as number;
      if (stock % this.innerQuantity !== 0) {
        throw new Error(`El stock debe ser un múltiplo de ${this.innerQuantity}`);
      }
      this.stock = stock;
    } else {
      if (typeof stockOrVariantId !== 'string' || !newStock) {
        throw new Error('Para productos con variantes, se requiere el ID de la variante y el nuevo stock');
      }
      const variant = this.variants.find(v => v.id === stockOrVariantId);
      if (!variant) {
        throw new Error('Variante no encontrada');
      }
      if (newStock % this.innerQuantity !== 0) {
        throw new Error(`El stock debe ser un múltiplo de ${this.innerQuantity}`);
      }
      variant.updateStock(newStock);
    }
    this.updatedAt = new Date();
  }

  // Eliminar los métodos duplicados y mantener el resto igual
  validateAllStock(): boolean {
    return this.variants.every(variant => variant.stock % this.innerQuantity === 0);
  }

  getTotalCompleteInners(): number {
    return this.variants.reduce((total, variant) => 
      total + Math.floor(variant.stock / this.innerQuantity), 0);
  }

  addInners(variantId: string, quantity: number): void {
    const variant = this.variants.find(v => v.id === variantId);
    if (!variant) {
      throw new Error('Variante no encontrada');
    }
    variant.addStock(quantity * this.innerQuantity);
    this.updatedAt = new Date();
  }

  removeInners(variantId: string, quantity: number): void {
    const variant = this.variants.find(v => v.id === variantId);
    if (!variant) {
      throw new Error('Variante no encontrada');
    }
    const newStock = variant.stock - (quantity * this.innerQuantity);
    if (newStock < 0) {
      throw new Error('Stock insuficiente');
    }
    variant.updateStock(newStock);
    this.updatedAt = new Date();
  }

  // Métodos para gestión de variantes
  hasVariants(): boolean {
    return this.hasVariantsEnabled;
  }

  enableVariants(): void {
    this.hasVariantsEnabled = true;
    this.variants = [];
  }

  removeVariant(variantId: string): void {
    if (!this.hasVariantsEnabled) {
      throw new Error('Este producto no tiene variantes habilitadas');
    }
    this.variants = this.variants.filter(v => v.id !== variantId);
  }

  // Método para obtener el stock actual
  getCurrentStock(): number {
      return this.stock;
    }
}