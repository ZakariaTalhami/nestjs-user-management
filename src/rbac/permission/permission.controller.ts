import { Controller, Post, Body, ValidationPipe, UseGuards } from '@nestjs/common';
import { ApiKeyGuard } from 'src/auth/guards/api-key.guard';
import { CreatePermissionDto } from './dtos/create-permission.dto';
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
}
