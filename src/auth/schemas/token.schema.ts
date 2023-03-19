import {
  AsyncModelFactory,
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';
import { genSalt, hash } from 'bcrypt';
import { HydratedDocument, Types } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';
import { UserTokenType } from '../enums';

export type UserTokenDocument = HydratedDocument<UserToken>;

@Schema()
export class UserToken {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  user: User;

  @Prop({
    required: true,
    index: true,
  })
  token: string;

  @Prop({
    required: true,
    enum: Object.values(UserTokenType),
  })
  tokenType: UserTokenType;

  @Prop({
    default: true,
  })
  isActive: boolean;
}

export const UserTokenSchema = SchemaFactory.createForClass(UserToken);

export const userTokenModelFactory: AsyncModelFactory = {
  name: UserToken.name,
  useFactory: () => {
    const schema = UserTokenSchema;

    schema.pre<UserToken>('save', async function () {
      const user = this;
      const salt = await genSalt(10);
      const hashedToken = await hash(user.token, salt);

      user.token = hashedToken;
    });

    return schema;
  },
};
