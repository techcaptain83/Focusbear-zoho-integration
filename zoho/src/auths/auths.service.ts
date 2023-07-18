import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../users/users.service';
import fetch from 'node-fetch'
@Injectable()
export class AuthsService {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  getZohoLoginUrl() {
    const scopes = [
      'AaaServer.profile.Read',
      'ZohoProjects.tasks.ALL',
      'ZohoProjects.projects.ALL',
      'ZohoProjects.portals.ALL',
      'ZohoProjects.timesheets.ALL',
    ];

    let queryParams: any = {
      scope: scopes.join(','),
      client_id: this.configService.get('ZOHO_CLIENT_ID'),
      client_secret: this.configService.get('ZOHO_CLIENT_SECRET'),
      redirect_uri: this.configService.get('ZOHO_CALLBACK_URL'),
      response_type: 'code',
      access_type: 'offline',
      prompt: 'consent',
    };
    // convert queryParams to query string
    queryParams = Object.keys(queryParams)
      .map((key) => `${key}=${queryParams[key]}`)
      .join('&');
    return `https://accounts.zoho.com.au/oauth/v2/auth?${queryParams}`;
  }

  async validateUser(user: any): Promise<any> {
    const { accessToken, refreshToken, profile } = user;
    const email = profile.Email;
    const existingUser = await this.userService.findByEmail(email);
    const detailPayload = {
      ...(profile.First_Name && { firstName: profile.First_Name }),
      ...(profile.Last_Name && { lastName: profile.Last_Name }),
      refreshToken: refreshToken || '',
      accessToken: accessToken || '',
      email,
      ...(profile.location && { location: profile.location }),
      ...(profile.accountServer && { accountServer: profile.accountServer }),
    };

    if (existingUser) {
      // Update the user's access token and refresh token
      await this.userService.update(existingUser.id, detailPayload);
      return existingUser;
    } else {
      // Create a new user
      const newUser = await this.userService.create({
        ...detailPayload,
      });
      return newUser;
    }
  }

  async refreshToken(user: any) {
    const { refreshToken, accountServer } = user;
    const url = `${accountServer}/oauth/v2/token?client_id=${this.configService.get(
      'ZOHO_CLIENT_ID',
    )}&grant_type=refresh_token&client_secret=${this.configService.get(
      'ZOHO_CLIENT_SECRET',
    )}&refresh_token=${refreshToken}`;
    const response = await fetch(url, {
      method: 'POST',
    });
    const data = await response.json();
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: await this.jwtService.signAsync(payload, {
        expiresIn: data.expires_in,
      }),
    };
  }

  async authorize(query: Record<string, any>) {
    const { code, location, 'accounts-server': accountServer } = query;

    const url = `${accountServer}/oauth/v2/token?client_id=${this.configService.get(
      'ZOHO_CLIENT_ID',
    )}&grant_type=authorization_code&client_secret=${this.configService.get(
      'ZOHO_CLIENT_SECRET',
    )}&redirect_uri=${this.configService.get(
      'ZOHO_CALLBACK_URL',
    )}&code=${code}`;
    const response = await fetch(url, {
      method: 'POST',
    });
    const data = await response.json();

    // call profile api
    const profileUrl = `${accountServer}/oauth/user/info`;
    const profileResponse = await fetch(profileUrl, {
      method: 'GET',
      headers: {
        Authorization: `Zoho-oauthtoken ${data.access_token}`,
      },
    });
    const profileData = await profileResponse.json();
    const user = await this.validateUser({
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      profile: {
        ...profileData,
        location,
        accountServer,
      },
    });
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: await this.jwtService.signAsync(payload, {
        expiresIn: data.expires_in,
      }),
    };
  }

  async login(user: any, query: Record<string, any>) {
    const existingUser = await this.userService.findByEmail(user.email);
    if (!existingUser) {
      throw new Error('User not found');
    }
    const updatePayload = {
      ...(query.api_domain && { apiDomain: query.api_domain }),
      ...(query.location && { location: query.location }),
      ...(query['accounts-server'] && {
        accountServer: query['accounts-server'],
      }),
    };
    // existingUser.apiDomain = apiDomain;
    await this.userService.update(existingUser.id, {
      ...updatePayload,
    });
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
