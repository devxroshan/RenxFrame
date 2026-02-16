import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports: [
        JwtModule.register({
            secret: process.env.JWT_SECRET as string,
            signOptions: { expiresIn: "28d", algorithm: "HS512" }
        })
    ],
    controllers: [AuthController],
    providers: [AuthService],
    exports: []
})

export class AuthModule {}