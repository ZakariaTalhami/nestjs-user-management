import { IsNotEmpty, IsString, IsIn, IsOptional } from 'class-validator';
import { Resource } from 'src/common/enums';

export class CreatePermissionDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsIn(Object.values(Resource))
    resource: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    description: string;
}