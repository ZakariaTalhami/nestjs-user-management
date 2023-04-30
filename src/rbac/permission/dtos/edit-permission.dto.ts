import { IsNotEmpty, IsString, IsIn, IsOptional } from 'class-validator';
import { Resource } from 'src/common/enums';

export class EditPermissionDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsOptional()
    @IsString()
    @IsIn(Object.values(Resource))
    resource: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    description: string;
}