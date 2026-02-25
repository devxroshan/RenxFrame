import { Module } from '@nestjs/common';
import { IsLoggedInGuard } from './guards/is-logged-in.guard';
import { JwtModule } from '@nestjs/jwt';
import { EmailService } from './services/email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import path from 'path';
import { ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { JwtExceptionFilter } from './filters/JwtExceptionFilter.filter';
import { DBExceptionFilter } from './filters/DBExceptionFilter.filter';
import { AllExceptionFilter } from './filters/AllExceptionFilter.filter';

@Module({
  imports: [
    JwtModule,
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          auth: {
            user: configService.get<string>('EMAIL_USER'),
            pass: configService.get<string>('EMAIL_PASS'),
          },
        },
        template: {
          dir: path.join(__dirname, '../../../', 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  controllers: [],
  providers: [
    IsLoggedInGuard,
    EmailService,
    { provide: APP_FILTER, useClass: JwtExceptionFilter },
    { provide: APP_FILTER, useClass: DBExceptionFilter },
    { provide: APP_FILTER, useClass: AllExceptionFilter },
  ],
  exports: [IsLoggedInGuard, EmailService],
})
export class CommonModule {}
