import { IsBoolean, IsEnum, IsNotEmpty, IsString } from "class-validator";


export class CreateSiteDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    subdomain: string;

    @IsNotEmpty()
    @IsBoolean()
    isWebsite: boolean;

    @IsNotEmpty()
    @IsString()
    workspaceId: string;
}