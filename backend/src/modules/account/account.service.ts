import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/database/prisma.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as argon2 from 'argon2';

@Injectable()
export class AccountService {
  constructor(private readonly prismaService: PrismaService) {}

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
}
