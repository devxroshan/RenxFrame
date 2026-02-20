import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './common/database/prisma.module';
import { CommonModule } from './common/common.module';
import { JWTCoreModule } from './core-modules/jwt.module';
import { AccountModule } from './modules/account/account.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    AccountModule,
    PrismaModule,
    JWTCoreModule,
    CommonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
