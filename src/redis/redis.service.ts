import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

  async setCache(key: string, value: string): Promise<string> {
    return await this.redisClient.set(key, value);
  }

  async getCache(key: string): Promise<string | null> {
    return await this.redisClient.get(key);
  }

  async delCache(key: string): Promise<number | null> {
    return await this.redisClient.del(key);
  }
}
