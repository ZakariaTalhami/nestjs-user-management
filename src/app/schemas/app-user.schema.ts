import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

export type AppUserDocument = HydratedDocument<AppUser>;

@Schema()
export class AppUser {
    @Prop({
        type: Types.ObjectId,
        ref: User.name,
        index: true,
        required: true
    })
    user: Types.ObjectId;

    @Prop({
        type: Types.ObjectId,
        ref: "roles",
        required: true
    })
    role: Types.ObjectId;

    @Prop({
        type: Types.ObjectId,
        ref: User.name,
        required: true
    })
    inviter: Types.ObjectId;

    
    @Prop({
        default: Date.now
    })
    addedDate: Date
}

export const AppUserSchema = SchemaFactory.createForClass(AppUser);
