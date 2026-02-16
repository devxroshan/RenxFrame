import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthCreateDto } from './dto/auth-create.dto';
import { AuthLoginDto } from './dto/auth-login.dto';
import { PrismaService } from 'src/common/database/prisma.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(userDto: AuthCreateDto) {
    const hashedPassword = await argon2.hash(userDto.password);

    try {
      await this.prismaService.user.create({
        data: {
          name: userDto.name,
          email: userDto.email,
          password: hashedPassword,
        },
      });

      const accessToken = this.jwtService.sign(
        { email: userDto.email },
        { secret: this.configService.get<string>('JWT_SECRET') },
      );

      return accessToken;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException({
          name: 'ConflictException',
          msg: 'Email already exists',
          code: 'EMAIL_ALREADY_EXISTS',
          details: {
            field: 'email',
            value: userDto.email,
          },
        });
      }
      throw new InternalServerErrorException({
        ok: false,
        name: 'InternalServerError',
        msg: 'Failed to create user',
        code: 'FAILED_TO_CREATE_USER',
      });
    }
  }

  async loginUser(loginDto: AuthLoginDto) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          email: loginDto.email,
        },
      });

      if (!user) {
        throw new BadRequestException({
          name: 'BadRequestException',
          msg: 'Invalid email or password',
          code: 'INVALID_CREDENTIALS',
        });
      }

      if(user.isGoogleUser || !user.password) {
        throw new BadRequestException({
          name: 'BadRequestException',
          msg: 'Please login with Google',
          code: 'GOOGLE_USER',
        });
      }

      const isPasswordValid = await argon2.verify(
        user?.password,
        loginDto.password,
      );

      if (!isPasswordValid) {
        throw new BadRequestException({
          name: 'BadRequestException',
          msg: 'Invalid email or password',
          code: 'INVALID_CREDENTIALS',
        });
      }

      const accessToken = this.jwtService.sign(
        { email: user.email },
        { secret: this.configService.get<string>('JWT_SECRET') },
      );

      return accessToken;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException({
        name: 'InternalServerError',
        msg: 'Failed to login',
        code: 'FAILED_TO_LOGIN',
      });
    }
  }

  async googleLogin(user: { email: string; displayName: string, profilePicUrl: string }) {
    try {
      const existingUser = await this.prismaService.user.findUnique({
        where: {
          email: user.email,
        },
      });

      if (!existingUser) {
        await this.prismaService.user.create({
          data: {
            name: user.displayName,
            email: user.email,
            profilePicUrl: user.profilePicUrl,
            isGoogleUser: true,
          },
        });
      }

      const accessToken = this.jwtService.sign(
        { email: user.email },
        { secret: this.configService.get<string>('JWT_SECRET') },
      );

      return accessToken;
    } catch (error) {
      throw error;
    }
  }
}
