import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Workspace } from './schema/workspace.schema';
import { Model } from 'mongoose';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';

@Injectable()
export class WorkspaceService {
  constructor(
    @InjectModel(Workspace.name) private workspaceModel: Model<Workspace>,
  ) {}

  async create(createWorkspaceDto: CreateWorkspaceDto, psUserId: string) {
    try {
      const workspace = await this.workspaceModel.create({
        owner: psUserId,
        ...createWorkspaceDto,
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

  async getAllWorkspace(psUserId: string) {
    try {
      const workspaces = await this.workspaceModel.find({
        owner: psUserId,
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
      const workspace = await this.workspaceModel.findById(workspaceId);

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
