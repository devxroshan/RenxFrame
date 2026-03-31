import { Controller, Post, Req,Get, Body, UseGuards, Put, Param } from "@nestjs/common";
import { WorkspaceService } from "./workspace.service";
import { CreateWorkspaceDto } from "./dto/create-workspace.dto";
import * as express from 'express'
import { IsLoggedInGuard } from "src/common/guards/is-logged-in.guard";
import { UpdateWorkspaceDto } from "./dto/update-workspace.dto";

@Controller('workspace')
@UseGuards(IsLoggedInGuard)
export class WorkspaceController {
    constructor(
        private readonly workspaceService: WorkspaceService
    ){}

    @Post()
    async create(@Body() createWorkspaceDto:CreateWorkspaceDto, @Req() req:express.Request){
        return await this.workspaceService.create(createWorkspaceDto, req.user?.id)
    }

    @Get()
    async getAllWorkspace(@Req() req:express.Request) {
        return await this.workspaceService.getAllWorkspace(req.user?.id)
    }

    @Get(':workspace_id')
    async getWorkspace(@Req() req:express.Request) {
        return await this.workspaceService.getWorkspace(req.params?.workspace_id as string)
    }

    @Put(':workspace_id')
    async updateWorkspace(
        @Param('workspace_id') workspaceId: string,
        @Body() updateWorkspaceDto: UpdateWorkspaceDto,
    ) {
        return await this.workspaceService.updateWorkspace(updateWorkspaceDto.fieldName, updateWorkspaceDto.fieldValue, workspaceId)
    }
}