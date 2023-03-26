import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { compare as comparePassword } from 'bcrypt';
import { Model } from 'mongoose';
import { JwtConstants } from './constants';
import { UserTokenType } from './enums';
import { UserToken, UserTokenDocument } from './schemas/token.schema';

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(UserToken.name)
    private userTokenModel: Model<UserTokenDocument>,
  ) {}

  async generateTokens(userId: string, payload: any) {
    const [accessToken, refreshToken] = await Promise.all([
      this.generateToken(userId, payload, UserTokenType.ACCESS_TOKEN),
      this.generateToken(userId, payload, UserTokenType.REFRESH_TOKEN),
    ]);
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async generateToken(userId: string, payload: any, tokenType: UserTokenType) {
    const jwtConfig = this.getTokenConfigByType(tokenType);

    const token = this.jwtService.sign(payload, jwtConfig);
    this.saveUserToken(userId, token, tokenType);

    return token;
  }

  async saveUserToken(user: string, token: string, tokenType: UserTokenType) {
    return this.userTokenModel.create({
      user,
      token,
      tokenType,
    });
  }

  private getTokenConfigByType(
    tokenType: UserTokenType,
  ): JwtSignOptions | undefined {
    let tokenConfig: JwtSignOptions;
    switch (tokenType) {
      case UserTokenType.REFRESH_TOKEN:
        tokenConfig = {
          secret: JwtConstants.refreshTokenSecret,
          expiresIn: JwtConstants.refreshTokenExpire,
        };
        break;
    }

    return tokenConfig;
  }
}