import { createClient } from 'redis';
import { IStorage } from './IStorage';

export class RedisStorage implements IStorage {
  private client: ReturnType<typeof createClient>;

  constructor(url: string = process.env.REDIS_URL || 'redis://localhost:6379') {
    this.client = createClient({ url });
  }

  async connect(): Promise<void> {
    await this.client.connect();
  }

  async disconnect(): Promise<void> {
    await this.client.disconnect();
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    await this.client.set(key, value);
    if (ttl) {
      await this.client.expire(key, ttl);
    }
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }
} 