import { IsEmail, IsMongoId } from 'class-validator';

export class InviteUserToAppDto {
    @IsEmail()
    email: string;

    @IsMongoId()
    role: string
}
