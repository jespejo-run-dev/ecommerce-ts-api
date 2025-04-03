import { v4 as uuidv4 } from 'uuid';

export type AddressType = 'billing' | 'shipping';

export class UserAddress {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public type: AddressType,
    public name: string,
    public street: string,
    public city: string,
    public state: string,
    public country: string,
    public postalCode: string,
    public phone: string,
    public isDefault: boolean = false,
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}

  static create(
    userId: string,
    type: AddressType,
    name: string,
    street: string,
    city: string,
    state: string,
    country: string,
    postalCode: string,
    phone: string,
    isDefault: boolean = false
  ): UserAddress {
    if (!userId.trim() || !name.trim() || !street.trim() || !city.trim() || !state.trim() || !country.trim() || !postalCode.trim() || !phone.trim()) {
      throw new Error('Todos los campos son obligatorios.');
    }

    if (!/^[0-9]{4,10}$/.test(postalCode)) {
      throw new Error('El código postal debe tener entre 4 y 10 dígitos.');
    }

    if (!/^\+?[0-9]{7,15}$/.test(phone)) {
      throw new Error('El número de teléfono no es válido.');
    }

    return new UserAddress(
      uuidv4(),
      userId,
      type,
      name.trim(),
      street.trim(),
      city.trim(),
      state.trim(),
      country.trim(),
      postalCode.trim(),
      phone.trim(),
      isDefault
    );
  }

  static fromDatabase(
    id: string,
    userId: string,
    type: AddressType,
    name: string,
    street: string,
    city: string,
    state: string,
    country: string,
    postalCode: string,
    phone: string,
    isDefault: boolean,
    createdAt: Date,
    updatedAt: Date
  ): UserAddress {
    if (!id) {
      throw new Error('El ID es obligatorio.');
    }

    return new UserAddress(
      id,
      userId,
      type,
      name,
      street,
      city,
      state,
      country,
      postalCode,
      phone,
      isDefault,
      createdAt,
      updatedAt
    );
  }

  update(
    name?: string,
    street?: string,
    city?: string,
    state?: string,
    country?: string,
    postalCode?: string,
    phone?: string
  ): void {
    if (name && name.trim()) this.name = name.trim();
    if (street && street.trim()) this.street = street.trim();
    if (city && city.trim()) this.city = city.trim();
    if (state && state.trim()) this.state = state.trim();
    if (country && country.trim()) this.country = country.trim();
    if (postalCode && /^[0-9]{4,10}$/.test(postalCode)) this.postalCode = postalCode.trim();
    if (phone && /^\+?[0-9]{7,15}$/.test(phone)) this.phone = phone.trim();
    this.updatedAt = new Date();
  }

  setAsDefault(): void {
    this.isDefault = true;
    this.updatedAt = new Date();
  }

  unsetDefault(): void {
    this.isDefault = false;
    this.updatedAt = new Date();
  }

  toJSON() {
    return Object.assign({}, this);
  }
}
