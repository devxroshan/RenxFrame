import { Controller, Param, Get, Body, Post, Put, Delete } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    return await this.roleService.createRole(createRoleDto);
  }

  @Put(':role_id')
  async updateRole(@Param('role_id') roleId: string,@Body() updateRoleDto:UpdateRoleDto){
    return await this.roleService.updateRole(roleId,updateRoleDto)
  }

  @Get('workspace/:workspace_id')
  async getAllWorkspaceRoles(@Param('workspace_id') workspaceId: string) {
    return await this.roleService.getAllWorkspaceRoles(workspaceId);
  }

  @Get('project/:project_id')
  async getAllProjectRoles(@Param('project_id') projectId:string){
    return await this.roleService.getAllProjectRoles(projectId)
  }

  @Delete(':role_id')
  async deleteRole(@Param('role_id') roleId: string){
    return await this.roleService.deleteRole(roleId)
  }

}
