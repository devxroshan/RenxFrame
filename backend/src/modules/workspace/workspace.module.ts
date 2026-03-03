import { Module } from "@nestjs/common";
import { WorkspaceController } from "./workspace.controller";
import { WorkspaceService } from "./workspace.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Workspace, WorkspaceSchema } from "./schema/workspace.schema";
import { CommonModule } from "src/common/common.module";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports: [
        MongooseModule.forFeature([{name: Workspace.name, schema: WorkspaceSchema}]),
        CommonModule,
        JwtModule
    ],
    controllers: [WorkspaceController],
    providers: [WorkspaceService],
    exports: [MongooseModule]
})
export class WorkspaceModule {}