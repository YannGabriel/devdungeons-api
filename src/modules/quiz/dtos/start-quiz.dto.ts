import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsUUID } from "class-validator";

export class StartQuizDto {
    @ApiProperty({ description: "ID da linguagem de programação", example: "uuid" })
    @IsNotEmpty()
    @IsUUID()
    language_id: string;

    @ApiPropertyOptional({ description: "ID do nível de conhecimento (Básico, Intermediário, Avançado)", example: "uuid" })
    @IsOptional()
    @IsUUID()
    level_id?: string;
}
