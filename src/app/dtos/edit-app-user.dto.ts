import { IsMongoId } from "class-validator";
import { Types } from "mongoose";

export class EditAppUserDto {
    @IsMongoId()
    role: Types.ObjectId
}