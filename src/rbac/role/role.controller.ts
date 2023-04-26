import {
    Controller,
    Post,
    Body,
    ValidationPipe,
    UseGuards,
} from '@nestjs/common';
import { ApiKeyGuard } from 'src/auth/guards/api-key.guard';
import { CreateSystemRoleDto } from './dtos/create-role.dto';
import { RoleService } from './role.service';

@Controller('rbac/role')
export class RoleController {
    constructor(private roleService: RoleService) {}

    @UseGuards(ApiKeyGuard)
    @Post()
    async createRole(@Body(new ValidationPipe()) createSystemRoleDto: CreateSystemRoleDto) {
        return this.roleService.createRole(createSystemRoleDto);
    }
}
