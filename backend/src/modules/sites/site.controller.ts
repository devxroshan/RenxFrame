import { Controller, Post, Body, UseGuards, Req, Param, Get } from "@nestjs/common";
import { SiteService } from "./site.service";
import { CreateSiteDto } from "./dto/create-site.dto";
import { IsLoggedInGuard } from "src/common/guards/is-logged-in.guard";
import { Site } from "./schema/site.schema";
import { SuccessResponse } from "src/type-declaration/response";
import * as express from 'express';
import { IsValidMongooseObjectIdGuard } from "./guards/is-valid-objectId.guard";

@UseGuards(IsLoggedInGuard)
@Controller("site")
export class SiteController {
    constructor(
        private readonly siteService: SiteService,
    ) {}
    
    @Post()
    async create(@Body() createSiteDto: CreateSiteDto, @Req() req: express.Request): Promise<SuccessResponse<Site>> {
        return this.siteService.create(createSiteDto, req.user?.id);
    }


    @Get(':site_id')
    @UseGuards(IsValidMongooseObjectIdGuard)
    async getSite(@Param('site_id') id:string): Promise<SuccessResponse<Site>> {
        return this.siteService.getSite(id);
    }


    @Get()
    async getAllSite(@Req() req:express.Request): Promise<SuccessResponse<Site[]>> {
        return this.siteService.getAllSite(req.user.id);
    }
}