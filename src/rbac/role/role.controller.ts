import {
    Controller,
    Post,
    Get,
    Patch,
    Body,
    ValidationPipe,
    UseGuards,
    Param,
    Delete,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { JwtAuthGuard } from 'src/auth/guards';
import { ApiKeyGuard } from 'src/auth/guards/api-key.guard';
import { RequirePermissions } from '../decorators';
import { Authorize } from '../guards';
import { Permissions } from '../permission/enums';
import { CreateSystemRoleDto } from './dtos/create-role.dto';
import { UpdateRoleDto } from './dtos/update-app-role.dto';
import { RoleService } from './role.service';

@Controller('rbac/role')
export class RoleController {
    constructor(private roleService: RoleService) {}

    @UseGuards(ApiKeyGuard)
    @Post()
    async createRole(
        @Body(new ValidationPipe()) createSystemRoleDto: CreateSystemRoleDto,
    ) {
        return this.roleService.createRole(createSystemRoleDto);
    }

    @RequirePermissions(Permissions.ROLE_CREATE)
    @UseGuards(JwtAuthGuard, Authorize)
    @Post('app/:appId')
    async createAppRole(
        @Param('appId') appId: string,
        @Body(new ValidationPipe()) createAppRoleDto: CreateSystemRoleDto,
    ) {
        createAppRoleDto.app = new Types.ObjectId(appId);
        return this.roleService.createRole(createAppRoleDto);
    }

    @RequirePermissions(Permissions.ROLE_READ)
    @UseGuards(JwtAuthGuard, Authorize)
    @Get('app/:appId')
    async getAppRoles(@Param('appId') appId: string) {
        return this.roleService.getAppRoles(appId);
    }

    @RequirePermissions(Permissions.ROLE_EDIT)
    @UseGuards(JwtAuthGuard, Authorize)
    @Patch(':roleId/app/:appId')
    async updateAppRole(
        @Param('roleId') roleId: string,
        @Param('appId') appId: string,
        @Body(new ValidationPipe()) updateAppRoleDto: UpdateRoleDto,
    ) {
        return this.roleService.updateAppRoles(roleId, appId, updateAppRoleDto);
    }

    @RequirePermissions(Permissions.ROLE_DELETE)
    @UseGuards(JwtAuthGuard, Authorize)
    @Delete(':roleId/app/:appId')
    async deleteAppRole(
        @Param('roleId') roleId: string,
        @Param('appId') appId: string
    ) {
        return this.roleService.deleteAppRole(roleId, appId);
    }
}
