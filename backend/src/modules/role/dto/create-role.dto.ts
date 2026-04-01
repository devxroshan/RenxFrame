import { IsBoolean, IsDefined, IsNotEmpty, IsObject, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class PermissionsDto {
    @IsBoolean()
    @IsNotEmpty()
    canEdit: boolean;

    @IsBoolean()
    @IsNotEmpty()
    canManageBilling: boolean;

    @IsBoolean()
    @IsNotEmpty()
    canPublish: boolean;

    @IsBoolean()
    @IsNotEmpty()
    canDeleteSite: boolean;

    @IsBoolean()
    @IsNotEmpty()
    canEditMembers: boolean;

    @IsBoolean()
    @IsNotEmpty()
    canEditDomain: boolean;

    @IsBoolean()
    @IsNotEmpty()
    canEditRoles: boolean;
}

export class CreateRoleDto {
    @IsNotEmpty()
    @IsString()
    roleName: string

    @IsNotEmpty()
    @IsBoolean()
    isProjectOnly: boolean

    @IsString()
    siteId: string

    @IsString()
    workspaceId: string

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => PermissionsDto)
    permissions: PermissionsDto
}