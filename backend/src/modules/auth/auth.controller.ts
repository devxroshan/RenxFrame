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
import { AuthGuard } from '@nestjs/passport/dist/auth.guard';
import { ConfigService } from '@nestjs/config';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('signup')
  async signup(
    @Body() signupDto: AuthCreateDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const result = await this.authService.createUser(signupDto);
    return result;
  }

  @Get('login')
  async login(
    @Query() loginDto: AuthLoginDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const accessToken = await this.authService.loginUser(loginDto);
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
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
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const accessToken = await this.authService.googleLogin(
      req.user as { email: string; displayName: string; profilePicUrl: string },
    );

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') as string == 'production', // 🔥 true in production (https only)
      sameSite: 'lax',
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 28,
    });

    return res.redirect(
      this.configService.get('LOGGED_IN_FRONTEND_URL') as string,
    );
  }

  @Get('forgot-password')
  async forgotPassword(@Query('email') email: string){
    return await this.authService.forgotPassword(email);
  }

  @Put('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto){
    return await this.authService.resetPassword(resetPasswordDto);
  }
  
  @Get('is-logged-in')
  async isLoggedIn(@Query('token') token:string){
    return await this.authService.isLoggedIn(token)
  }
}
