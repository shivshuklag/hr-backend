// src/database/database.service.ts
import { Injectable } from '@nestjs/common';
import { DataSource, DataSourceOptions } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { configService } from 'src/config/config.service';
import { Business } from 'src/user/entities/business.entity';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class DatabaseService {
  private connectionMap: Map<string, DataSource> = new Map();

  constructor(
    @InjectRepository(Business)
    private businessRepo: Repository<Business>,
    private redisService: RedisService,
  ) {}

  async getBusinessConfigFromRedis(businessId: string): Promise<Business> {
    const cachedConfig = await this.redisService.getCache(
      `business:${businessId}`,
    );

    if (cachedConfig) {
      return JSON.parse(cachedConfig);
    }

    // If not present in redis
    const businessConfig = await this.businessRepo.findOne({
      where: { id: businessId },
      select: { host: true, db_name: true },
    });

    if (!businessConfig) {
      return null;
    }

    await this.redisService.setCache(
      `business:${businessId}`,
      JSON.stringify(businessConfig),
    );

    return businessConfig;
  }

  async getConnection(businessId: string): Promise<DataSource> {
    // Chec for active connection
    if (this.connectionMap.has(businessId)) {
      return this.connectionMap.get(businessId);
    }

    const businessConfig = await this.getBusinessConfigFromRedis(businessId);

    const options: DataSourceOptions = {
      type: 'postgres',
      host: businessConfig.host,
      port: +process.env.DATABASE_PORT,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: businessConfig.db_name,
    };

    const connection = new DataSource(options);
    await connection.initialize();

    // Cache the connection in the local map
    this.connectionMap.set(businessId, connection);

    return connection;
  }
}
