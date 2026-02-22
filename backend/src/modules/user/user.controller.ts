import { Controller, Get, Query } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('is-logged-in')
  async isLoggedIn(@Query('token') token: string) {
    return await this.userService.isLoggedIn(token);
  }
}
