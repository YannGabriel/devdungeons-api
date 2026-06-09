import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";

export class AnswerQuizDto {
    @ApiProperty({ description: "ID da questão sendo respondida", example: "uuid" })
    @IsNotEmpty()
    @IsUUID()
    question_id: string;

    @ApiProperty({ description: "ID da alternativa escolhida", example: "uuid" })
    @IsNotEmpty()
    @IsUUID()
    alternative_id: string;
}
