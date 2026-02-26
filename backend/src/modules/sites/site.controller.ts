import { Controller, Post, Body, UseGuards, Req } from "@nestjs/common";
import { SiteService } from "./site.service";
import { CreateSiteDto } from "./dto/create-site.dto";
import { IsLoggedInGuard } from "src/common/guards/is-logged-in.guard";
import { Site } from "./schema/site.schema";
import { SuccessResponse } from "src/type-declaration/response";
import * as express from 'express';

@Controller("site")
export class SiteController {
    constructor(
        private readonly siteService: SiteService,
    ) {}
    
    @Post()
    @UseGuards(IsLoggedInGuard)
    async create(@Body() createSiteDto: CreateSiteDto, @Req() req: express.Request): Promise<SuccessResponse<Site>> {
        return this.siteService.create(createSiteDto, req.user?.id);
    }
}