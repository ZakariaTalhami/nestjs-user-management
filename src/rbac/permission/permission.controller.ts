import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { CreatePermissionDto } from './dtos/create-permission.dto';
import { PermissionService } from './permission.service';

@Controller('rbac/permission')
export class PermissionController {
    constructor(private permissionService: PermissionService) {}

    @Post()
    async createPermission(
        @Body(new ValidationPipe()) createPermissionDto: CreatePermissionDto
    ) {
        return this.permissionService.createPermission(createPermissionDto);
    }
}
