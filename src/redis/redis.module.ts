import { Global, Module } from '@nestjs/common';
import { Redis } from 'ioredis';
import { RedisController } from 'src/redis/redis.controller';
import { RedisService } from 'src/redis/redis.service';

@Global()
@Module({
  controllers: [RedisController],
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        const redis = new Redis({
          host: 'localhost',
          port: 6379,
        });

        redis.on('connect', () => console.log('Redis connected successfully'));
        redis.on('error', (error) =>
          console.log('Redis connection error: ', error),
        );

        return redis;
      },
    },
    RedisService,
  ],
  exports: ['REDIS_CLIENT', RedisService],
})
export class RedisModule {}
