import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { App } from 'src/app/schemas/app.schema';
import { RoleType } from 'src/common/enums';
import { Permission } from './permission.schema';

export type RoleDocument = HydratedDocument<Role>;

@Schema({
    timestamps: true,
})
export class Role {
    @Prop({ unique: true, index: true, required: true })
    name: string;
    
    @Prop({ unique: true, index: true, required: true })
    displayName: string;

    @Prop({
        default: ""
    })
    description: string

    @Prop({
        type: [Types.ObjectId],
        ref: Permission.name,
        index: true,
        default: [],
    })
    permissions: Types.ObjectId[];

    @Prop({
        index: true,
        required: true,
        enum: Object.values(RoleType),
    })
    type: string;

    @Prop({
        type: Types.ObjectId,
        ref: App.name,
        index: true,
    })
    app: Types.ObjectId;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
