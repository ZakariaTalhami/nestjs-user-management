import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtConstants } from '../constants';
import { UserTokenType } from '../enums';
import { TokenService } from '../token.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private extractJwt = ExtractJwt.fromAuthHeaderAsBearerToken();
  
  constructor(private tokenService: TokenService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JwtConstants.accessTokenSecret,
    });
  }

  async validate(...args) {
    const [req, payload] = args;
    const token = this.extractJwt(req);
    const tokenRecord = await this.tokenService.getToken(
      token,
      UserTokenType.ACCESS_TOKEN,
    );

    if (!tokenRecord) {
      throw new UnauthorizedException();
    }

    return { id: payload.sub };
  }
}
