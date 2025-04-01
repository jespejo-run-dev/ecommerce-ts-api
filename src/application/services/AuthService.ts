import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';

config();

export class AuthService {
  constructor(private userRepository: IUserRepository) {}

  private generateToken(user: User): string {
    return jwt.sign(
      { 
        id: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
  }

  async register(data: {
    businessName: string;
    rut: string;
    phone: string;
    businessType: string;
    email: string;
    password: string;
    nickname: string;
  }): Promise<{ user: User; token: string }> {
    // Verificar si el email ya existe
    const existingEmail = await this.userRepository.findByEmail(data.email);
    if (existingEmail) {
      throw new Error('Email already exists');
    }

    // Verificar si el RUT ya existe
    const existingRut = await this.userRepository.findByRut(data.rut);
    if (existingRut) {
      throw new Error('RUT already exists');
    }

    // Validar campos de negocio
    if (!data.businessName || !data.rut || !data.phone || !data.businessType) {
      throw new Error('Business fields are required for client users');
    }

    const user = await User.create(
      data.email,
      data.password,
      data.nickname,
      'client',
      data.businessName,
      data.rut,
      data.phone,
      data.businessType
    );

    const savedUser = await this.userRepository.create(user);
    const token = this.generateToken(savedUser);

    return { user: savedUser, token };
  }

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    const token = this.generateToken(user);
    return { user, token };
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const isValidPassword = await user.validatePassword(currentPassword);
    if (!isValidPassword) {
      throw new Error('Current password is incorrect');
    }

    await user.changePassword(newPassword);
    await this.userRepository.update(user);
  }

  verifyToken(token: string): { id: string; email: string; role: string } {
    try {
      return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { id: string; email: string; role: string };
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
} 