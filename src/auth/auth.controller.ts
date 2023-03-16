import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JWTRefreshAuthGuard, LocalAuthGuard } from './guards';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
    ;
  }

  @UseGuards(JWTRefreshAuthGuard)
  @Post('refresh')
  async refresh(@Request() req) {
    return this.authService.refreshTokens(req.user);
  }
}
