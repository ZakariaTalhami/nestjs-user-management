import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { genSalt, hash } from 'bcrypt';

@Module({
  imports: [
    // TODO: find a better place to put this functionality
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          const schema = UserSchema;

          schema.pre<User>('save', async function () {
            const user = this;
            const salt = await genSalt(10);
            const hashedPassword = await hash(user.password, salt);

            user.password = hashedPassword;
          });

          return schema;
        },
      },
    ]),
  ],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
