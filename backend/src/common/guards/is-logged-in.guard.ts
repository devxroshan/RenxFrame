import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

export class IsLoggedInGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    try {
      const request = context.switchToHttp().getRequest();
      const token = request.cookies?.access_token;
      if (!token) {
        return false;
      }
      const decoded = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      request.decodedToken = decoded as {
        email: string;
      };
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new BadRequestException({
          name: 'TokenExpiredError',
          msg: 'Your session has expired. Please log in again.',
          code: 'TOKEN_EXPIRED',
        });
      }

      if (error.name === 'JsonWebTokenError') {
        throw new BadRequestException({
          name: 'JsonWebTokenError',
          msg: 'Invalid token. Please log in again.',
          code: 'INVALID_TOKEN',
        });
      }
      throw error;
    }
    return true;
  }
}
