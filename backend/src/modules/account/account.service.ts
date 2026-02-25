import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/database/prisma.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as argon2 from 'argon2';
import { AppConfigService } from 'src/config/app-config.service';
import { EmailService } from 'src/common/services/email.service';
import { ChangeEmailDto } from './dto/change-email.dto';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import { RequestChangeEmailDto } from './dto/request-change-email.dto';

@Injectable()
export class AccountService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly appConfigService: AppConfigService,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
  ) {}

  async changePassword(
    changePasswordDto: ChangePasswordDto,
    userEmail: string,
  ) {
    if (changePasswordDto.newPassword !== changePasswordDto.confirmPassword) {
      throw new BadRequestException({
        name: 'BadRequestException',
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
          name: 'NotFoundException',
          code: 'USER_NOT_FOUND',
          msg: 'User not found.',
        });
      }
      throw error;
    }
  }

  async requestChangeEmail({newEmail, name}: RequestChangeEmailDto) {
    try {
      const changeEmailToken = await this.jwtService.signAsync(
        { newEmail },
        { expiresIn: '10m', algorithm: 'HS256', secret: this.appConfigService.JwtSecret },
      );

      await this.emailService.sendEmail(newEmail, 'Change Email Confirmation', './change-email-confirmation', {
        name,
        year: new Date().getFullYear(),
        confirmLink: `${this.appConfigService.LoggedInFrontendUrl}/settings/account/change-email?token=${changeEmailToken}`,
      });

      return {
        ok: true,
        msg: 'Change email confirmation sent successfully.',
      }
    } catch (error) {
      throw error;
    }
  }

  async changeEmail({token, email}: ChangeEmailDto) {
    try {
      const payload = await this.jwtService.verifyAsync(token, { secret: this.appConfigService.JwtSecret });

      await this.prismaService.user.update({
        where: {
          email, 
        },
        data: {
          email: payload.newEmail,
        },
      });

      return {
        ok: true,
        msg: 'Email changed successfully.',
      }
    } catch (error) {
      throw error;
    }
  }
}
