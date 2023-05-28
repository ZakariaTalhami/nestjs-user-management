import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { JwtConstants } from '../constants';

@Injectable()
export class JwtResetPasswordStrategy extends PassportStrategy(Strategy, "resetPassword") {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JwtConstants.ResetPasswordTokenSecret,
    });
  }

  async validate(payload: any) {
    return { id: payload.sub };
  }
}