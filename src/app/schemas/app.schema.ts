import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';
import { AppUser, AppUserSchema } from './app-user.schema';

export type AppDocument = HydratedDocument<App>;

@Schema({
  timestamps: true
})
export class App {
    @Prop({
        type: Types.ObjectId,
        ref: User.name,
        required: true,
        index: true,
    })
    owner: Types.ObjectId;

    @Prop({
        index: true,
        default: "default"
    })
    name: string;

    @Prop({
        type: [AppUserSchema],
        default: [],
    })
    users: AppUser[];

    @Prop({
        default: true,
    })
    isActive: boolean;
}

export const AppSchema = SchemaFactory.createForClass(App);
