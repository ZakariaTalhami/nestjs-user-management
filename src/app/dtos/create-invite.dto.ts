import { IsDate, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateInviteDto {
    @IsMongoId()
    app: Types.ObjectId;

    @IsString()
    @IsNotEmpty()
    email: string;

    @IsMongoId()
    role: Types.ObjectId


    @IsDate()
    @IsOptional()
    expire?: Date
}
