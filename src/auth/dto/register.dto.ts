import { IsBoolean, IsString } from 'class-validator';

export class RegisterDto {
  @IsString()
  emailId: string;

  @IsBoolean()
  isAdmin: boolean;
}
