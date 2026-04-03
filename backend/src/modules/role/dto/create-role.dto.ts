import { IsBoolean, IsDefined, IsNotEmpty, IsObject, IsOptional, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class PermissionsDto {
    @IsBoolean()
    @IsOptional()
    canEdit?: boolean;

    @IsBoolean()
    @IsOptional()
    canManageBilling?: boolean;

    @IsBoolean()
    @IsOptional()
    canPublish?: boolean;

    @IsBoolean()
    @IsOptional()
    canDeleteSite?: boolean;

    @IsBoolean()
    @IsOptional()
    canEditMembers?: boolean;

    @IsBoolean()
    @IsOptional()
    canEditDomain?: boolean;

    @IsBoolean()
    @IsOptional()
    canEditRoles?: boolean;
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

    @IsOptional()
    @ValidateNested()
    @Type(() => PermissionsDto)
    permissions: PermissionsDto
}