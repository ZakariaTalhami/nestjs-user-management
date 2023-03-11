import { Body, Controller, Post, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { SignupUserDto } from './dto/create-cate.dto';
import { User } from './schemas/user.schema';
import { UsersService } from './users.service';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService){} 

    @Post("signup")
    async singup(@Body() singupUser: SignupUserDto): Promise<User> {
        return this.usersService.signupUser(singupUser);
    }    
}
