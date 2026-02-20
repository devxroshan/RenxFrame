import { Module } from "@nestjs/common";
import { AccountService } from "./account.service";
import { AccountController } from "./account.controller";

@Module({
    imports: [],
    providers: [AccountService],
    controllers: [AccountController],
    exports: []
})

export class AccountModule {}