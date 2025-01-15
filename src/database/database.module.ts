import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseController } from 'src/database/database.controller';
import { DatabaseService } from 'src/database/database.service';
import { RedisModule } from 'src/redis/redis.module';
import { Business } from 'src/user/entities/business.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Business]),
    forwardRef(() => RedisModule),
  ],
  controllers: [DatabaseController],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
