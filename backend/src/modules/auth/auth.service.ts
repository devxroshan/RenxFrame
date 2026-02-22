import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthCreateDto } from './dto/auth-create.dto';
import { AuthLoginDto } from './dto/auth-login.dto';
import { PrismaService } from 'src/common/database/prisma.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from 'src/common/services/email.service';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async createUser(userDto: AuthCreateDto) {
    const hashedPassword = await argon2.hash(userDto.password);

    try {
      const user = await this.prismaService.user.create({
        data: {
          name: userDto.name,
          email: userDto.email,
          password: hashedPassword,
        },
      });

      await this.emailService.sendWelcomeEmail(user.email, user.name);

      const verificationToken = this.jwtService.sign(
        { email: user.email },
        {
          secret: this.configService.get<string>('JWT_SECRET'),
          expiresIn: '2m',
        },
      );

      const verificationLink = `${this.configService.get<string>('BACKEND_URL')}/auth/verify-email?token=${verificationToken}`;

      await this.emailService.sendVerificationEmail(
        user.name,
        verificationLink,
        user.email,
        '2 minutes',
      );

      return {
        ok: true,
        msg: 'User created successfully. Please check your email for verification.',
      };
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
        details:
          this.configService.get('NODE_ENV') === 'development' ? { error } : {},
      });
    }
  }

  async loginUser(loginDto: AuthLoginDto) {
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

    if (!user.password) {
      throw new BadRequestException({
        name: 'BadRequestException',
        msg: "You had Signed Up with Google so you don't have any password right now, Please login with Google or You can just forgot password to reset your password.",
        code: 'GOOGLE_USER',
      });
    }

    if (!user.isVerified) {
      const verificationToken = this.jwtService.sign(
        { email: user.email },
        {
          secret: this.configService.get<string>('JWT_SECRET'),
          expiresIn: '2m',
        },
      );
      const verificationLink = `${this.configService.get<string>('BACKEND_URL')}/auth/verify-email?token=${verificationToken}`;

      await this.emailService.sendVerificationEmail(
        user.name,
        verificationLink,
        user.email,
        '2 minutes',
      );

      throw new UnauthorizedException({
        name: 'UnauthorizedException',
        msg: 'Please verify your email before logging in. Sent you a verification email.',
        code: 'EMAIL_NOT_VERIFIED',
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
      {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '28d',
        algorithm: 'HS512',
      },
    );

    return accessToken;
  }

  async verifyEmail(token: string) {
    try {
      const decoded = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      await this.prismaService.user.update({
        where: {
          email: decoded.email,
          isVerified: false,
        },
        data: {
          isVerified: true,
        },
      });
      return {
        ok: true,
        msg: 'Email verified successfully',
      };
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new BadRequestException({
          name: 'BadRequestException',
          msg: 'Verification token has expired. Please request a new verification email.',
          code: 'TOKEN_EXPIRED',
        });
      }
      if (error.name === 'JsonWebTokenError') {
        throw new BadRequestException({
          name: 'BadRequestException',
          msg: 'Invalid verification token. Please request a new verification email.',
          code: 'INVALID_TOKEN',
        });
      }
      throw new InternalServerErrorException({
        ok: false,
        name: 'InternalServerError',
        msg: 'Failed to verify email',
        code: 'FAILED_TO_VERIFY_EMAIL',
        details: error,
      });
    }
  }

  async googleLogin(user: {
    email: string;
    name: string;
    profilePicUrl: string;
  }) {
    let existingUser = await this.prismaService.user.findUnique({
      where: {
        email: user.email,
      },
    });

    try {
      if (!existingUser) {
        existingUser = await this.prismaService.user.create({
          data: {
            name: user.name,
            email: user.email,
            profilePicUrl: user.profilePicUrl,
            isGoogleUser: true,
            isVerified: true,
          },
        });
      }
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException({
          name: 'ConflictException',
          msg: 'Email already exists',
          code: 'EMAIL_ALREADY_EXISTS',
          details: {
            field: 'email',
            value: user.email,
          },
        });
      }

      throw new InternalServerErrorException({
        ok: false,
        name: 'InternalServerError',
        msg: 'Failed to create Google user',
        code: 'FAILED_TO_CREATE_GOOGLE_USER',
      });
    }

    if (!existingUser.isGoogleUser) {
      existingUser = await this.prismaService.user.update({
        where: {
          email: user.email,
        },
        data: {
          isGoogleUser: true,
        },
      });
    }

    if (!existingUser.isVerified) {
      existingUser = await this.prismaService.user.update({
        where: {
          email: user.email,
        },
        data: {
          isVerified: true,
        },
      });
    }

    const accessToken = this.jwtService.sign(
      { email: user.email },
      {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '28d',
        algorithm: 'HS512',
      },
    );

    return accessToken;
  }

  async forgotPassword(email: string) {
    const resetPasswordToken = this.jwtService.sign(
      { email },
      {
        secret: this.configService.get<string>('JWT_SECRET') as string,
        expiresIn: '5m',
        algorithm: 'HS512',
      },
    );

    const resetPasswordLink = `${this.configService.get('FRONTEND_URL')}/reset-password?token=${resetPasswordToken}`;

    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new NotFoundException({
        name: 'NotFoundException',
        code: 'USER_NOT_FOUND',
        msg: 'User not found. Invalid email',
      });
    }

    try {
      await this.emailService.sendForgotPasswordEmail(
        email,
        user.name,
        resetPasswordLink,
        '5 minutes',
        this.configService.get('SUPPORT_EMAIL') as string,
      );
      return {
        ok: true,
        msg: 'Reset Password link sent to your email. Check your inbox or spam folder.',
      };
    } catch (error) {
      throw error;
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    if (resetPasswordDto.password !== resetPasswordDto.confirmPassword) {
      throw new BadRequestException({
        name: 'BadRequestException',
        code: 'PASSWORD_IS_NOT_NEW_PASSWORD',
        msg: 'Password and New Password should be exactly',
      });
    }

    const passwordHash = await argon2.hash(resetPasswordDto.confirmPassword);

    try {
      const decodedToken = await this.jwtService.verify(
        resetPasswordDto.token,
        {
          secret: this.configService.get<string>('JWT_SECRET') as string,
        },
      );

      await this.prismaService.user.update({
        where: {
          email: decodedToken.email,
        },
        data: {
          password: passwordHash,
        },
      });

      return {
        ok: true,
        msg: 'Password reset successfully.',
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

      if (error.code === 'P2025') {
        throw new NotFoundException({
          name: 'NotFoundException',
          code: 'USER_NOT_FOUND',
          msg: 'User not found. Password reset failed.',
        });
      }

      throw new InternalServerErrorException({
        name: 'InternaleServerError',
        code: 'INTERNAL_SERVER_ERROR',
        msg: 'Something went wrong. Try again later.',
      });
    }
  }
}
