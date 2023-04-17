import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AppModule as UserAppModule } from './app/app.module';
import { RbacModule } from './rbac/rbac.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DB_STRING),
    UsersModule,
    AuthModule,
    UserAppModule,
    RbacModule
  ],
})
export class AppModule {}