import { Controller, Put, Body, UseGuards, Req, Get, Query } from "@nestjs/common";
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
    
    @Get('change-email-request')
    @UseGuards(IsLoggedInGuard)
    async changeEmailRequest(@Req() req: express.Request){
        return await this.accountService.requestChangeEmail({newEmail: req.user?.email, name: req.user?.name})
    }


    @Put('change-email')
    @UseGuards(IsLoggedInGuard)
    async changeEmail(@Body('token') token: string, @Req() req: express.Request){
        return await this.accountService.changeEmail({token, email: req.user?.email})
    }
}