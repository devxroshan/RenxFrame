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
    }
    else if(exception instanceof MongoServerError || exception instanceof mongoose.Error.ValidationError || exception instanceof mongoose.Error.CastError){
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
      res.status(HttpStatus.CONFLICT).json({
        ok: false,
        code: HttpStatus.CONFLICT,
        msg: `${(exception as any).meta?.driverAdapterError?.cause?.originalMessage}. Please choose a different value.`,
        timestamp: new Date().toISOString(),
        path: ctx.getRequest<Request>().url,
        details: {},
      });
    } else if (exception.code === '2025') {
      res.status(HttpStatus.NOT_FOUND).json({
        ok: false,
        code: HttpStatus.NOT_FOUND,
        msg: 'Record not found',
        timestamp: new Date().toISOString(),
        path: ctx.getRequest<Request>().url,
        details: {},
      });
    }
  }

  handleJwtError(
    exception: JsonWebTokenError | TokenExpiredError,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    if (exception instanceof TokenExpiredError) {
      res.status(HttpStatus.UNAUTHORIZED).json({
        ok: false,
        code: HttpStatus.UNAUTHORIZED,
        msg: 'Token expired',
        timestamp: new Date().toISOString(),
        path: ctx.getRequest<Request>().url,
        details: {},
      });
    } else if (exception instanceof JsonWebTokenError) {
      res.status(HttpStatus.UNAUTHORIZED).json({
        ok: false,
        code: HttpStatus.UNAUTHORIZED,
        msg: 'Invalid token',
        timestamp: new Date().toISOString(),
        path: ctx.getRequest<Request>().url,
        details: {},
      });
    }
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

    let errorRes:{code:HttpStatus, msg: string,details: {}} = {
      code: HttpStatus.INTERNAL_SERVER_ERROR,
      msg: "Internal Server Error.",
      details: {}
    }

    if (exception instanceof MongoServerError && exception.code === 11000) {
      errorRes.code = HttpStatus.CONFLICT;
      const key = Object.keys(exception.keyValue)[0]

      errorRes.msg = `${key} ${exception.keyValue[key]} already exits.`
      errorRes.details = {
        field: [key],
        value: [exception.keyValue[key]]
      }
    }

    res.status(errorRes.code).json({
      ok: false,
      code: errorRes.code,
      msg: errorRes.msg,
      timestamp: new Date().toISOString(),
      path: ctx.getRequest<Request>().url,
      details: errorRes.details,
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

      console.error('Unknown exception:', exception);
      return;
    }

    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .redirect(`${this.appConfigService.FrontendUrl}/internal-server-error`);
  }
}
