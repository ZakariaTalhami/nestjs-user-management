import { Body, Controller, Post } from '@nestjs/common';
import { SignupUserDto } from './dto/create-cate.dto';
import { User } from './schemas/user.schema';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService){} 

    @Post("signup")
    async singup(@Body() singupUser: SignupUserDto): Promise<User> {
        return this.usersService.signupUser(singupUser);
    }    
}
