import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppService } from 'src/app/app.service';
import { SignupUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private usersModel: Model<UserDocument>,
        private appService: AppService,
    ) {}

    async signupUser(userDto: SignupUserDto): Promise<User> {
        if (await this.findUserByEmail(userDto.email)) {
            throw new ConflictException(
                `Email [${userDto.email}] already registered`,
            );
        }

        const createdUser = await this.usersModel.create(userDto);
        this.appService.create({ owner: createdUser._id });
        return createdUser;
    }

    async findUserByEmail(email: string): Promise<UserDocument | null> {
        return this.usersModel.findOne({ email });
    }

    async findUserByEmailOrThrow(email: string): Promise<UserDocument> {
        const user = await this.findUserByEmail(email);

        if (!user) {
            throw new NotFoundException(`User ${email} Not Found`);
        }

        return user;
    }

    async findUserById(userId: string): Promise<UserDocument | null> {
        return this.usersModel.findById(userId);
    }

    async resetPasswordById(userId: string, password: string) {
        return this.usersModel.findByIdAndUpdate(userId, { password })
    }
}
