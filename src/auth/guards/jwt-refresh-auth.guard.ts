import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JWTRefreshAuthGuard extends AuthGuard('jwtRefresh') {}
