import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAppDto } from './dtos/create-app';
import { EditAppDTO } from './dtos/edi-app';
import { App, AppDocument } from './schemas/app.schema';

@Injectable()
export class AppService {
    constructor(@InjectModel(App.name) private appModel: Model<AppDocument>) {}

    async create(appDto: CreateAppDto) {
        return this.appModel.create(appDto);
    }

    async getById(appId: string) {
        return this.appModel.findById(appId);
    }

    async edit(appId: string, appDto: EditAppDTO) {
        return this.appModel.findOneAndUpdate({ id: appId }, appDto, {
            new: true,
        });
    }
}
