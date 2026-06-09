import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { QuizService } from "./quiz.service";
import { StartQuizDto } from "./dtos/start-quiz.dto";
import { AnswerQuizDto } from "./dtos/answer-quiz.dto";
import { CurrentUser } from "../../auth/decorators/current-user.decorator";

@ApiTags("Quiz")
@ApiBearerAuth()
@Controller("/quiz")
export class QuizController {
    constructor(private readonly quizService: QuizService) {}

    @Post("start")
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
        summary: "Iniciar sessão de quiz",
        description:
            "Cria uma fila de até 10 questões aleatórias para a linguagem/nível informado. " +
            "Se já houver uma sessão ativa para o mesmo par, ela é retomada automaticamente. " +
            "As alternativas são retornadas SEM o campo `correta` para não revelar as respostas.",
    })
    @ApiResponse({
        status: 201,
        description: "Sessão criada/retomada",
        schema: {
            example: {
                session_id: "uuid",
                status: "IN_PROGRESS",
                language: { id: "uuid", name: "JavaScript" },
                level: { id: "uuid", name: "Básico", xp: 50 },
                progress: {
                    questions_answered: 0,
                    questions_total: 10,
                    current_score: 0,
                    total_xp_earned: 0,
                    accuracy_percentage: 0,
                    current_question_order: 1,
                    is_complete: false,
                    completed_at: null,
                },
                questions: [
                    {
                        order: 1,
                        question_id: "uuid",
                        enunciado: "Qual palavra-chave declara uma variável com escopo de bloco?",
                        alternatives: [
                            { id: "uuid", descricao: "var" },
                            { id: "uuid", descricao: "let" },
                            { id: "uuid", descricao: "const" },
                            { id: "uuid", descricao: "def" },
                            { id: "uuid", descricao: "declare" },
                        ],
                        answered: false,
                        your_answer: null,
                        correct: null,
                        correct_alternative_id: null,
                        xp_earned: 0,
                        answered_at: null,
                    },
                ],
            },
        },
    })
    @ApiResponse({ status: 400, description: "Questões insuficientes para iniciar o quiz" })
    @ApiResponse({ status: 404, description: "Linguagem ou nível não encontrado" })
    @ApiResponse({ status: 401, description: "Não autenticado" })
    async startQuiz(
        @Body() dto: StartQuizDto,
        @CurrentUser("userId") userId: string,
    ) {
        return this.quizService.startQuiz(userId, dto);
    }

    @Post(":sessionId/answer")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: "Responder uma questão da sessão",
        description:
            "Registra a resposta do usuário para uma questão. " +
            "Após a última questão, a sessão é finalizada e o XP total é creditado ao usuário. " +
            "Retorna feedback imediato + próxima questão (ou resultados finais se completou).",
    })
    @ApiResponse({
        status: 200,
        description: "Resultado da resposta",
        schema: {
            example: {
                question_order: 3,
                correct: true,
                correct_alternative_id: "uuid",
                xp_earned: 50,
                session: {
                    id: "uuid",
                    questions_answered: 3,
                    questions_total: 10,
                    current_score: 2,
                    total_xp_earned: 100,
                    is_complete: false,
                    next_question_order: 4,
                    completed_at: null,
                },
                final_results: null,
            },
        },
    })
    @ApiResponse({
        status: 200,
        description: "Resultado da última resposta (sessão completa)",
        schema: {
            example: {
                question_order: 10,
                correct: false,
                correct_alternative_id: "uuid",
                xp_earned: 0,
                session: {
                    id: "uuid",
                    questions_answered: 10,
                    questions_total: 10,
                    current_score: 7,
                    total_xp_earned: 350,
                    is_complete: true,
                    next_question_order: null,
                    completed_at: "2024-01-01T12:00:00.000Z",
                },
                final_results: {
                    correct_answers: 7,
                    wrong_answers: 3,
                    accuracy_percentage: 70,
                    total_xp_earned: 350,
                    questions_summary: [
                        {
                            order: 1,
                            enunciado: "...",
                            your_answer_id: "uuid",
                            correct_answer_id: "uuid",
                            correct: true,
                            xp_earned: 50,
                        },
                    ],
                },
            },
        },
    })
    @ApiResponse({ status: 400, description: "Questão já respondida / alternativa inválida / sessão finalizada" })
    @ApiResponse({ status: 403, description: "Esta sessão pertence a outro usuário" })
    @ApiResponse({ status: 404, description: "Sessão não encontrada" })
    async answerQuestion(
        @Param("sessionId") sessionId: string,
        @Body() dto: AnswerQuizDto,
        @CurrentUser("userId") userId: string,
    ) {
        return this.quizService.answerQuestion(userId, sessionId, dto);
    }

    @Get("history")
    @ApiOperation({
        summary: "Histórico de sessões do usuário",
        description: "Lista todas as sessões (concluídas e em andamento) do usuário autenticado.",
    })
    @ApiResponse({
        status: 200,
        description: "Lista de sessões",
        schema: {
            example: [
                {
                    id: "uuid",
                    status: "COMPLETED",
                    language: { id: "uuid", name: "JavaScript" },
                    level: { id: "uuid", name: "Básico", xp: 50 },
                    score: 7,
                    total_questions: 10,
                    accuracy_percentage: 70,
                    total_xp_earned: 350,
                    started_at: "2024-01-01T12:00:00.000Z",
                    completed_at: "2024-01-01T12:10:00.000Z",
                },
            ],
        },
    })
    async getUserHistory(@CurrentUser("userId") userId: string) {
        return this.quizService.getUserHistory(userId);
    }

    @Get(":sessionId")
    @ApiOperation({
        summary: "Estado atual de uma sessão",
        description:
            "Retorna a sessão completa com todas as questões e respostas. " +
            "Para questões ainda não respondidas, `correta` é omitido nas alternativas.",
    })
    @ApiResponse({ status: 200, description: "Sessão completa" })
    @ApiResponse({ status: 403, description: "Acesso negado" })
    @ApiResponse({ status: 404, description: "Sessão não encontrada" })
    async getSession(
        @Param("sessionId") sessionId: string,
        @CurrentUser("userId") userId: string,
    ) {
        return this.quizService.getSession(userId, sessionId);
    }
}
