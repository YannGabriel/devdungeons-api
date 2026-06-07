import { IsNotEmpty, IsOptional, IsUUID } from "class-validator";

export class AnswerQuestionDTO {
    @IsNotEmpty()
    @IsUUID()
    alternative_id: string;

    /**
     * Opcional. Se informado e a resposta estiver correta, o XP da questão
     * é creditado ao usuário (sistema de experiência/nível existente).
     */
    @IsOptional()
    @IsUUID()
    user_id?: string;
}
