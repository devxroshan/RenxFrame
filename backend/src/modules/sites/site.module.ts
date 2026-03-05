import { Module } from "@nestjs/common";
import { SiteService } from "./site.service";
import { SiteController } from "./site.controller";
import { CommonModule } from "src/common/common.module";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports: [
        JwtModule,
        CommonModule
    ],
    controllers: [SiteController],
    providers: [SiteService],
})
export class SiteModule {}