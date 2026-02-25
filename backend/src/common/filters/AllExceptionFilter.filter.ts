import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AppConfigService } from 'src/config/app-config.service';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(private readonly appConfigService: AppConfigService) {}

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
      if(this.appConfigService.isProduction) {
        response.status(500).redirect(this.appConfigService.FrontendInternalServerErrorPage)
        return;
      }
      console.error('Unexpected Error:', exception);
    }

    if (
      error.code === 'INTERNAL_SERVER_ERROR' &&
      !this.appConfigService.isProduction
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