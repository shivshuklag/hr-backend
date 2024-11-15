import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { UpdateAdminUserDto } from 'src/user/dto/update_user.dto';
import { Business } from 'src/user/entities/business.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MasterService {
  constructor(
    @InjectRepository(Business)
    private readonly businessRepo: Repository<Business>,
  ) {}

  async getAdminUser(emailId: string) {
    const admin = await this.businessRepo.findOne({
      where: { email_id: emailId },
      select: { id: true },
    });

    if (!admin) {
      return null;
    }

    return admin;
  }

  async createAdminUser(registerDto: RegisterDto) {
    const admin = await this.businessRepo.insert({
      email_id: registerDto?.emailId,
    });

    if (!admin) {
      return null;
    }

    return admin?.generatedMaps[0];
  }

  async updateAdminUser(userId: string, payload: UpdateAdminUserDto) {
    return await this.businessRepo.update({ id: userId }, payload);
  }
}
