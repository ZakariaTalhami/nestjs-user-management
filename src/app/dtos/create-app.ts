import { Types } from "mongoose";

export class CreateAppDto {
    name?: string;
    owner: Types.ObjectId
}