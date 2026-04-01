import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AppConfigService } from 'src/config/app-config.service';
import { Prisma } from '@prisma/client';
import { JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt';
import mongoose from 'mongoose';
import { MongoServerError } from 'mongodb';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(private readonly appConfigService: AppConfigService) {}

  errorRes: {
    msg: string;
    code: string;
    status: number;
    details: {};
  } = { msg: 'Check terminal for more info.', code: 'INTERNAL_SERVER_ERROR', details: {}, status: 500 };

  catch(exception: any, host: ArgumentsHost) {
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      return this.handlePrismaError(exception, host);
    } else if (
      exception instanceof JsonWebTokenError ||
      exception instanceof TokenExpiredError
    ) {
      return this.handleJwtError(exception, host);
    } else if (exception instanceof HttpException) {
      return this.handleHTTPError(exception, host);
    } else if (
      exception instanceof MongoServerError ||
      exception instanceof mongoose.Error.ValidationError ||
      exception instanceof mongoose.Error.CastError
    ) {
      return this.handleMongoDBError(exception, host);
    } else {
      return this.handleUnknownError(exception, host);
    }
  }

  handlePrismaError(
    exception: Prisma.PrismaClientKnownRequestError,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    if (exception.code === 'P2002') {
      this.errorRes.msg = `${(exception as any).meta?.driverAdapterError?.cause?.originalMessage}. Please choose a different value.`;
      this.errorRes.code = 'CONFLICT';
      this.errorRes.status = HttpStatus.CONFLICT;
    } else if (exception.code === 'P2025') {
      this.errorRes.msg = `Record not found.`;
      this.errorRes.code = 'NOT_FOUND';
      this.errorRes.status = HttpStatus.NOT_FOUND;
    } else if (exception.code === 'P2003') {
      this.errorRes.msg = 'Internal Server Error. Try again later.';
      this.errorRes.code = 'INTERNAL_SERVER_ERROR';
      this.errorRes.status = HttpStatus.INTERNAL_SERVER_ERROR;
    } else {
      if (this.appConfigService.isProduction) {
        this.errorRes.msg = 'Internal Server Error. Try again later.';
        this.errorRes.code = 'INTERNAL_SERVER_ERROR';
        this.errorRes.status = HttpStatus.INTERNAL_SERVER_ERROR;
      } else {
        console.log(exception);
      }
    }

    res.status(this.errorRes.status).json({
      ok: false,
      code: this.errorRes.code,
      msg: this.errorRes.msg,
      status: this.errorRes.status,
      timestamp: new Date().toISOString(),
      path: ctx.getRequest<Request>().url,
      details: this.errorRes.details,
    });
  }

  handleJwtError(
    exception: JsonWebTokenError | TokenExpiredError,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    if (exception instanceof TokenExpiredError) {
      this.errorRes.code = 'UNAUTHORIZED';
      this.errorRes.status = HttpStatus.UNAUTHORIZED;
      this.errorRes.msg = 'Token expired.';
    } else if (exception instanceof JsonWebTokenError) {
      this.errorRes.code = 'UNAUTHORIZED';
      this.errorRes.status = HttpStatus.UNAUTHORIZED;
      this.errorRes.msg = 'Invalid token.';
    } else {
      if (this.appConfigService.isProduction) {
        this.errorRes.msg = 'Internal Server Error. Try again later.';
        this.errorRes.code = 'INTERNAL_SERVER_ERROR';
        this.errorRes.status = HttpStatus.INTERNAL_SERVER_ERROR;
      } else {
        console.log(exception);
      }
    }

    res.status(this.errorRes.status).json({
      ok: false,
      code: this.errorRes.code,
      status: this.errorRes.status,
      msg: this.errorRes.msg,
      timestamp: new Date().toISOString(),
      path: ctx.getRequest<Request>().url,
      details: this.errorRes.details,
    });
  }

  handleHTTPError(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    res.status(status).json({
      ok: false,
      code: exceptionResponse['code'] || exceptionResponse['error'],
      msg:
        exceptionResponse['msg'] ||
        exceptionResponse['message'] ||
        'An error occurred',
      timestamp: new Date().toISOString(),
      path: ctx.getRequest<Request>().url,
      details: exceptionResponse['details'] || {},
    });
  }

  handleMongoDBError(
    exception:
      | mongoose.Error.ValidationError
      | mongoose.Error.CastError
      | MongoServerError,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    if (exception instanceof MongoServerError && exception.code === 11000) {
      this.errorRes.code = 'CONFLICT';
      this.errorRes.status = HttpStatus.CONFLICT;
      const key = Object.keys(exception.keyValue)[0];

      this.errorRes.msg = `${key} ${exception.keyValue[key]} already exists.`;
      this.errorRes.details = {
        field: [key],
        value: [exception.keyValue[key]],
      };
    } else {
      if (this.appConfigService.isProduction) {
        this.errorRes.code = 'INTERNAL_SERVER_ERROR';
        this.errorRes.status = HttpStatus.INTERNAL_SERVER_ERROR;
        this.errorRes.msg = 'Internal Server Error. Try again later.';
      }else {
        console.log(exception)
      }
    }

    res.status(this.errorRes.status).json({
      ok: false,
      code: this.errorRes.code,
      msg: this.errorRes.msg,
      timestamp: new Date().toISOString(),
      path: ctx.getRequest<Request>().url,
      details: this.errorRes.details,
    });
  }

  handleUnknownError(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    if (!this.appConfigService.isProduction) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        ok: false,
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        msg: 'An unexpected error occurred',
        timestamp: new Date().toISOString(),
        path: ctx.getRequest<Request>().url,
        details: {},
      });

      console.log('Unknown exception:', exception);
      return;
    }

    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .redirect(`${this.appConfigService.FrontendUrl}/internal-server-error`);
  }
}
