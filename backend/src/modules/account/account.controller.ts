import { Controller, Put, Body, UseGuards, Req } from "@nestjs/common";
import { AccountService } from "./account.service";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { IsLoggedInGuard } from "src/common/guards/is-logged-in.guard";
import * as express from 'express'


@Controller('account')
export class AccountController{
    constructor(
        private readonly accountService: AccountService
    ){}

    @Put('change-password')
    @UseGuards(IsLoggedInGuard)
    async changePassword(@Body() changePasswordDto: ChangePasswordDto, @Req() req: express.Request){
        return await this.accountService.changePassword(changePasswordDto, req.user?.email)
    }
}