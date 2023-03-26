import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

export type AppDocument = HydratedDocument<App>;

@Schema({
  timestamps: true
})
export class App {
    @Prop({
        type: Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    })
    owner: User;

    @Prop({
        index: true,
        default: "default"
    })
    name: string;

    @Prop({
        type: [Types.ObjectId],
        ref: 'User',
        index: true,
        default: [],
    })
    users: User[];

    @Prop({
        default: true,
    })
    isActive: boolean;
}

export const AppSchema = SchemaFactory.createForClass(App);
