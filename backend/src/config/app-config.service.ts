import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AppConfigService {
    constructor(
        private readonly configService: ConfigService
    ){}

    get Port(): number {
        return parseInt(this.configService.get<string>('PORT') as string);
    }

    get FrontendUrl(): string {
        return this.configService.get<string>('FRONTEND_URL') as string;
    }

    get DatabaseUrl(): string {
        return this.configService.get<string>('DATABASE_URL') as string;
    }

    get isProduction(): boolean {
        return this.configService.get<string>('NODE_ENV') === "production";
    }

    get JwtSecret(): string {
        return this.configService.get<string>('JWT_SECRET') as string;
    }

    get GoogleClientId(): string {
        return this.configService.get<string>('GOOGLE_CLIENT_ID') as string;
    }

    get GoogleClientSecret(): string {
        return this.configService.get<string>('GOOGLE_CLIENT_SECRET') as string;
    }

    get GoogleCallbackUrl(): string {
        return this.configService.get<string>('GOOGLE_CALLBACK_URL') as string;
    }

    get EmailUser(): string {
        return this.configService.get<string>('EMAIL_USER') as string;
    }

    get EmailPass(): string {
        return this.configService.get<string>('EMAIL_PASS') as string;
    }

    get BackendUrl(): string {
        return this.configService.get<string>('BACKEND_URL') as string;
    }

    get LoggedInFrontendUrl(): string {
        return this.configService.get<string>('LOGGED_IN_FRONTEND_URL') as string;
    }

    get ResetPasswordPageUrl(): string {
        return this.configService.get<string>('RESET_PASSWORD_PAGE_URL') as string;
    }

    get SupportEmail(): string {
        return this.configService.get<string>('SUPPORT_EMAIL') as string;
    }

    get Host(): string {
        return this.configService.get<string>('HOST') as string;
    }

    get FrontendInternalServerErrorPage(): string {
        return this.configService.get<string>('FRONTEND_INTERNAL_SERVER_ERROR_PAGE') as string;
    }

    get MongodbUri(): string {
        return this.configService.get<string>('MONGODB_URI') as string;
    }
}