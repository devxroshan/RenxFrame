import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Site } from "./schema/site.schema";
import { Model } from "mongoose";
import { CreateSiteDto } from "./dto/create-site.dto";
import { SuccessResponse } from "src/type-declaration/response";

@Injectable()
export class SiteService {
    constructor(
        @InjectModel(Site.name) private readonly siteModel: Model<Site>,
    ) {}

    async create(createSiteDto: CreateSiteDto, psUserId: string): Promise<SuccessResponse<Site>> {
        const site = await this.siteModel.create({
            ...createSiteDto,
            owner: psUserId
        });
        return {
            ok: true,
            msg: 'Site created successfully',
            data: site,
        };
    }
}