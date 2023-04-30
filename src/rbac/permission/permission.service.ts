import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Permission, PermissionDocument } from '../schemas/permission.schema';
import { CreatePermissionDto } from './dtos/create-permission.dto';
import { EditPermissionDto } from './dtos/edit-permission.dto';

@Injectable()
export class PermissionService {
    constructor(
        @InjectModel(Permission.name)
        private permissionModel: Model<PermissionDocument>,
    ) {}

    async createPermission(createPermissionDto: CreatePermissionDto) {
        const existingPermission = await this.getPermissionByName(
            createPermissionDto.name,
        );
        if (existingPermission) {
            throw new ConflictException(
                `Permission [${createPermissionDto.name}] Already Exists`,
            );
        }

        return this.permissionModel.create(createPermissionDto);
    }

    async getPermissionById(permissionId: string) {
        return this.permissionModel.findById(permissionId);
    }

    async getPermissionByIdOrThrowError(permissionId: string) {
        const permission = await this.getPermissionById(permissionId);

        if(!permission) {
            throw new NotFoundException(`Permission [${permissionId}] Not Found`);
        }

        return permission;
    }

    async getPermissionByName(
        name: string,
    ): Promise<PermissionDocument | null> {
        return this.permissionModel.findOne({ name });
    }

    async getPermissionList() {
        return this.permissionModel.find({});
    }

    async editPermission(permissionId, editPermissionDto: EditPermissionDto) {
        const permission = await this.getPermissionByIdOrThrowError(permissionId);

        return this.permissionModel.findOneAndUpdate(
            {
                _id: permission._id
            },
            editPermissionDto,
            {
                new: true
            }
        )
    }
}
