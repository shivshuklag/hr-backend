import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { DatabaseService } from 'src/database/database.service';
import { Business } from 'src/user/entities/business.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Business)
    private readonly businessRepo: Repository<Business>,
  ) {}

  async getAdminUser(emailId: string) {
    const admin = await this.businessRepo.findOne({
      where: { email_id: emailId },
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
}
