import { IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  emailId: string;

  @IsString()
  password: string;
}
