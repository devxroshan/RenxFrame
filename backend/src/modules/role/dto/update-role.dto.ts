import {
  IsOptional,
  IsString,
  IsBoolean,
} from 'class-validator';

export class UpdateRoleDto {
  @IsString()
  @IsOptional()
  roleName?: string;
  
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
