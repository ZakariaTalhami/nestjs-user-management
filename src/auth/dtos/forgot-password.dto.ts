import { IsEmail, IsString, IsStrongPassword } from "class-validator";
import { Match } from "src/common/decorators/match.decorator";

export class ForgotPasswordDto {
    @IsEmail()
    email: string
}

export class ResetPasswordDto {
    @IsString()
    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1, 
        minSymbols: 1
    })
    password: string;

    @Match('password')
    @IsString()
    confirmPassword: string
}