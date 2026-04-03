import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/database/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RoleService {
  constructor(private readonly prismaService: PrismaService) {}

  async createRole(createRoleDto: CreateRoleDto) {
    if (createRoleDto.isProjectOnly && !createRoleDto.siteId) {
      throw new BadRequestException({
        code: 'SITE_ID_REQUIRED',
        msg: 'Site ID is required when the role is project only.',
      });
    }

    if (!createRoleDto.isProjectOnly && !createRoleDto.workspaceId) {
      throw new BadRequestException({
        code: 'WORKSPACE_ID_REQUIRED',
        msg: 'Workspace ID is required when the role is not project only.',
      });
    }

    if (createRoleDto.workspaceId.trim() && !createRoleDto.isProjectOnly) {
      const isWorkspace = await this.prismaService.workspace.findUnique({
        where: {
          id: createRoleDto.workspaceId,
        },
      });

      if (!isWorkspace) {
        throw new NotFoundException({
          code: 'WORKSPACE_NOT_FOUND',
          msg: `Workspace not found with ID - ${createRoleDto.workspaceId}`,
        });
      }
    }

    if (createRoleDto.siteId.trim() && createRoleDto.isProjectOnly) {
      const isSite = await this.prismaService.site.findUnique({
        where: {
          id: createRoleDto.siteId,
        },
      });

      if (!isSite) {
        throw new NotFoundException({
          code: 'SITE_NOT_FOUND',
          msg: `Site not found with ID - ${createRoleDto.siteId}`,
        });
      }
    }

    try {
      const newRole = await this.prismaService.role.create({
        data: {
          roleName: createRoleDto.roleName,
          isProjectOnly: createRoleDto.isProjectOnly,
          siteId: createRoleDto.isProjectOnly ? createRoleDto.siteId : null,
          workspaceId: createRoleDto.isProjectOnly
            ? null
            : createRoleDto.workspaceId,
            ...(createRoleDto.permissions && Object.keys(createRoleDto.permissions).length > 0 && {
              ...createRoleDto.permissions
            })
        },
      });

      return {
        ok: true,
        msg: 'Role created successfully.',
        data: newRole,
      };
    } catch (error) {
      throw error;
    }
  }

  async updateRole(roleId: string, updateRoleDto: UpdateRoleDto) {
    if (!roleId) {
      throw new BadRequestException({
        code: 'ROLE_ID_REQURIED',
        msg: 'Role ID not given.',
      });
    }

    if (Object.entries(updateRoleDto).every(field => !field[1])) {
      throw new BadRequestException({
        code: 'NOTHING_TO_UPDATE',
        msg: 'Nothing to update.',
      });
    }

    try {
      const updatedRole = await this.prismaService.role.update({
        where: {
          id: roleId,
        },
        data: {
          ...updateRoleDto,
        },
      });

      return {
        ok: true,
        msg: 'Role updated successfully.',
        data: updatedRole,
      };
    } catch (error) {
      throw error;
    }
  }

  async getAllWorkspaceRoles(workspaceId: string) {
    if (!workspaceId) {
      throw new BadRequestException({
        code: 'WORKSPACE_ID_REQUIRED',
        msg: 'Workspace ID is required.',
      });
    }

    const allWorkspaceRoles = await this.prismaService.role.findMany({
      where: {
        workspaceId,
        isProjectOnly: false,
      },
    });

    if (allWorkspaceRoles.length == 0) {
      return {
        ok: true,
        msg: 'No workspace roles.',
      };
    }

    return {
      ok: true,
      msg: 'Workspace roles fetched successfully.',
      data: allWorkspaceRoles,
    };
  }

  async getAllProjectRoles(projectId: string) {
    if (!projectId) {
      throw new BadRequestException({
        code: 'PROJECT_ID_REQUIRED',
        msg: 'Project ID is required.',
      });
    }

    const allProjectRoles = await this.prismaService.role.findMany({
      where: {
        siteId: projectId,
        isProjectOnly: true,
      },
    });

    if (allProjectRoles.length == 0) {
      return {
        ok: true,
        msg: 'No project roles.',
      };
    }

    return {
      ok: true,
      msg: 'Project roles fetched successfully.',
      data: allProjectRoles,
    };
  }

  async deleteRole(roleId: string) {
    if (!roleId) {
      throw new BadRequestException({
        code: 'ROLE_ID_REQUIRED',
        msg: 'ROLE ID is required.',
      });
    }

    try {
      await this.prismaService.role.delete({
        where: {
          id: roleId,
        },
      });

      return {
        ok: true,
        msg: `Role ${roleId} deleted successfully.`,
      };
    } catch (error) {
      throw error;
    }
  }
}
