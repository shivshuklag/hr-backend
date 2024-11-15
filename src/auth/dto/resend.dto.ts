import { IsString } from 'class-validator';

export class ResendDto {
  @IsString()
  emailId: string;
}
