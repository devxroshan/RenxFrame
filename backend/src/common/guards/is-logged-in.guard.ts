import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../database/prisma.service';
import { AppConfigService } from 'src/config/app-config.service';

@Injectable()
export class IsLoggedInGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
    private readonly appConfigService: AppConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const token = request.cookies?.access_token;
      if (!token) {
        throw new BadRequestException({
          code: 'NO_TOKEN',
          msg: 'You are not logged in.',
        });
      }
      const decoded = await this.jwtService.verify(token, {
        secret: this.appConfigService.JwtSecret,
      });

      const user = await this.prismaService.user.findUnique({
        where: {
          email: decoded.email,
        },
        select: {
          id: true,
          name: true,
          email: true,
          isVerified: true,
          isGoogleUser: true,
          profilePicUrl: true,
        },
      });

      if (!user) {
        throw new NotFoundException({
          code: 'USER_NOT_FOUND',
          msg: 'User not found. Invalid token or not logged in.',
        });
      }

      request.user = user
      return true;
    } catch (error) {
      throw error;
    }
  }
}
