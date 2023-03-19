import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtConstants } from '../constants';
import { TokenService } from '../token.service';
import { UserTokenType } from '../enums';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwtRefresh',
) {
  private extractJwt = ExtractJwt.fromAuthHeaderAsBearerToken();

  constructor(private tokenService: TokenService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JwtConstants.refreshTokenSecret,
      passReqToCallback: true,
    });
  }

  async validate(...args) {
    const [req, payload] = args;
    const token = this.extractJwt(req);
    const tokenRecord = await this.tokenService.getToken(
      token,
      UserTokenType.REFRESH_TOKEN,
    );

    if (!tokenRecord) {
      throw new UnauthorizedException();
    }

    return { id: payload.sub };
  }
}
