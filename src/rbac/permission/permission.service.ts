import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Permission, PermissionDocument } from '../schemas/permission.schema';
import { CreatePermissionDto } from './dtos/create-permission.dto';

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

    async getPermissionByName(
        name: string,
    ): Promise<PermissionDocument | null> {
        return this.permissionModel.findOne({ name });
    }
}
