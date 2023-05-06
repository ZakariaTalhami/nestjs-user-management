import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { DateTime } from 'luxon';
import { Model, Types } from 'mongoose';
import { EmailService } from 'src/common/email.service';
import { InvitationConstants } from './constants';
import { CreateInviteDto } from './dtos/create-invite.dto';
import { Invite, InviteDocument } from './schemas/invite.schema';

@Injectable()
export class InviteService {
    constructor(
        @InjectModel(Invite.name) private inviteModel: Model<InviteDocument>,
        private emailService: EmailService,
        private jwtService: JwtService,
    ) {}

    async create(inviteDto: CreateInviteDto) {
        if (!inviteDto.expire) {
            inviteDto.expire = DateTime.now().plus({ days: 14 }).toJSDate();
        }
        return this.inviteModel.create(inviteDto);
    }

    async getInvitationByEmailAndApp(appId: string, email: string) {
        return this.inviteModel.findOne({
            app: new Types.ObjectId(appId),
            email,
        });
    }

    async refreshInvitationExpire(id: string) {
        return this.inviteModel.findByIdAndUpdate(id, {
            expire: DateTime.now().plus({ days: 14 }).toJSDate(),
        });
    }

    async sendInvitationEmail(
        invitation: InviteDocument,
        inviter: string,
        appName: string,
    ) {
        const inviteToken = this.getInvitationToken(invitation.id);
        this.emailService.sendEmailTemplate(
            InvitationConstants.invitationEmailTemplate,
            invitation.email,
            {
                inviter,
                app: appName,
                inviteUrl: `${InvitationConstants.invitationEmailRedirectUrl}?inviteToken=${inviteToken}`,
            },
        );
    }

    getInvitationToken(invitationId: string) {
        return this.jwtService.sign(
            { id: invitationId },
            {
                secret: InvitationConstants.invitationTokenSecret,
                expiresIn: InvitationConstants.invitationExpire,
            },
        );
    }
}
