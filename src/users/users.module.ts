import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { genSalt, hash } from 'bcrypt';
import { AppModule } from 'src/app/app.module';
import { Query, UpdateQuery } from 'mongoose';

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

          schema.pre<UpdateQuery<User>>('findOneAndUpdate', async function () {
            const update = this.getUpdate();
            if(update.password) {
              const salt = await genSalt(10);
              const hashedPassword = await hash(update.password, salt);
  
              update.password = hashedPassword;
            }
            this.setUpdate(update)
          });

          return schema;
        },
      },
    ]),
    AppModule
  ],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
