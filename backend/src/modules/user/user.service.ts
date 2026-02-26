import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/database/prisma.service';
import { JwtService } from '@nestjs/jwt';
import {
  InternalServerErrorException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { ConfigService } from '@nestjs/config';
import { AppConfigService } from 'src/config/app-config.service';
import { EmailService } from 'src/common/services/email.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RequestChangeEmailDto } from './dto/request-change-email.dto';
import { ChangeEmailDto } from './dto/change-email.dto';


@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly appConfigService: AppConfigService,
    private readonly emailService: EmailService,
  ) {}

  async changePassword(
    changePasswordDto: ChangePasswordDto,
    userEmail: string,
  ) {
    if (changePasswordDto.newPassword !== changePasswordDto.confirmPassword) {
      throw new BadRequestException({
        code: 'NEW_PASSWORD_IS_NOT_CONFIRM_PASSWORD',
        msg: 'New Password and Confirm Password should be exactly same.',
      });
    }

    const passwordHash = await argon2.hash(changePasswordDto.confirmPassword);

    try {
      await this.prismaService.user.update({
        where: {
          email: userEmail,
        },
        data: {
          password: passwordHash,
        },
      });

      return {
        ok: true,
        msg: 'Password changed successfully.',
      };
    } catch (error) {
      if (error.code == 'P2025') {
        throw new NotFoundException({
          code: 'USER_NOT_FOUND',
          msg: 'User not found.',
        });
      }
      throw error;
    }
  }

  async requestChangeEmail({ newEmail, name, email }: RequestChangeEmailDto) {
    try {
      const changeEmailToken = await this.jwtService.signAsync(
        { newEmail, email },
        {
          expiresIn: '10m',
          algorithm: 'HS256',
          secret: this.appConfigService.JwtSecret,
        },
      );

      await this.emailService.sendEmail(
        newEmail,
        'Change Email Confirmation',
        './change-email-confirmation',
        {
          name,
          year: new Date().getFullYear(),
          confirmLink: `${this.appConfigService.LoggedInFrontendUrl}/settings/security/change-email?token=${changeEmailToken}`,
        },
      );

      return {
        ok: true,
        msg: 'Change email confirmation sent successfully.',
      };
    } catch (error) {
      throw error;
    }
  }

  async changeEmail({ token }: ChangeEmailDto) {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.appConfigService.JwtSecret,
      });

      await this.prismaService.user.update({
        where: {
          email: payload.email,
        },
        data: {
          email: payload.newEmail,
        },
      });

      return {
        ok: true,
        msg: 'Email changed successfully.',
      };
    } catch (error) {
      throw error;
    }
  }

  async getUserInfo(userEmail: string) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          email: userEmail,
        },
        select: {
          id: true,
          email: true,
          name: true,
          profilePicUrl:true,
        },
      });

      return {
        ok: true,
        msg: 'User info retrieved successfully.',
        data: user,
      };
    } catch (error) {
      throw error;
    }
  }

  async changeName(name: string, userEmail: string) {
    try {
      const updatedUser = await this.prismaService.user.update({
        where: {
          email: userEmail,
        },
        data: {
          name
        },
      });

      return {
        ok: true,
        msg: 'Profile updated successfully.',
        data: updatedUser,
      };
    } catch (error) {
      throw error;
    }
  }
}
