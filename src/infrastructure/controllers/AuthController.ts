import { Request, Response } from 'express';
import { AuthService } from '../../application/services/AuthService';

export class AuthController {
  constructor(private authService: AuthService) {}

  async register(req: Request, res: Response) {
    try {
      const { user, token } = await this.authService.register(req.body);
      res.status(201).json({ user, token });
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Error registering user' });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const { user, token } = await this.authService.login(email, password);
      res.json({ user, token });
    } catch (error) {
      res.status(401).json({ error: error instanceof Error ? error.message : 'Invalid credentials' });
    }
  }

  async changePassword(req: Request, res: Response) {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      await this.authService.changePassword(userId, currentPassword, newPassword);
      res.json({ message: 'Password changed successfully' });
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Error changing password' });
    }
  }
} 