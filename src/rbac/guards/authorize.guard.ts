import {
    CanActivate,
    ExecutionContext,
    Injectable,
    NotFoundException,
    Inject,
    forwardRef
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { AppService } from '../../app/app.service';
import { PERMISSIONS_KEY } from '../decorators';
import { Permissions } from '../permission/enums';
import { RoleService } from '../role/role.service';

@Injectable()
export class Authorize implements CanActivate {
    constructor(
        @Inject(forwardRef(() => AppService))
        private appService: AppService,
        private roleService: RoleService,
        private reflector: Reflector,
    ) {}

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest();
        const { appId } = req.params;
        const userId = req.user?.id;

        // Permission list is set in route metadata
        const requiredPermissions = this.reflector.getAllAndOverride<
            Permissions[]
        >(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);

        if (!requiredPermissions || !requiredPermissions.length) return true;

        return this.validateUserPermissions(userId, appId, requiredPermissions);
    }

    async validateUserPermissions(
        userId: string,
        appId: string,
        requiredPermissions: Permissions[],
    ): Promise<boolean> {
        let isAuthorized = false;
        const app = await this.appService.getById(appId);

        if (!app) {
            throw new NotFoundException(`App [${appId}] Not found`);
        }

        // Allow all operations for owner of app
        isAuthorized = app.owner.toString() === userId;

        // If not owner check the user permission list in app
        if (!isAuthorized) {
            const appUser = app.users.find(
                (appUser) => appUser?.user?.toString() === userId,
            );
            if (appUser) {
                const role = await this.roleService.getRoleById(
                    appUser.role.toString(),
                    true,
                );
                const permissionList = role.permissions.map(
                    (permission) => (permission as any).name,
                );
                
                isAuthorized = requiredPermissions.every((permission) =>
                    permissionList.includes(permission),
                );
            }
        }

        return isAuthorized;
    }
}
