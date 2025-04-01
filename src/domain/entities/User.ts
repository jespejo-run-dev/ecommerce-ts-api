import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

export type UserRole = 'admin' | 'client';

export class User {
  constructor(
    public readonly id: string,
    public email: string,
    public password: string,
    public nickname: string,
    public role: UserRole = 'client',
    public businessName: string,
    public rut: string,
    public phone: string,
    public businessType: string,
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {
    // Validar que los campos de negocio estén presentes si el rol es cliente
    if (role === 'client') {
      if (!businessName || !rut || !phone || !businessType) {
        throw new Error('Business fields are required for client users');
      }
    }
  }

  static async create(
    email: string,
    password: string,
    nickname: string,
    role: UserRole = 'client',
    businessName?: string,
    rut?: string,
    phone?: string,
    businessType?: string
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Si es cliente, asegurarse de que todos los campos de negocio estén presentes
    if (role === 'client') {
      if (!businessName || !rut || !phone || !businessType) {
        throw new Error('Business fields are required for client users');
      }
    }

    return new User(
      uuidv4(),
      email,
      hashedPassword,
      nickname,
      role,
      businessName || '',
      rut || '',
      phone || '',
      businessType || ''
    );
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  async changePassword(newPassword: string): Promise<void> {
    this.password = await bcrypt.hash(newPassword, 10);
    this.updatedAt = new Date();
  }

  isAdmin(): boolean {
    return this.role === 'admin';
  }
} 