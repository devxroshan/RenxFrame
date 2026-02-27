import { IsNotEmpty, IsString } from "class-validator";

export class CreateSiteDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    subdomain: string;
}