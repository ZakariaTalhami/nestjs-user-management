import { IsEmail, IsString, IsStrongPassword, MaxLength } from "class-validator";

export class SignupUserDto {
    @IsString()
    @MaxLength(64) 
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1, 
        minSymbols: 1
    })
    password: string
}