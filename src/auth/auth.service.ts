import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { compare as comparePassword } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findUserByEmail(email);
    
    const isUserPasswordVerified = await comparePassword(
      password,
      user?.password,
    );
    if (isUserPasswordVerified) {
      return user;
    }

    return null;
  }

  async login(user: any) {
    const payload = { sub: user.id };
    return this.generateTokens(payload)
  }

  async refreshTokens(user: any) {
    const userRecord = await this.usersService.findUserById(user.id);

    if(!userRecord) {
      throw new UnauthorizedException()
    }
    const payload = { sub: user.id };
    return this.generateTokens(payload)
  }

  private generateTokens(payload: any) {
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, {
        secret: JwtConstants.refreshTokenSecret,
        expiresIn: JwtConstants.refreshTokenExpire
      }),
    };
  }
}
