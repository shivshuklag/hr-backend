import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import { BusinessStatusEnum } from 'src/user/enum/business_status.enum';
import { UserRoleEnum } from 'src/user/enum/user_role.enum';
import { UserStatusEnum } from 'src/user/enum/user_status.enum';

export class UpdateMasterUserDto {
  @IsString()
  @IsOptional()
  password: string;

  @IsString()
  @IsOptional()
  first_name: string;

  @IsString()
  @IsOptional()
  last_name: string;

  @IsString()
  @IsOptional()
  business_name: string;

  @IsString()
  @IsOptional()
  business_size: string;

  @IsString()
  @IsEnum(UserRoleEnum)
  @IsOptional()
  user_role: string;

  @IsString()
  @IsEnum(UserStatusEnum)
  @IsOptional()
  user_status: string;

  @IsString()
  @IsEnum(BusinessStatusEnum)
  @IsOptional()
  business_status: string;

  @IsDate()
  @IsOptional()
  email_verified_at: Date;
}
