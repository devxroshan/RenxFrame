import {
  Controller,
  Post,
  Put,
  Get,
  Body,
  Res,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCreateDto } from './dto/auth-create.dto';
import { AuthLoginDto } from './dto/auth-login.dto';
import * as express from 'express';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { AppConfigService } from 'src/config/app-config.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly appConfig:AppConfigService,
  ) {}

  @Post('signup')
  async signup(
    @Body() signupDto: AuthCreateDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const result = await this.authService.createUser(signupDto);
    return result;
  }

  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 300 } })
  async login(
    @Body() loginDto: AuthLoginDto,
    @Res() res: express.Response,
  ) {
    const accessToken = await this.authService.loginUser(loginDto);
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: this.appConfig.isProduction,
      sameSite: 'lax',
      domain: `.${this.appConfig.Host}`,
      path: '/',
      maxAge: 28 * 24 * 60 * 60 * 1000,
    });
    return {
      ok: true,
      msg: 'Login Successfully',
    };
  }

  @Get('verify-email')
  async verifyEmail(@Query('token') token: string) {
    return await this.authService.verifyEmail(token);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(
    @Req() req: express.Request,
    @Res() res: express.Response,
  ) {
    const accessToken = await this.authService.googleLogin(
      req.user as { email: string; name: string; profilePicUrl: string },
    );

    if (!this.appConfig.isProduction) {
      res.redirect(`${this.appConfig.FrontendUrl}?access_token=${accessToken}`)
      return;
    }
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: this.appConfig.isProduction,
      sameSite: 'lax',
      domain: `.${this.appConfig.Host}`,
      path: '/',
      maxAge: 28 * 24 * 60 * 60 * 1000,
    });
    return res.redirect(
      this.appConfig.LoggedInFrontendUrl
    )
  }

  @Post('forgot-password')
  @Throttle({ default: { limit: 3, ttl: 300 } })
  async forgotPassword(@Body('email') email: string) {
    return await this.authService.forgotPassword(email);
  }

  @Put('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return await this.authService.resetPassword(resetPasswordDto);
  }
}
