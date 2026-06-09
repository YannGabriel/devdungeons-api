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
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export const ALTERNATIVES_PER_QUESTION = 5;

export class CreateAlternativeInputDTO {
    @ApiProperty({ example: "console.log()" })
    @IsNotEmpty()
    @IsString()
    descricao: string;

    @ApiProperty({ example: false })
    @IsBoolean()
    correta: boolean;
}

export class CreateQuestionDTO {
    @ApiProperty({ example: "Qual método exibe uma mensagem no console?" })
    @IsNotEmpty()
    @IsString()
    enunciado: string;

    @ApiProperty({ example: "uuid", description: "ID da linguagem de programação" })
    @IsNotEmpty()
    @IsUUID()
    language_id: string;

    @ApiPropertyOptional({ example: "uuid", description: "ID do nível de conhecimento" })
    @IsOptional()
    @IsUUID()
    level_id?: string;

    @ApiProperty({
        type: [CreateAlternativeInputDTO],
        description: `Exatamente ${ALTERNATIVES_PER_QUESTION} alternativas, sendo exatamente 1 com correta: true`,
    })
    @IsArray()
    @ArrayMinSize(ALTERNATIVES_PER_QUESTION)
    @ArrayMaxSize(ALTERNATIVES_PER_QUESTION)
    @ValidateNested({ each: true })
    @Type(() => CreateAlternativeInputDTO)
    alternatives: CreateAlternativeInputDTO[];
}
