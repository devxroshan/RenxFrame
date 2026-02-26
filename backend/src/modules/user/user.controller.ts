import { Controller, Get, Query, Req, Put, Body, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import * as express from 'express';
import { IsLoggedInGuard } from 'src/common/guards/is-logged-in.guard';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Put('change-password')
  @UseGuards(IsLoggedInGuard)
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req: express.Request,
  ) {
    return await this.userService.changePassword(
      changePasswordDto,
      req.user?.email,
    );
  }

  @Get('change-email-request')
  @UseGuards(IsLoggedInGuard)
  async changeEmailRequest(@Query('newEmail') newEmail: string, @Req() req: express.Request) {
    return await this.userService.requestChangeEmail({
      newEmail,
      name: req.user?.name,
      email: req.user?.email,
    });
  }

  @Put('change-email')
  @UseGuards(IsLoggedInGuard)
  async changeEmail(@Body('token') token: string) {
    return await this.userService.changeEmail({
      token
    });
  }

  @Put('change-name')
  @UseGuards(IsLoggedInGuard)
  async changeName(@Body('name') name: string, @Req() req: express.Request) {
    return await this.userService.changeName(name, req.user?.email);
  }

  @Get('me')
  @UseGuards(IsLoggedInGuard)
  async getMe(@Req() req: express.Request) {
    return await this.userService.getUserInfo(req.user?.email);
  }
}
