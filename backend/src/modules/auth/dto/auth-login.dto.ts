import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export class AuthLoginDto {
    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}