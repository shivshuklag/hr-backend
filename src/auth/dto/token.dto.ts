import { IsString } from 'class-validator';

export class TokenPayloadDto {
  @IsString()
  id: string;

  @IsString()
  emailId: string;
}
