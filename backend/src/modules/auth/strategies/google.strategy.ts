import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { AppConfigService } from 'src/config/app-config.service';


@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(appConfig: AppConfigService) {
    super(
      {
        clientID: appConfig.GoogleClientId,
        clientSecret: appConfig.GoogleClientSecret,
        callbackURL: appConfig.GoogleCallbackUrl,
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
