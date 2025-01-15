import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtProcessed } from 'src/auth/decorator/jwt-response.decorator';
import { JwtResponseInterface } from 'src/auth/interfaces/jwt.interface';
import { CreateUserDto } from 'src/user/dto/create_user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('add')
  async addUser(
    @JwtProcessed() jwtDecoded: JwtResponseInterface,
    @Body() addUserDto: CreateUserDto,
  ) {
    return await this.userService.createUser(
      jwtDecoded?.businessId,
      addUserDto,
    );
  }
}
