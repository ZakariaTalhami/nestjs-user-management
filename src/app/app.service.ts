import {
    Injectable,
    NotFoundException,
    BadRequestException,
    Inject,
    forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UsersService } from 'src/users/users.service';
import { CreateAppDto } from './dtos/create-app';
import { EditAppDTO } from './dtos/edit-app';
import { InviteUserToAppDto } from './dtos/invite-user.dto';
import { App, AppDocument } from './schemas/app.schema';

@Injectable()
export class AppService {
    constructor(
        @InjectModel(App.name) private appModel: Model<AppDocument>,
        @Inject(forwardRef(() => UsersService))
        private usersService: UsersService,
    ) {}

    async create(appDto: CreateAppDto) {
        return this.appModel.create(appDto);
    }

    async getById(appId: string) {
        return this.appModel.findOne({
            _id: new Types.ObjectId(appId),
            isActive: true,
        });
    }

    async getByIdOrThrow(appId: string) {
        const app = await this.getById(appId);

        if (!app) {
            throw new NotFoundException(`App [${appId}] Not found`);
        }

        return app;
    }

    async findAllUserApps(userId: string) {
        return this.appModel.find(
            {
                $or: [
                    { owner: new Types.ObjectId(userId) },
                    { users: new Types.ObjectId(userId) },
                ],
            },
            {
                _id: true,
                name: true,
                isActive: true,
            },
            {
                sort: {
                    name: -1,
                },
            },
        );
    }

    async inviteUserToApp(
        appId: string,
        appDto: InviteUserToAppDto,
        inviter: string,
    ) {
        const app = await this.getByIdOrThrow(appId);
        const user = await this.usersService.findUserByEmailOrThrow(
            appDto.email,
        );

        const existingUser = app.users.find(
            (appUser) => appUser.user.toString() === user.id,
        );

        if (existingUser)
            throw new BadRequestException(
                `User [${user.email}] Already Exists on App [${app.name}]`,
            );

        app.users.push({
            user: user._id,
            role: new Types.ObjectId(appDto.role),
            inviter: new Types.ObjectId(inviter),
        });

        return app.save();
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
