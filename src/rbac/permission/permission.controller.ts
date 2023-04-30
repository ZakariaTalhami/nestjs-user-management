import { Controller, Post, Body, ValidationPipe, UseGuards, Get, Patch, Param } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards';
import { ApiKeyGuard } from 'src/auth/guards/api-key.guard';
import { CreatePermissionDto } from './dtos/create-permission.dto';
import { EditPermissionDto } from './dtos/edit-permission.dto';
import { PermissionService } from './permission.service';

@Controller('rbac/permission')
export class PermissionController {
    constructor(private permissionService: PermissionService) {}

    @UseGuards(ApiKeyGuard)
    @Post()
    async createPermission(
        @Body(new ValidationPipe()) createPermissionDto: CreatePermissionDto
    ) {
        return this.permissionService.createPermission(createPermissionDto);
    }


    @UseGuards(JwtAuthGuard)
    @Get()
    async getPermissionList() {
        return this.permissionService.getPermissionList();
    }

    @UseGuards(ApiKeyGuard)
    @Patch(":permissionId")
    async editPermission(
        @Param("permissionId") permissionId: string,
        @Body(new ValidationPipe()) editPermissionDto: EditPermissionDto
    ) {
        return this.permissionService.editPermission(permissionId, editPermissionDto);
    }
}
