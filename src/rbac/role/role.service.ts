import {
    Injectable,
    ConflictException,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { RoleType } from 'src/common/enums';
import { Role, RoleDocument } from '../schemas/role.schema';
import { CreateSystemRoleDto } from './dtos/create-role.dto';
import { UpdateRoleDto } from './dtos/update-app-role.dto';

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

    async getRoleById(
        roleId: string,
        populate: boolean = false
    ): Promise<RoleDocument | null> {
        const result = this.roleModel.findById(roleId);
        if (populate) {
            result.populate("permissions")
        }

        return result;
    }

    async getAppRoleById(
        appId: string,
        roleId: string,
    ): Promise<RoleDocument | null> {
        return this.roleModel.findOne({
            _id: new Types.ObjectId(roleId),
            app: new Types.ObjectId(appId),
        });
    }

    async getAppRoleByIdOrThrow(
        appId: string,
        roleId: string,
    ): Promise<RoleDocument> {
        const role = await this.getAppRoleById(appId, roleId);

        if (!role) {
            throw new NotFoundException(
                `Role [roleId:${roleId}][appId:${appId}] Not found`,
            );
        }

        return role;
    }

    async getAppRoles(appId: string) {
        return this.roleModel
            .find({
                $or: [
                    {
                        type: RoleType.SYSTEM_SCOPE,
                    },
                    {
                        type: RoleType.APP_SCOPE,
                        app: new Types.ObjectId(appId),
                    },
                ],
            })
            .populate('permissions');
    }

    async updateAppRoles(
        roleId: string,
        appId: string,
        roleDto: UpdateRoleDto,
    ) {
        const role = await this.getAppRoleByIdOrThrow(appId, roleId);

        return this.roleModel.findOneAndUpdate(
            {
                _id: role._id,
            },
            roleDto,
            {
                new: true,
            },
        );
    }

    async deleteAppRole(roleId: string, appId: string) {
        const role = await this.getAppRoleByIdOrThrow(appId, roleId);
        return role.delete();
    }
}
