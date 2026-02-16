import { ArgumentsHost, Catch, HttpException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Catch()
export class AllExceptionFilter {
    constructor(private readonly configService: ConfigService) {}

    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        const errorResponse = exception.getResponse();
        const status = exception.getStatus();

        const error = errorResponse as {
            name?: string;
            msg?: string;
            code?: string;
            details?: any;
        }

        if (error.code == 'INTERNAL_SERVER_ERROR' && this.configService.get('NODE_ENV') !== 'production') {
            response.status(status).json({
                ...error,
                timestamp: new Date().toISOString(),
                path: request.url,
            });
        } else {
            response.status(status).json({
                ok: false,
                name: error.name || 'InternalServerError',
                code: error.code || 'INTERNAL_SERVER_ERROR',
                msg: error.msg || 'Something went wrong. Try again later.',
                timestamp: new Date().toISOString(),
                path: request.url,
                details: error.details || {},
            });
        }
    }
}