import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateAppDto } from './dtos/create-app';
import { EditAppDTO } from './dtos/edit-app';
import { App, AppDocument } from './schemas/app.schema';

@Injectable()
export class AppService {
    constructor(@InjectModel(App.name) private appModel: Model<AppDocument>) {}

    async create(appDto: CreateAppDto) {
        return this.appModel.create(appDto);
    }

    async getById(appId: string) {
        return this.appModel.findOne({
            id: appId,
            isActive: true,
        });
    }

    async findAllUserApps(userId: string) {
        return this.appModel.find(
            {
                $or: [
                    { owner: userId },
                    { users: new Types.ObjectId(userId) },
                ],
            },
            {
                _id: true,
                name: true,
                isActive: true
            },
        );
    }

    async edit(appId: string, appDto: EditAppDTO) {
        return this.appModel.findOneAndUpdate({ id: appId }, appDto, {
            new: true,
        });
    }

    async deleteAppById(appId: string) {
        await this.appModel.findOneAndUpdate(
            {
                id: appId,
            },
            {
                isActive: false,
            },
        );
    }
}
