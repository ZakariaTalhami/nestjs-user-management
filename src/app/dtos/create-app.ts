import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateAppDto {
    @IsString()
    name?: string;
    @IsString()
    @IsMongoId()
    owner: Types.ObjectId;
}

export class CreateSecondaryAppDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsMongoId()
    @IsOptional()
    owner: Types.ObjectId;
}
