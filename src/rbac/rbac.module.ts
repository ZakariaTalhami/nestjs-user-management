import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Permission, PermissionSchema } from './schemas/permission.schema';
import { PermissionController } from './permission/permission.controller';
import { PermissionService } from './permission/permission.service';
import { Role, RoleSchema } from './schemas/role.schema';
import { RoleController } from './role/role.controller';
import { RoleService } from './role/role.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Permission.name, schema: PermissionSchema },
            { name: Role.name, schema: RoleSchema },
        ]),
    ],
    controllers: [PermissionController, RoleController],
    providers: [PermissionService, RoleService],
})
export class RbacModule {}
