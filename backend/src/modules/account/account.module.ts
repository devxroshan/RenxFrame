import { Module } from "@nestjs/common";
import { AccountService } from "./account.service";
import { AccountController } from "./account.controller";
import { JwtModule } from "@nestjs/jwt";
import { CommonModule } from "src/common/common.module";

@Module({
    imports: [JwtModule, CommonModule],
    providers: [AccountService],
    controllers: [AccountController],
    exports: []
})

export class AccountModule {}