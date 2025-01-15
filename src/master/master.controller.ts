import { Body, Controller, Post } from '@nestjs/common';
import { MasterService } from './master.service';
import { JwtProcessed } from 'src/auth/decorator/jwt-response.decorator';
import { JwtResponseInterface } from 'src/auth/interfaces/jwt.interface';
import { UpdateMasterUserDto } from 'src/master/dto/master_user_update.dto';

@Controller('master')
export class MasterController {
  constructor(private readonly masterService: MasterService) {}

  @Post('update')
  async updateMasterUser(
    @JwtProcessed() jwtDecoded: JwtResponseInterface,
    @Body() updateMasterUserDto: UpdateMasterUserDto,
  ) {
    return await this.masterService.updateMasterUser(
      jwtDecoded,
      updateMasterUserDto,
    );
  }
}
