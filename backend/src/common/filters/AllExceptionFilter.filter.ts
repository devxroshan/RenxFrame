import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response, Request } from 'express';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(private readonly configService: ConfigService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let error: any = {
      name: 'InternalServerError',
      msg: 'Something went wrong. Try again later.',
      code: 'INTERNAL_SERVER_ERROR',
      details: {},
    };

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const errorResponse = exception.getResponse();

      if (typeof errorResponse === 'string') {
        error.msg = errorResponse;
      } else {
        error = { ...error, ...errorResponse };
      }
    } else {
      if(this.configService.get<string>('NODE_ENV') === 'production'){
        response.status(500).redirect(this.configService.get<string>('FRONTEND_INTERNAL_SERVER_ERROR_PAGE') as string)
        return;
      }
      console.error('Unexpected Error:', exception);
    }

    if (
      error.code === 'INTERNAL_SERVER_ERROR' &&
      this.configService.get('NODE_ENV') !== 'production'
    ) {
      response.status(status).json({
        ...error,
        raw: exception, // only visible in dev
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    } else {
      response.status(status).json({
        ok: false,
        name: error.name,
        code: error.code,
        msg: error.msg,
        timestamp: new Date().toISOString(),
        path: request.url,
        details: error.details ?? {},
      });
    }
  }
}