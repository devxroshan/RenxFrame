import { Module } from "@nestjs/common";
import { SiteService } from "./site.service";
import { SiteController } from "./site.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Site, SiteSchema } from "./schema/site.schema";
import { CommonModule } from "src/common/common.module";
import { JwtModule } from "@nestjs/jwt";
import { IsValidMongooseObjectIdGuard } from "./guards/is-valid-objectId.guard";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Site.name, schema: SiteSchema }]),
        JwtModule,
        CommonModule
    ],
    controllers: [SiteController],
    providers: [SiteService, IsValidMongooseObjectIdGuard],
})
export class SiteModule {}