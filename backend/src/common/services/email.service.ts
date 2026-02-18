import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class EmailService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  async sendWelcomeEmail(email: string, name: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Welcome aboard 🎉',
        template: './welcome-email',
        context: {
          name,
          dashboardUrl: `${this.configService.get('FRONTEND_URL')}/dashboard`,
          year: new Date().getFullYear(),
        },
      });
    } catch (error) {
      throw error;
    }
  }
  async sendVerificationEmail(name:string, verificationLink:string, email:string, expiryTime:string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Verify your email address',
        template: './email-verification',
        context: {
          name,
          appName: 'RenxFrame',
          verificationLink: verificationLink,
          expiryTime: expiryTime,
          year: new Date().getFullYear(),
        },
      });
    } catch (error) {
      throw error;
    }
  }
}
