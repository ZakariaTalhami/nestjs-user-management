import {
    IsNotEmpty,
    IsString,
    IsArray,
    IsMongoId,
    IsOptional,
    ArrayNotEmpty,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateSystemRoleDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    displayName: string;

    @IsArray()
    @ArrayNotEmpty()
    @IsMongoId({ each: true })
    permissions: Types.ObjectId[];

    @IsMongoId()
    @IsOptional()
    app: Types.ObjectId;
}
