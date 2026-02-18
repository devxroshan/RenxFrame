import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { AllExceptionFilter } from './common/filters/AllExceptionFilter.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: [app.get(ConfigService).get('FRONTEND_URL') ?? 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,

      exceptionFactory: (errors) => {
        const details = errors.map((err) => ({
          field: err.property,
          errors: Object.values(err.constraints || {}),
        }));

        return new BadRequestException({
          msg: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details,
        });
      },
    }),
  );

  app.use(helmet());
  app.use(cookieParser());

  app.useGlobalFilters(new AllExceptionFilter(app.get(ConfigService)));

  
  await app.listen(app.get(ConfigService).get('PORT') ?? 8000);
}
bootstrap();