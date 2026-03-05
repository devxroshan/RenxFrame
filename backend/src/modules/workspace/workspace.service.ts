import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Workspace } from './schema/workspace.schema';
import { Model } from 'mongoose';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { PrismaService } from 'src/common/database/prisma.service';

@Injectable()
export class WorkspaceService {
  constructor(
    private readonly prismaService: PrismaService
  ) {}

  async create(createWorkspaceDto: CreateWorkspaceDto, userId: string) {
    try {
      const workspace = await this.prismaService.workspace.create({
        data: {
          ownerId: userId,
          ...createWorkspaceDto
        }
      })

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
          ownerId: userId
        }
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
          id: workspaceId
        }
      })

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
}
