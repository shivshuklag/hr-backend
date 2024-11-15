import { IsBoolean, IsDate, IsString } from 'class-validator';

export class UpdateAdminUserDto {
  @IsDate()
  email_verified_at: Date;
}
