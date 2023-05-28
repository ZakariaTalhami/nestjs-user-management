import {
  AsyncModelFactory,
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';
import { genSalt, hash } from 'bcrypt';
import { HydratedDocument, Types } from 'mongoose';
import { HashUtils } from 'src/common/utils';
import { User } from 'src/users/schemas/user.schema';
import { UserTokenType } from '../enums';

export type UserTokenDocument = HydratedDocument<UserToken>;

@Schema({
  timestamps: true
})
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
      const hashedToken = HashUtils.hashToken(user.token);

      user.token = hashedToken;
    });

    return schema;
  },
};
