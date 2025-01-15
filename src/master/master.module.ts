import { forwardRef, Module } from '@nestjs/common';
import { MasterService } from './master.service';
import { MasterController } from './master.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Business } from 'src/user/entities/business.entity';
import { Server } from 'src/user/entities/server.entity';
import { DatabasePool } from 'src/user/entities/database_pool.entity';
import { UserModule } from 'src/user/user.module';
import { BusinessUserMap } from 'src/user/entities/business_user_map.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Business, Server, DatabasePool, BusinessUserMap]),
    forwardRef(() => UserModule),
  ],
  controllers: [MasterController],
  providers: [MasterService],
  exports: [MasterService],
})
export class MasterModule {}
