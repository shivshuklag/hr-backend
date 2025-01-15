import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRoleEnum } from 'src/user/enum/user_role.enum';
import { UserStatusEnum } from 'src/user/enum/user_status.enum';

export class CreateUserDto {
  @IsString()
  id: string;

  @IsString()
  email_id: string;

  @IsString()
  password: string;

  @IsString()
  @IsOptional()
  first_name: string;

  @IsString()
  @IsOptional()
  last_name: string;

  @IsString()
  @IsEnum(UserRoleEnum)
  user_role: string;

  @IsString()
  @IsEnum(UserStatusEnum)
  user_status: string;

  @IsDate()
  email_verified_at: Date;
}
