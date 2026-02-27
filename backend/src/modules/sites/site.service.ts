import { Injectable, NotFoundException } from "@nestjs/common";
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

    async getSite(id: string):Promise<SuccessResponse<Site>>{
        const site:Site | null = await this.siteModel.findById(id)

        if(site == null){
            throw new NotFoundException({
                code: 'SITE_NOT_FOUND',
                msg: 'Site not found.'
            })
        }

        return {
            ok: true,
            msg: "Site fetched successfully.",
            data: site
        }
    }

    async getAllSite(owner: string):Promise<SuccessResponse<Site[]>>{
        const site:Site[] = await this.siteModel.find({
            owner
        })

        if(site.length == 0){
            throw new NotFoundException({
                code: 'SITE_NOT_FOUND',
                msg: 'Site not found.'
            })
        }

        return {
            ok: true,
            msg: "Sites fetched successfully.",
            data: site
        }
    }
}