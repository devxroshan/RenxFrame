import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';


@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(configService: ConfigService) {
    super(
      {
        clientID: configService.get<string>('GOOGLE_CLIENT_ID') as string,
        clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET') as string,
        callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL') as string,
        scope: ['profile', 'email'],
      }
    );
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    const { displayName, emails } = profile;
    return {
      name: displayName,
      profilePicUrl: profile._json.picture,
      email: emails[0].value,
    };
  }
}
