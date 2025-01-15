import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { JwtResponseInterface } from 'src/auth/interfaces/jwt.interface';
import { CreateBusinessUserMapDto } from 'src/master/dto/create_business_user_map.dto';
import { UpdateMasterUserDto } from 'src/master/dto/master_user_update.dto';
import { Business } from 'src/user/entities/business.entity';
import { BusinessUserMap } from 'src/user/entities/business_user_map.entity';
import { DatabasePool } from 'src/user/entities/database_pool.entity';
import { Server } from 'src/user/entities/server.entity';
import { BusinessStatusEnum } from 'src/user/enum/business_status.enum';
import { BusinessUserMapStatus } from 'src/user/enum/business_user_map_status.enum';
import { UserStatusEnum } from 'src/user/enum/user_status.enum';
import { UserService } from 'src/user/user.service';
import { generateHash } from 'src/utils/hash_string.util';
import { Repository } from 'typeorm';

@Injectable()
export class MasterService {
  constructor(
    @InjectRepository(Business)
    private readonly businessRepo: Repository<Business>,
    @InjectRepository(Server)
    private readonly serverRepo: Repository<Server>,
    @InjectRepository(DatabasePool)
    private readonly databasePoolRepo: Repository<DatabasePool>,
    @InjectRepository(BusinessUserMap)
    private readonly businessUserMapRepo: Repository<BusinessUserMap>,
    private readonly userService: UserService,
  ) {}

  async getMasterUserByEmail(emailId: string) {
    const admin = await this.businessRepo.findOne({
      where: { email_id: emailId },
      select: { id: true },
    });

    if (!admin) {
      return null;
    }

    return admin;
  }

  async createMasterUser(registerDto: RegisterDto) {
    const admin = await this.businessRepo.insert({
      email_id: registerDto?.emailId,
    });

    if (!admin) {
      return null;
    }

    return admin?.generatedMaps[0];
  }

  async updateMasterUser(
    jwtDecoded: JwtResponseInterface,
    payload: Partial<UpdateMasterUserDto>,
  ) {
    if (payload?.password) {
      const hashedPassword = await generateHash(payload?.password);
      payload.password = hashedPassword;
    }

    if (payload?.email_verified_at) {
      payload.business_status = BusinessStatusEnum.VERIFIED;
    }

    if (payload?.business_name) {
      payload.business_status = BusinessStatusEnum.ACTIVE;
    }

    await this.businessRepo.update({ id: jwtDecoded?.id }, payload);

    if (payload?.business_name) {
      delete payload.business_name;
      delete payload.business_status;
      payload.user_status = UserStatusEnum.ACTIVE;
    }

    if (payload?.business_size) {
      delete payload.business_size;
    }

    if (payload?.email_verified_at) {
      delete payload.business_status;
      payload.user_status = UserStatusEnum.VERIFIED;
    }

    if (Object.keys(payload).length) {
      await this.userService.updateUser(
        jwtDecoded?.id,
        jwtDecoded?.businessId,
        payload,
      );
    }
  }

  async addToBusinessUserMap(payload: CreateBusinessUserMapDto) {
    await this.businessUserMapRepo.insert({
      id: payload?.id,
      email_id: payload?.emailId,
      business_id: payload?.businessId,
    });
  }

  async getBusinessIdFromUserMap(emailId: string) {
    const business = await this.businessUserMapRepo.findOne({
      where: { email_id: emailId, status: BusinessUserMapStatus.ACTIVE },
    });

    return business?.business_id;
  }

  async assignDatabaseToBusiness(businessId: string) {
    const server = await this.serverRepo.findOne({ where: { is_open: true } });
    const database = await this.databasePoolRepo.findOne({
      where: { is_available: true, server_id: server?.id },
    });

    await this.databasePoolRepo.update(
      { id: database?.id },
      { is_taken: true, is_available: false },
    );

    await this.businessRepo.update(
      { id: businessId },
      { host: server?.host, db_name: database?.dbname },
    );
  }
}
