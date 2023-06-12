import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { AppUserStatus } from 'src/common/enums';
import { User } from 'src/users/schemas/user.schema';
import { Invite } from './invite.schema';

export type AppUserDocument = HydratedDocument<AppUser>;

@Schema()
export class AppUser {
    @Prop({
        type: Types.ObjectId,
        ref: User.name,
        index: true,
    })
    user?: Types.ObjectId;

    @Prop({
        type: Types.ObjectId,
        ref: 'Role',
        required: true,
    })
    role: Types.ObjectId;

    @Prop({
        type: Types.ObjectId,
        ref: User.name,
        required: true,
    })
    inviter: Types.ObjectId;

    @Prop({
        default: Date.now,
    })
    addedDate?: Date;

    @Prop({
        type: Types.ObjectId,
        ref: Invite.name,
        index: true,
        required: true,
    })
    invitation: Types.ObjectId;

    @Prop({
        type: String,
        enum: Object.values(AppUserStatus),
        default: AppUserStatus.PENDING_INVITE,
        index: true,
    })
    status?: AppUserStatus;
}

export const AppUserSchema = SchemaFactory.createForClass(AppUser);
