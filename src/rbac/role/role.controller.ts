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
import { OnlyOwner } from 'src/app/guards';
import { JwtAuthGuard } from 'src/auth/guards';
import { ApiKeyGuard } from 'src/auth/guards/api-key.guard';
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

    @UseGuards(JwtAuthGuard, OnlyOwner)
    @Post('app/:appId')
    async createAppRole(
        @Param('appId') appId: string,
        @Body(new ValidationPipe()) createAppRoleDto: CreateSystemRoleDto,
    ) {
        createAppRoleDto.app = new Types.ObjectId(appId);
        return this.roleService.createRole(createAppRoleDto);
    }

    @UseGuards(JwtAuthGuard, OnlyOwner)
    @Get('app/:appId')
    async getAppRoles(@Param('appId') appId: string) {
        return this.roleService.getAppRoles(appId);
    }

    @UseGuards(JwtAuthGuard, OnlyOwner)
    @Patch(':roleId/app/:appId')
    async updateAppRole(
        @Param('roleId') roleId: string,
        @Param('appId') appId: string,
        @Body(new ValidationPipe()) updateAppRoleDto: UpdateRoleDto,
    ) {
        return this.roleService.updateAppRoles(roleId, appId, updateAppRoleDto);
    }

    @UseGuards(JwtAuthGuard, OnlyOwner)
    @Delete(':roleId/app/:appId')
    async deleteAppRole(
        @Param('roleId') roleId: string,
        @Param('appId') appId: string
    ) {
        return this.roleService.deleteAppRole(roleId, appId);
    }
}
