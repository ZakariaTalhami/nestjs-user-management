import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';
import { LocalStrategy, JwtRefreshStrategy, JwtStrategy } from './strategies';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtConstants } from './constants';
import { MongooseModule } from '@nestjs/mongoose';
import { userTokenModelFactory } from './schemas/token.schema';
import { TokenService } from './token.service';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: JwtConstants.accessTokenSecret,
        signOptions: { expiresIn: JwtConstants.accessTokenExpire },
      }),
    }),
    MongooseModule.forFeatureAsync([userTokenModelFactory]),
    CommonModule,
  ],
  providers: [
    AuthService,
    TokenService,
    LocalStrategy,
    JwtRefreshStrategy,
    JwtStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
