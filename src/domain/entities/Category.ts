export class Category {
  constructor(
    public readonly id: string,
    public name: string,
    public description: string,
    public slug: string,
    public parentId?: string,
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}

  public update(name: string, description: string, slug: string): void {
    this.name = name;
    this.description = description;
    this.slug = slug;
    this.updatedAt = new Date();
  }
} 