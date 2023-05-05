import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DateTime } from 'luxon';
import { Model, Types } from 'mongoose';
import { CreateInviteDto } from './dtos/create-invite.dto';
import { Invite, InviteDocument } from './schemas/invite.schema';

@Injectable()
export class InviteService {
    
    constructor(
        @InjectModel(Invite.name) private inviteModel: Model<InviteDocument>,
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
            email
        });
    }

    async refreshInvitationExpire(id: string) {
        return this.inviteModel.findByIdAndUpdate(
            id,
            {
                expire: DateTime.now().plus({ days: 14 }).toJSDate()
            }
        )
    }
}
