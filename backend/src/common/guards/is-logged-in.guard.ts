import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../database/prisma.service';
import { JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt';

export class IsLoggedInGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const token = request.cookies?.access_token;
      if (!token) {
        throw new BadRequestException({
          name: 'Unauthorized',
          code: 'NO_TOKEN',
          msg: 'You are not logged in.',
        });
      }
      const decoded = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      const user = await this.prismaService.user.findUnique({
        where: {
          email: decoded.email,
        },
        select: {
          name: true,
          email: true,
          isVerified: true,
          isGoogleUser: true,
          profilePicUrl: true,
        },
      });

      if (!user) {
        throw new NotFoundException({
          name: 'NotFoundException',
          code: 'USER_NOT_FOUND',
          msg: 'User not found. Invalid token or not logged in.',
        });
      }

      request.user = user
      return true;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new BadRequestException({
          name: 'TokenExpiredError',
          msg: 'Your session has expired. Please log in again.',
          code: 'TOKEN_EXPIRED',
        });
      }

      if (error instanceof JsonWebTokenError) {
        throw new BadRequestException({
          name: 'JsonWebTokenError',
          msg: 'Invalid token. Please log in again.',
          code: 'INVALID_TOKEN',
        });
      }
      throw error;
    }
  }
}
