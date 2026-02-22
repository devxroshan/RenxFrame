import { Controller, Get, Query, Req } from '@nestjs/common';
import { UserService } from './user.service';
import * as express from 'express'


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('is-logged-in')
  async isLoggedIn(@Req() req: express.Request) {
    return await this.userService.isLoggedIn(req.cookies.access_token);
  }
}
