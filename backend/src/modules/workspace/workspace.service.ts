import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { PrismaService } from 'src/common/database/prisma.service';

@Injectable()
export class WorkspaceService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createWorkspaceDto: CreateWorkspaceDto, userId: string) {
    try {
      const workspace = await this.prismaService.workspace.create({
        data: {
          ownerId: userId,
          ...createWorkspaceDto,
        },
      });

      return {
        ok: true,
        msg: 'Workspace created successfully.',
        data: workspace,
      };
    } catch (error) {
      throw error;
    }
  }

  async getAllWorkspace(userId: string) {
    try {
      const workspaces = await this.prismaService.workspace.findMany({
        where: {
          ownerId: userId,
        },
      });

      if (workspaces.length == 0) {
        return {
          ok: true,
          msg: 'No workspaces yet.',
        };
      }

      return {
        ok: true,
        msg: 'Workspace created successfully.',
        data: workspaces,
      };
    } catch (error) {
      throw error;
    }
  }

  async getWorkspace(workspaceId: string) {
    try {
      const workspace = await this.prismaService.workspace.findUnique({
        where: {
          id: workspaceId,
        },
      });

      if (!workspace) {
        throw new NotFoundException({
          code: 'WORKSPACE_NOT_FOUND',
          msg: `Workspace with ID ${workspaceId} not found.`,
        });
      }

      return {
        ok: true,
        msg: 'Workspace found.',
        data: workspace,
      };
    } catch (error) {
      throw error;
    }
  }

  async updateWorkspace(
    fieldName: string,
    fieldValue: string,
    workspaceId: string,
  ) {
    if (!['name', 'description', 'theme'].includes(fieldName)) {
      throw new NotFoundException({
        code: 'FIELD_NOT_FOUND',
        msg: `Field ${fieldName} is not a valid field for update.`,
      });
    }

    if (!workspaceId) {
      throw new BadRequestException({
        code: 'WORKSPACE_ID_REQUIRED',
        msg: 'Workspace ID is required for update.',
      });
    }

    if (fieldName === 'theme' && !['light', 'dark'].includes(fieldValue)) {
      throw new NotFoundException({
        code: 'INVALID_THEME_VALUE',
        msg: `Invalid theme value. Allowed values are 'light' and 'dark'.`,
      });
    }

    try {
      const workspace = await this.prismaService.workspace.update({
        where: {
          id: workspaceId,
        },
        data: {
          [fieldName]: fieldValue,
        },
      });

      return {
        ok: true,
        msg: 'Workspace updated successfully.',
        data: workspace,
      };
    } catch (error) {
      throw error;
    }
  }
}
