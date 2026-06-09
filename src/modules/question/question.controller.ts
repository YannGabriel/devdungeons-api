import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Post,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { QuestionService } from "./question.service";
import { CreateQuestionDTO, CreateAlternativeInputDTO } from "./dtos/create-question.dto";
import { UpdateQuestionDTO } from "./dtos/update-question.dto";
import { UpdateAlternativeDTO } from "./dtos/update-alternative.dto";
import { AnswerQuestionDTO } from "./dtos/answer-question.dto";
import { Public } from "../../auth/decorators/public.decorator";
import { CurrentUser } from "../../auth/decorators/current-user.decorator";

@ApiTags("Questions")
@ApiBearerAuth()
@Controller("/questions")
export class QuestionController {
    constructor(private readonly questionService: QuestionService) {}

    // ── Leitura pública ──────────────────────────────────────────────────────

    @Public()
    @Get()
    @ApiOperation({ summary: "Listar todas as questões" })
    @ApiResponse({ status: 200, description: "Lista de questões com alternativas e relações" })
    async findAll() {
        return this.questionService.findAll();
    }

    @Public()
    @Get("by-language/:languageId")
    @ApiOperation({ summary: "Buscar questões por linguagem" })
    @ApiResponse({ status: 200, description: "Questões da linguagem" })
    @ApiResponse({ status: 404, description: "Linguagem não encontrada" })
    async findByLanguage(@Param("languageId") languageId: string) {
        return this.questionService.findByLanguage(languageId);
    }

    @Public()
    @Get("by-level/:levelId")
    @ApiOperation({ summary: "Buscar questões por nível" })
    @ApiResponse({ status: 200, description: "Questões do nível" })
    @ApiResponse({ status: 404, description: "Nível não encontrado" })
    async findByLevel(@Param("levelId") levelId: string) {
        return this.questionService.findByLevel(levelId);
    }

    @Public()
    @Get(":id")
    @ApiOperation({ summary: "Buscar questão por ID" })
    @ApiResponse({ status: 200, description: "Questão com alternativas" })
    @ApiResponse({ status: 404, description: "Questão não encontrada" })
    async findById(@Param("id") id: string) {
        return this.questionService.findById(id);
    }

    @Public()
    @Get(":id/alternatives")
    @ApiOperation({ summary: "Listar alternativas de uma questão" })
    @ApiResponse({ status: 200, description: "Alternativas ordenadas por created_at ASC" })
    @ApiResponse({ status: 404, description: "Questão não encontrada" })
    async findAlternatives(@Param("id") id: string) {
        return this.questionService.findAlternatives(id);
    }

    // ── Mutações protegidas ──────────────────────────────────────────────────

    @Post()
    @ApiOperation({ summary: "Criar questão com 5 alternativas" })
    @ApiResponse({ status: 201, description: "Questão criada" })
    @ApiResponse({ status: 400, description: "Validação falhou (5 alternativas, 1 correta)" })
    @ApiResponse({ status: 404, description: "Linguagem ou nível não encontrado" })
    async create(@Body() data: CreateQuestionDTO) {
        return this.questionService.create(data);
    }

    @Patch(":id")
    @ApiOperation({ summary: "Atualizar enunciado, linguagem ou nível da questão" })
    @ApiResponse({ status: 200, description: "Questão atualizada" })
    @ApiResponse({ status: 404, description: "Questão não encontrada" })
    async update(@Param("id") id: string, @Body() data: UpdateQuestionDTO) {
        return this.questionService.update(id, data);
    }

    @Delete(":id")
    @ApiOperation({ summary: "Remover questão (cascade nas alternativas)" })
    @ApiResponse({ status: 200, description: "Questão removida" })
    @ApiResponse({ status: 404, description: "Questão não encontrada" })
    async remove(@Param("id") id: string) {
        await this.questionService.remove(id);
        return { message: `Questão ${id} removida com sucesso` };
    }

    @Post(":id/answer")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Responder uma questão — credita XP automaticamente ao usuário autenticado" })
    @ApiResponse({
        status: 200,
        description: "Resultado da resposta",
        schema: {
            example: {
                question_id: "uuid",
                chosen_alternative_id: "uuid",
                correct: true,
                correct_alternative_id: "uuid",
                question_xp: 50,
                xp_earned: 50,
                user_update: { message: "XP atualizado para 50" },
            },
        },
    })
    @ApiResponse({ status: 400, description: "Alternativa não pertence à questão" })
    @ApiResponse({ status: 404, description: "Questão não encontrada" })
    async checkAnswer(
        @Param("id") id: string,
        @Body() data: AnswerQuestionDTO,
        @CurrentUser("userId") userId: string,
    ) {
        return this.questionService.checkAnswer(id, data.alternative_id, userId);
    }

    // ── CRUD de Alternativas ─────────────────────────────────────────────────

    @Post(":id/alternatives")
    @ApiOperation({ summary: "Adicionar alternativa a uma questão (máx. 5)" })
    @ApiResponse({ status: 201, description: "Alternativa adicionada" })
    @ApiResponse({ status: 400, description: "Questão já tem 5 alternativas ou já tem 1 correta" })
    async addAlternative(
        @Param("id") id: string,
        @Body() data: CreateAlternativeInputDTO,
    ) {
        return this.questionService.addAlternative(id, data);
    }

    @Patch("alternatives/:alternativeId")
    @ApiOperation({ summary: "Atualizar alternativa (marcar como correta desmarca as outras)" })
    @ApiResponse({ status: 200, description: "Alternativa atualizada" })
    @ApiResponse({ status: 404, description: "Alternativa não encontrada" })
    async updateAlternative(
        @Param("alternativeId") alternativeId: string,
        @Body() data: UpdateAlternativeDTO,
    ) {
        return this.questionService.updateAlternative(alternativeId, data);
    }

    @Delete("alternatives/:alternativeId")
    @ApiOperation({ summary: "Remover alternativa (somente se a questão tiver mais de 5)" })
    @ApiResponse({ status: 200, description: "Alternativa removida" })
    @ApiResponse({ status: 400, description: "Questão não pode ficar com menos de 5 alternativas" })
    @ApiResponse({ status: 404, description: "Alternativa não encontrada" })
    async removeAlternative(@Param("alternativeId") alternativeId: string) {
        await this.questionService.removeAlternative(alternativeId);
        return { message: `Alternativa ${alternativeId} removida com sucesso` };
    }
}
