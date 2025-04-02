export class CartItem {
  constructor(
    public readonly productId: string,
    public quantity: number,
    public readonly price: number,
    public readonly name: string,
    public readonly image?: string
  ) {}

  updateQuantity(newQuantity: number): void {
    this.quantity = newQuantity;
  }

  calculateSubtotal(): number {
    return this.quantity * this.price;
  }
}

export class Cart {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public items: CartItem[],
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}

  addItem(product: { id: string; price: number; name: string; image?: string }, quantity: number): void {
    const existingItem = this.items.find(item => item.productId === product.id);
    
    if (existingItem) {
      existingItem.updateQuantity(existingItem.quantity + quantity);
    } else {
      this.items.push(new CartItem(
        product.id,
        quantity,
        product.price,
        product.name,
        product.image
      ));
    }
    
    this.updatedAt = new Date();
  }

  removeItem(productId: string): void {
    this.items = this.items.filter(item => item.productId !== productId);
    this.updatedAt = new Date();
  }

  updateQuantity(productId: string, quantity: number): void {
    const item = this.items.find(item => item.productId === productId);
    if (item) {
      item.updateQuantity(quantity);
      this.updatedAt = new Date();
    }
  }

  calculateTotal(): number {
    return this.items.reduce((total, item) => total + item.calculateSubtotal(), 0);
  }

  clear(): void {
    this.items = [];
    this.updatedAt = new Date();
  }
} 