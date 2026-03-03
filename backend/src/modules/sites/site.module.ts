import { Module } from "@nestjs/common";
import { SiteService } from "./site.service";
import { SiteController } from "./site.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Site, SiteSchema } from "./schema/site.schema";
import { CommonModule } from "src/common/common.module";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Site.name, schema: SiteSchema }]),
        JwtModule,
        CommonModule
    ],
    controllers: [SiteController],
    providers: [SiteService],
})
export class SiteModule {}