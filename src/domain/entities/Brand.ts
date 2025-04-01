export class Brand {
  constructor(
    public readonly id: string,
    public name: string,
    public description: string,
    public slug: string,
    public logo?: string,
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}

  public update(name: string, description: string, slug: string, logo?: string): void {
    this.name = name;
    this.description = description;
    this.slug = slug;
    this.logo = logo;
    this.updatedAt = new Date();
  }
} 