import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSiteDto } from './dto/create-site.dto';
import { SuccessResponse } from 'src/type-declaration/response';
import { PrismaService } from 'src/common/database/prisma.service';
import { Site } from 'src/generated/prisma/client';

@Injectable()
export class SiteService {
  constructor(
    private readonly prismaService: PrismaService
  ) {}

  async create(
    createSiteDto: CreateSiteDto,
    userId: string,
  ): Promise<SuccessResponse<Site>> {
    try {
      const site = await this.prismaService.site.create({
        data: {
          ownerId: userId,
          ...createSiteDto
        }
      });
      return {
        ok: true,
        msg: 'Site created successfully.',
        data: site,
      };
    } catch (error) {
      throw error;
    }
  }

  async getSite(id: string): Promise<SuccessResponse<Site>> {
    const site: Site | null = await this.prismaService.site.findUnique({
      where: {
        id
      }
    })

    if (site == null) {
      throw new NotFoundException({
        code: 'SITE_NOT_FOUND',
        msg: 'Site not found.',
      });
    }

    return {
      ok: true,
      msg: 'Site fetched successfully.',
      data: site,
    };
  }

  async getAllSite(ownerId: string): Promise<SuccessResponse<Site[]>> {
    const site: Site[] = await this.prismaService.site.findMany({
      where: {
        ownerId
      }
    });

    if (site.length == 0) {
      return {
        ok:true,
        msg: 'No sites yet.',
        data: []
      }
    }

    return {
      ok: true,
      msg: 'Sites fetched successfully.',
      data: site,
    };
  }
}
