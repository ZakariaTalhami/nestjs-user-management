import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SignupUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private usersModel: Model<UserDocument>) {}

  async signupUser(userDto: SignupUserDto): Promise<User> {
    if(await this.findUserByEmail(userDto.email)) {
        throw new ConflictException(`Email [${userDto.email}] already register`);
    } 

    const createdUser = new this.usersModel(userDto);
    return createdUser.save();
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.usersModel.findOne({email})
  }
}
