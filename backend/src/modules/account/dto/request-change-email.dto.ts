import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RequestChangeEmailDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  newEmail: string;

  @IsNotEmpty()
  @IsString()
  name: string;
}
