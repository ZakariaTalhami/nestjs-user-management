
import {
    IsNotEmpty,
    IsString,
    IsArray,
    IsMongoId,
    IsOptional,
    ArrayNotEmpty,
} from 'class-validator';
import { Types } from 'mongoose';

export class UpdateRoleDto {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    name: string;
    
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    displayName: string;
    
    @IsArray()
    @ArrayNotEmpty()
    @IsOptional()
    @IsMongoId({ each: true })
    permissions: Types.ObjectId[];
}
