import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAppDto } from './dtos/create-app';
import { App, AppDocument } from './schemas/app.schema';

@Injectable()
export class AppService {
    constructor(@InjectModel(App.name) private appModel: Model<AppDocument>) {}

    async create(appDto: CreateAppDto) {
        return this.appModel.create(appDto);
    }
}
