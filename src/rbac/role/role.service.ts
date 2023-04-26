import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RoleType } from 'src/common/enums';
import { Role, RoleDocument } from '../schemas/role.schema';
import { CreateSystemRoleDto } from './dtos/create-role.dto';

@Injectable()
export class RoleService {
    constructor(
        @InjectModel(Role.name)
        private roleModel: Model<RoleDocument>,
    ) {}

    async createRole(createSystemRoleDto: CreateSystemRoleDto) {
        const existingRole = await this.getRoleByName(createSystemRoleDto.name);
        if (existingRole) {
            throw new ConflictException(
                `Role [${createSystemRoleDto.name}] Already Exists`,
            );
        }

        const roleType: RoleType = createSystemRoleDto.app
            ? RoleType.APP_SCOPE
            : RoleType.SYSTEM_SCOPE;

        return this.roleModel.create({
            type: roleType,
            ...createSystemRoleDto,
        });
    }

    async getRoleByName(name: string): Promise<RoleDocument | null> {
        return this.roleModel.findOne({ name });
    }
}
