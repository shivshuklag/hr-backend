import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import { BusinessStatusEnum } from 'src/user/enum/business_status.enum';
import { UserRoleEnum } from 'src/user/enum/user_role.enum';
import { UserStatusEnum } from 'src/user/enum/user_status.enum';

export class CreateBusinessUserMapDto {
  @IsString()
  id: string;

  @IsString()
  emailId: string;

  @IsString()
  businessId: string;
}
