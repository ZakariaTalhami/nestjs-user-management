import { Controller, Post, Request, UseGuards, Body, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { JWTRefreshAuthGuard, LocalAuthGuard } from './guards';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JWTRefreshAuthGuard)
  @Post('refresh')
  async refresh(@Request() req) {
    return this.authService.refreshTokens(req.user);
  }
  
  @Post('forgot-password')
  async forgotPassword(
    @Body(new ValidationPipe()) forgotPasswordDto: ForgotPasswordDto
  ) {
    await this.authService.forgotPassword(forgotPasswordDto);
    return {
      message: "Reset Password Email Sent. Please Check your Inbox."
    }
  }
}
