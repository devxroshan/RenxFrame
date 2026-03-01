import { IsEnum, IsNotEmpty, IsString } from "class-validator";

export enum SiteType {
  WEBSITE = "website",
  TEMPLATE = "template"
}


export class CreateSiteDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    subdomain: string;

    @IsNotEmpty()
    @IsEnum(SiteType)
    type: SiteType;
}