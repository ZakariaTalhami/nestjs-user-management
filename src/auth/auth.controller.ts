import { Controller, Post, Request, UseGuards, Body, ValidationPipe } from '@nestjs/common';
import { ExtractJwt } from 'passport-jwt';
import { AuthService } from './auth.service';
import { ForgotPasswordDto, ResetPasswordDto } from './dtos/forgot-password.dto';
import { JWTRefreshAuthGuard, JWTResetPasswordAuthGuard, LocalAuthGuard } from './guards';

@Controller('auth')
export class AuthController {
  private extractJwt = ExtractJwt.fromAuthHeaderAsBearerToken();

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

  @Post('reset-password')
  @UseGuards(JWTResetPasswordAuthGuard)
  async resetPassword(
    @Body(new ValidationPipe()) resetPasswordDto: ResetPasswordDto,
    @Request() req
  ) {
    const token = this.extractJwt(req)
    await this.authService.resetPassword(req.user.id, token, resetPasswordDto);
    return {
      message: "Your password has been Reset Successfully"
    }
  }
}
