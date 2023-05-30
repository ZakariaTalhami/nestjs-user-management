import {
    Injectable,
    NotFoundException,
    BadRequestException,
    UnauthorizedException,
    Inject,
    forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AppUserStatus } from 'src/common/enums';
import { UsersService } from 'src/users/users.service';
import { CreateAppDto } from './dtos/create-app';
import { EditAppDTO } from './dtos/edit-app';
import { EditAppUserDto } from './dtos/edit-app-user.dto';
import { InviteUserToAppDto } from './dtos/invite-user.dto';
import { InviteService } from './invite.service';
import { App, AppDocument } from './schemas/app.schema';

@Injectable()
export class AppService {
    constructor(
        @InjectModel(App.name) private appModel: Model<AppDocument>,
        @Inject(forwardRef(() => UsersService))
        private usersService: UsersService,
        private inviteService: InviteService,
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
                    { 'users.user': new Types.ObjectId(userId) },
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
        const user = await this.usersService.findUserByEmail(appDto.email);
        const inviterUser = await this.usersService.findUserById(inviter);
        let invitation = await this.inviteService.getInvitationByEmailAndApp(
            app.id,
            appDto.email,
        );

        const existingUser = app.users.find(
            (appUser) => user && appUser.user?.toString() === user.id,
        );

        if (existingUser)
            throw new BadRequestException(
                `User [${user.email}] Already Exists on App [${app.name}]`,
            );

        if (!invitation) {
            invitation = await this.inviteService.create({
                app: app._id,
                email: appDto.email,
                role: new Types.ObjectId(appDto.role),
            });
            app.users.push({
                role: new Types.ObjectId(appDto.role),
                inviter: new Types.ObjectId(inviter),
                invitation: invitation._id,
            });
            await app.save();
        } else {
            // Allow Admins to re-invite user that may have
            // not have received the invitation email properly.
            // Update Invitation Expire Date
            await this.inviteService.refreshInvitationExpire(invitation.id);
        }

        await this.inviteService.sendInvitationEmail(
            invitation,
            inviterUser.email,
            app.name,
        );

        return app;
    }

    async acceptUserInvitation(userId: string, inviteId: string) {
        const user = await this.usersService.findUserById(userId);
        const invitation = await this.inviteService.findInvitationById(
            inviteId,
        );
        const app = await this.getByIdOrThrow(invitation.app.toString());

        if (
            !invitation ||
            invitation.email !== user.email ||
            invitation.isAccepted
        ) {
            throw new BadRequestException('Invalid Invitation Token');
        }

        invitation.isAccepted = true;
        invitation.acceptedDate = new Date();
        invitation.user = user._id;

        const appUserIndex = app.users.findIndex(
            (user) => user.invitation.toString() === inviteId,
        );
        app.users[appUserIndex].status = AppUserStatus.ACCEPTED;
        app.users[appUserIndex].user = user._id;

        await Promise.all([app.save(), invitation.save()]);
    }

    async editAppUser(
        appId: string,
        userId: string,
        appUserDto: EditAppUserDto,
        invokerId: string,
    ) {
        const app = await this.getByIdOrThrow(appId);
        const userIndex = app.users.findIndex(
            (appUser) => appUser.user?.toString() === userId,
        );

        if (userIndex === -1) {
            throw new NotFoundException(
                `User [${appId}] Not Found in App [${appId}]`,
            );
        }

        if (app.users[userIndex].user?.toString() === invokerId) {
            throw new UnauthorizedException(
                'Not authorized to update your own user in this app',
            );
        }

        app.users[userIndex].role = new Types.ObjectId(appUserDto.role);

        // WORKAROUND: JSON parse and stringify are used because the
        // mongoose transformer interceptor is causing infinite loops
        // as it doesnt recognize the embbeded Document as a mongoose
        // model
        return JSON.parse(JSON.stringify(app.users[userIndex]));
    }

    async edit(appId: string, appDto: EditAppDTO) {
        return this.appModel.findOneAndUpdate(
            { _id: new Types.ObjectId(appId) },
            appDto,
            {
                new: true,
            },
        );
    }

    async deleteAppById(appId: string) {
        await this.appModel.findOneAndUpdate(
            {
                _id: new Types.ObjectId(appId),
            },
            {
                isActive: false,
            },
        );
    }
}
