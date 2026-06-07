import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
} from "@nestjs/common";
import { QuestionService } from "./question.service";
import { CreateQuestionDTO, CreateAlternativeInputDTO } from "./dtos/create-question.dto";
import { UpdateQuestionDTO } from "./dtos/update-question.dto";
import { UpdateAlternativeDTO } from "./dtos/update-alternative.dto";
import { AnswerQuestionDTO } from "./dtos/answer-question.dto";

@Controller("/questions")
export class QuestionController {
    constructor(private readonly questionService: QuestionService) {}

    @Get()
    async findAll() {
        return this.questionService.findAll();
    }

    @Get("by-language/:languageId")
    async findByLanguage(@Param("languageId") languageId: string) {
        return this.questionService.findByLanguage(languageId);
    }

    @Get("by-level/:levelId")
    async findByLevel(@Param("levelId") levelId: string) {
        return this.questionService.findByLevel(levelId);
    }

    @Get(":id")
    async findById(@Param("id") id: string) {
        return this.questionService.findById(id);
    }

    @Post()
    async create(@Body() data: CreateQuestionDTO) {
        return this.questionService.create(data);
    }

    @Patch(":id")
    async update(@Param("id") id: string, @Body() data: UpdateQuestionDTO) {
        return this.questionService.update(id, data);
    }

    @Delete(":id")
    async remove(@Param("id") id: string) {
        await this.questionService.remove(id);
        return { message: `Questão ${id} removida com sucesso` };
    }

    // Verifica se a resposta do usuário está correta
    @Post(":id/answer")
    async checkAnswer(@Param("id") id: string, @Body() data: AnswerQuestionDTO) {
        return this.questionService.checkAnswer(id, data.alternative_id, data.user_id);
    }

    // ----- CRUD de Alternativas -----

    @Get(":id/alternatives")
    async findAlternatives(@Param("id") id: string) {
        return this.questionService.findAlternatives(id);
    }

    @Post(":id/alternatives")
    async addAlternative(
        @Param("id") id: string,
        @Body() data: CreateAlternativeInputDTO,
    ) {
        return this.questionService.addAlternative(id, data);
    }

    @Patch("alternatives/:alternativeId")
    async updateAlternative(
        @Param("alternativeId") alternativeId: string,
        @Body() data: UpdateAlternativeDTO,
    ) {
        return this.questionService.updateAlternative(alternativeId, data);
    }

    @Delete("alternatives/:alternativeId")
    async removeAlternative(@Param("alternativeId") alternativeId: string) {
        await this.questionService.removeAlternative(alternativeId);
        return { message: `Alternativa ${alternativeId} removida com sucesso` };
    }
}
