import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt';

@Catch()
export class JwtExceptionFilter implements ExceptionFilter {
  catch(exception: JsonWebTokenError | TokenExpiredError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    if (exception instanceof JsonWebTokenError) {
      return response.status(401).json({
        ok: false,
        name: 'UnauthorizedException',
        code: 'INVALID_TOKEN',
        msg: 'The token is invalid.',
      });
    }

    return response.status(401).json({
      ok: false,
      name: 'UnauthorizedException',
      code: 'TOKEN_EXPIRED',
      msg: 'The token has expired.',
    });
  }
}
