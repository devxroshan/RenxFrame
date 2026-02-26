import { IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export class ChangePasswordDto {
    @IsNotEmpty()
    @IsString()
    @IsStrongPassword()
    newPassword: string

    @IsNotEmpty()
    @IsString()
    @IsStrongPassword()
    confirmPassword: string
}