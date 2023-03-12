import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ExcludeProperty } from 'nestjs-mongoose-exclude';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
})
export class User {
  @Prop()
  name: string;

  @Prop({
    required: true,
    unique: true,
    lowercase: true
  })
  email: string;

  @Prop({ require: true })
  @ExcludeProperty()
  password: string;

  @Prop({
    default: true,
  })
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
