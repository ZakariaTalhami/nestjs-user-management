import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Resource } from 'src/common/enums';

export type PermissionDocument = HydratedDocument<Permission>;

@Schema({
    timestamps: true,
})
export class Permission {
    @Prop({ unique: true, index: true, required: true })
    name: string;

    @Prop({
        unique: true,
        index: true,
        required: true,
        enum: Object.values(Resource),
    })
    resource: string;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
