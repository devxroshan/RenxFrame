import { Controller, Post, Req,Get, Body, UseGuards } from "@nestjs/common";
import { WorkspaceService } from "./workspace.service";
import { CreateWorkspaceDto } from "./dto/create-workspace.dto";
import * as express from 'express'
import { IsLoggedInGuard } from "src/common/guards/is-logged-in.guard";

@Controller('workspace')
@UseGuards(IsLoggedInGuard)
export class WorkspaceController {
    constructor(
        private readonly workspaceService: WorkspaceService
    ){}

    @Post()
    async create(@Body() createWorkspaceDto:CreateWorkspaceDto, @Req() req:express.Request){
        return this.workspaceService.create(createWorkspaceDto, req.user?.id)
    }

    @Get()
    async getAllWorkspace(@Req() req:express.Request) {
        return this.workspaceService.getAllWorkspace(req.user?.id)
    }

    @Get(':workspace_id')
    async getWorkspace(@Req() req:express.Request) {
        return this.workspaceService.getAllWorkspace(req.params?.workspace_id as string)
    }
}