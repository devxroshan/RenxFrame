import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './common/database/prisma.module';
import { CommonModule } from './common/common.module';
import { UserModule } from './modules/user/user.module';
import { AppConfigModule } from './config/config.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60,
          limit: 100,
        }
      ]
    }),
    AuthModule,
    UserModule,
    PrismaModule,
    CommonModule,
    AppConfigModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'APP_GUARD',
      useClass: ThrottlerGuard,
    }
  ],
})
export class AppModule {}
