import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-zoho-crm';
import { Injectable, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthsService } from '../auths.service';

@Injectable()
// scope: ['ZohoCRM.modules.all', 'ZohoCRM.settings.all', 'email'],
export class ZohoStrategy extends PassportStrategy(Strategy, 'zoho') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthsService,
  ) {
    super({
      authorizationURL: 'https://accounts.zoho.com.au/oauth/v2/auth',
      tokenURL: 'https://accounts.zoho.com.au/oauth/v2/token',
      userProfileURL: 'https://accounts.zoho.com.au/oauth/user/info',
      clientID: configService.get('ZOHO_CLIENT_ID'),
      clientSecret: configService.get('ZOHO_CLIENT_SECRET'),
      callbackURL: configService.get('ZOHO_CALLBACK_URL'),
      scope: [
        'ZohoCRM.modules.ALL',
        'ZohoCRM.settings.ALL',
        'AaaServer.profile.Read',
        'ZohoProjects.tasks.ALL',
        'ZohoProjects.projects.ALL',
        'ZohoProjects.portals.ALL',
      ],
      response_type: 'code',
      access_type: 'offline',
      prompt: 'consent',
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: (error: any, user?: any) => void,
  ): Promise<any> {
    try {
      // Add your custom validation logic here
      const user = {
        profile,
        accessToken,
        refreshToken,
      };
      return this.authService.validateUser(user);
    } catch (error) {
      return done(error);
    }
  }
}
