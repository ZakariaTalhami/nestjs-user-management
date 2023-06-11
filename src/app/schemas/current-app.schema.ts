import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';
import { App } from './app.schema';

export type CurrentAppDocument = HydratedDocument<CurrentApp>;

@Schema({
  timestamps: true
})
export class CurrentApp {
    @Prop({
        type: Types.ObjectId,
        ref: User.name,
        required: true,
        index: true,
    })
    user: Types.ObjectId;

    @Prop({
        type: Types.ObjectId,
        ref: App.name,
        required: true,
        index: true,
    })
    app: Types.ObjectId;
}

export const CurrentAppSchema = SchemaFactory.createForClass(CurrentApp);
