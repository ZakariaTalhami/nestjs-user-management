import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude } from 'class-transformer';
import { HydratedDocument } from 'mongoose';

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

  @Exclude()
  @Prop({ require: true })
  password: string;

  @Prop({
    default: true,
  })
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
