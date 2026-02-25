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
  async sendForgotPasswordEmail(email: string, name:string, resetLink:string, expiryTime:string, supportEmail: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Forgot Password',
        template: './forgot-password',
        context: {
          name,
          resetLink,
          expiryTime,
          supportEmail 
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async sendEmail(email: string, subject: string, template: string, ctx: any) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: subject,
        template: template,
        context: {
          ...ctx
        },
      });
    } catch (error) {
      throw error;
    }
  }
}
