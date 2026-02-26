import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { JwtModule } from "@nestjs/jwt";
import { CommonModule } from "src/common/common.module";

@Module({
    imports: [
        JwtModule,
        CommonModule
    ],
    controllers: [UserController],
    providers: [UserService],
    exports: []
})


export class UserModule {}