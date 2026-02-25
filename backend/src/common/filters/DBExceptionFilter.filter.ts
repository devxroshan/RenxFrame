import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { AppConfigService } from 'src/config/app-config.service';

@Catch()
export class DBExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly appConfigService: AppConfigService
  ){}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    if (exception.code === 'P2002') {
      const target = exception?.meta?.target ?? [];
      const field = Array.isArray(target) ? target.join(',') : 'unknown';

      return response.status(400).json({
        ok: false,
        name: 'BadRequestException',
        code: 'DUPLICATE_VALUE',
        msg: `A record with the same value for the unique field(s) already exists: ${field}.`,
        details: {
          target: exception?.meta?.target,
        },
      });
    } else if (exception.code === 'P2025') {
      const cause = exception?.meta?.cause ?? 'Record not found';
      const model = exception?.meta?.modelName ?? 'unknown';

      return response.status(404).json({
        ok: false,
        name: 'NotFoundException',
        code: 'RECORD_NOT_FOUND',
        msg: 'The record does not exist.',
        details: this.appConfigService.isProduction ? {
          cause,
        }:{
          cause,
          model
        }
      });
    }
    throw exception; // rethrow if it's not a known Prisma error
  }
}
