import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { JwtConstants } from '../constants';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, "jwtRefresh") {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JwtConstants.refreshTokenSecret,
    });
  }

  async validate(payload: any) {
    return { id: payload.sub };
  }
}