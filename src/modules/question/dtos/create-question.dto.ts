import {
    ArrayMaxSize,
    ArrayMinSize,
    IsArray,
    IsBoolean,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUUID,
    ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

export const ALTERNATIVES_PER_QUESTION = 5;

export class CreateAlternativeInputDTO {
    @IsNotEmpty()
    @IsString()
    descricao: string;

    @IsBoolean()
    correta: boolean;
}

export class CreateQuestionDTO {
    @IsNotEmpty()
    @IsString()
    enunciado: string;

    @IsNotEmpty()
    @IsUUID()
    language_id: string;

    @IsOptional()
    @IsUUID()
    level_id?: string;

    @IsArray()
    @ArrayMinSize(ALTERNATIVES_PER_QUESTION)
    @ArrayMaxSize(ALTERNATIVES_PER_QUESTION)
    @ValidateNested({ each: true })
    @Type(() => CreateAlternativeInputDTO)
    alternatives: CreateAlternativeInputDTO[];
}
