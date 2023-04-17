import { IsEmail } from 'class-validator';

export class InviteUserToAppDto {
    @IsEmail()
    email: string;
}
