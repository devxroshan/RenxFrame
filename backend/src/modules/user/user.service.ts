import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/database/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { InternalServerErrorException, BadRequestException,NotFoundException } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  async isLoggedIn(token: string) {
    let decodedToken: { email: string };

    try {
      decodedToken = (await this.jwtService.verifyAsync(token)) as {
        email: string;
      };
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new BadRequestException({
          name: 'BadRequestException',
          msg: 'Reset Password token has expired. Please request a new Reset Password token.',
          code: 'TOKEN_EXPIRED',
        });
      }
      if (error.name === 'JsonWebTokenError') {
        throw new BadRequestException({
          name: 'BadRequestException',
          msg: 'Invalid Reset Password token. Please request a new Reset Password token.',
          code: 'INVALID_TOKEN',
        });
      }

      throw new InternalServerErrorException({
        name: 'InternaleServerError',
        code: 'INTERNAL_SERVER_ERROR',
        msg: 'Something went wrong. Try again later.',
      });
    }

    const user = await this.prismaService.user.findUnique({
      where: {
        email: decodedToken.email,
      },
    });

    if (!user) {
      throw new NotFoundException({
        name: 'NotFoundException',
        code: 'USER_NOT_FOUND',
        msg: 'Either not logged in or invalid token.',
      });
    }

    return {
      ok: true,
      msg: 'Logged In.',
    };
  }
}
