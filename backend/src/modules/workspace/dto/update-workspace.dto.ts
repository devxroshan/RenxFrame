import { IsNotEmpty, IsString } from "class-validator";

export class UpdateWorkspaceDto {
    @IsString()
    @IsNotEmpty()
    fieldName: string;

    @IsString()
    @IsNotEmpty()
    fieldValue: string;
}