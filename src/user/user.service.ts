import { Injectable } from '@nestjs/common';
import { create } from 'domain';
import { DatabaseService } from 'src/database/database.service';
import { CreateUserDto } from 'src/user/dto/create_user.dto';
import { UpdateUserDto } from 'src/user/dto/update_user.dto';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getUserByEmail(businessId: string, emailId: string) {
    const connection = await this.databaseService.getConnection(businessId);
    const userRepo = connection.getRepository(User);

    const user = await userRepo.findOne({
      where: { email_id: emailId },
    });

    if (!user) {
      return null;
    }

    return user;
  }

  async createUser(businessId: string, createUserDto: Partial<CreateUserDto>) {
    const connection = await this.databaseService.getConnection(businessId);
    const userRepo = connection.getRepository(User);

    const user = await userRepo.insert({
      id: createUserDto?.id,
      email_id: createUserDto?.email_id,
      password: createUserDto?.password,
      first_name: createUserDto?.first_name,
      last_name: createUserDto?.last_name,
      user_role: createUserDto?.user_role,
    });

    if (!user) {
      return null;
    }

    return user?.generatedMaps[0];
  }

  async updateUser(
    userId: string,
    businessId: string,
    payload: Partial<UpdateUserDto>,
  ) {
    const connection = await this.databaseService.getConnection(businessId);
    const userRepo = connection.getRepository(User);

    return await userRepo.update({ id: userId }, payload);
  }
}
