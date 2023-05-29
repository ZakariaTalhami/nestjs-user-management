import { SetMetadata } from '@nestjs/common';
import { Permissions as PermissionEnum } from '../permission/enums';

export const PERMISSIONS_KEY = 'permissions';
export const RequirePermissions = (...permissions: PermissionEnum[]) =>
    SetMetadata(PERMISSIONS_KEY, permissions);
