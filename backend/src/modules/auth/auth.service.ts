import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthCreateDto } from './dto/auth-create.dto';
import { AuthLoginDto } from './dto/auth-login.dto';
import { PrismaService } from 'src/common/database/prisma.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from 'src/common/services/email.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { AppConfigService } from 'src/config/app-config.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly appConfig: AppConfigService,
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
          secret: this.appConfig.JwtSecret,
          expiresIn: '2m',
        },
      );

      const verificationLink = `${this.appConfig.BackendUrl}/auth/verify-email?token=${verificationToken}`;

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
      throw error;
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
          secret: this.appConfig.JwtSecret,
          expiresIn: '2m',
        },
      );
      const verificationLink = `${this.appConfig.BackendUrl}/auth/verify-email?token=${verificationToken}`;

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
        secret: this.appConfig.JwtSecret,
        expiresIn: '28d',
        algorithm: 'HS512',
      },
    );

    return accessToken;
  }

  async verifyEmail(token: string) {
    try {
      const decoded = this.jwtService.verify(token, {
        secret: this.appConfig.JwtSecret,
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
      throw error;
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
      throw error;
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
        secret: this.appConfig.JwtSecret,
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
        secret: this.appConfig.JwtSecret,
        expiresIn: '5m',
        algorithm: 'HS512',
      },
    );

    const resetPasswordLink = `${this.appConfig.FrontendUrl}/reset-password?token=${resetPasswordToken}`;

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
        this.appConfig.SupportEmail,
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
        code: 'PASSWORD_IS_NOT_SAME_AS_NEW_PASSWORD',
        msg: 'Password and New Password should be exactly same.',
      });
    }

    const passwordHash = await argon2.hash(resetPasswordDto.confirmPassword);

    try {
      const decodedToken = await this.jwtService.verify(
        resetPasswordDto.token,
        {
          secret: this.appConfig.JwtSecret,
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
      throw error;
    }
  }
}
