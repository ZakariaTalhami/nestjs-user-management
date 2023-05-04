import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type InviteDocument = HydratedDocument<Invite>;

@Schema({
  timestamps: true
})
export class Invite {
    @Prop({
        type: Types.ObjectId,
        ref: 'apps',
        required: true,
        index: true,
    })
    app: Types.ObjectId;

    @Prop({
        type: String,
        required: true,
        index: true
    })
    email: string;

    @Prop({
        type: Types.ObjectId,
        ref: 'roles',
        required: true,
    })
    role: Types.ObjectId;

    @Prop({
        type: Date
    })
    expire: Date

    @Prop({
        type: Boolean,
        default: false
    })
    isAccepted?: boolean

    @Prop({
        type: Date
    })
    acceptedDate?: Date
}

export const InviteSchema = SchemaFactory.createForClass(Invite);
