import { Controller, Post, Put, Get, Body } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthCreateDto } from "./dto/auth-create.dto";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('signup')
    async signup(@Body() signupDto: AuthCreateDto) {
        return this.authService.createUser(signupDto);
    }
}