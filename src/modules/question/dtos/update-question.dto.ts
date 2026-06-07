import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class UpdateQuestionDTO {
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    enunciado?: string;

    @IsOptional()
    @IsUUID()
    language_id?: string;

    @IsOptional()
    @IsUUID()
    level_id?: string;
}
