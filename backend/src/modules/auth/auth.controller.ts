import { Controller, Post, Put, Get, Body, Res, Param, Query, UseGuards, Req } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthCreateDto } from "./dto/auth-create.dto";
import { AuthLoginDto } from "./dto/auth-login.dto";
import * as express from 'express';
import { AuthGuard } from "@nestjs/passport/dist/auth.guard";
import { ConfigService } from "@nestjs/config";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService, private readonly configService: ConfigService) {}

    @Post('signup')
    async signup(@Body() signupDto: AuthCreateDto, @Res({passthrough: true}) res:express.Response) {
        const result = await this.authService.createUser(signupDto);
        return result;
    }

    @Get('login')
    async login(@Query() loginDto: AuthLoginDto, @Res({passthrough: true}) res:express.Response) {
        const accessToken = await this.authService.loginUser(loginDto);
        res.cookie('access_token', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 28 * 24 * 60 * 60 * 1000, // 7 days
        });
        return {
            ok: true,
            msg: "Login Successfully"
        };
    }

    @Get('verify-email')
    async verifyEmail(@Query('token') token: string) {
        return await this.authService.verifyEmail(token);
    }

    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth() {
        // This route will be handled by the GoogleStrategy
    }


    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleAuthCallback(@Req() req: express.Request, @Res({passthrough: true}) res:express.Response) {
        const accessToken = await this.authService.googleLogin(req.user as { email: string; displayName: string, profilePicUrl: string });
        res.cookie('access_token', accessToken, {
            httpOnly: true,
            secure: this.configService.get('NODE_ENV') === 'production',
            sameSite: this.configService.get('NODE_ENV') === 'production' ? 'none' : 'lax',
            maxAge: 28 * 24 * 60 * 60 * 1000, // 28 days
        });
        return {
            ok: true,
            msg: "Login Successfully"
        };
    }
}