import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { App, AppSchema } from './schemas/app.schema';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { UsersModule } from 'src/users/users.module';
import { Invite, InviteSchema } from './schemas/invite.schema';
import { InviteService } from './invite.service';
import { CommonModule } from 'src/common/common.module';
import { JwtModule } from '@nestjs/jwt';
import { RbacModule } from 'src/rbac/rbac.module';
import { CurrentApp, CurrentAppSchema } from './schemas/current-app.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: App.name, schema: AppSchema },
            { name: Invite.name, schema: InviteSchema },
            { name: CurrentApp.name, schema: CurrentAppSchema },
        ]),
        forwardRef(() => UsersModule),
        forwardRef(() => RbacModule),
        CommonModule,
        JwtModule
    ],
    providers: [AppService, InviteService],
    exports: [AppService],
    controllers: [AppController],
})
export class AppModule {}
