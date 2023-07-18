import { AuthsService } from './auths.service';
import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';
import { JwtAuthGuard } from './guard/jwt.auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthsService) {}

  @Get('zoho') zohoLogin(@Res() res) {
    res.redirect(this.authService.getZohoLoginUrl());
  }

  @Get('zoho/callback') async zohoCallback(@Req() req) {
    try {
      return this.authService.authorize(req.query);
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/refresh-token') async refreshToken(@Req() req) {
    try {
      return this.authService.refreshToken(req.user);
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req) {
    return req.user;
  }
}
