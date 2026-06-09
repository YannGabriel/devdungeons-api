import {
    Injectable,
    Logger,
    NotFoundException,
    BadRequestException,
} from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { QuestionEntity } from "./entity/question.entity";
import { AlternativeEntity } from "./entity/alternative.entity";
import { ProgrammingLanguageEntity } from "../programming-language/entity/programming-language.entity";
import { KnowledgeLevelEntity } from "../knowledge-level/entity/knowledge-level.entity";
import { UserService } from "../user/user.service";
import {
    CreateQuestionDTO,
    CreateAlternativeInputDTO,
    ALTERNATIVES_PER_QUESTION,
} from "./dtos/create-question.dto";
import { UpdateQuestionDTO } from "./dtos/update-question.dto";
import { UpdateAlternativeDTO } from "./dtos/update-alternative.dto";

@Injectable()
export class QuestionService {
    private readonly logger = new Logger(QuestionService.name);

    constructor(
        @InjectRepository(QuestionEntity)
        private readonly questionRepository: Repository<QuestionEntity>,
        @InjectRepository(AlternativeEntity)
        private readonly alternativeRepository: Repository<AlternativeEntity>,
        @InjectRepository(ProgrammingLanguageEntity)
        private readonly languageRepository: Repository<ProgrammingLanguageEntity>,
        @InjectRepository(KnowledgeLevelEntity)
        private readonly levelRepository: Repository<KnowledgeLevelEntity>,
        private readonly userService: UserService,
    ) {}

    async findAll(): Promise<QuestionEntity[]> {
        return this.questionRepository.find({
            relations: { language: true, level: true, alternatives: true },
            order: { created_at: "DESC" },
        });
    }

    async findById(id: string): Promise<QuestionEntity> {
        const question = await this.questionRepository.findOne({
            where: { id },
            relations: { language: true, level: true, alternatives: true },
        });
        if (!question) throw new NotFoundException(`Questão ${id} não encontrada`);
        return question;
    }

    async findByLanguage(languageId: string): Promise<QuestionEntity[]> {
        await this.ensureLanguageExists(languageId);
        return this.questionRepository.find({
            where: { language_id: languageId },
            relations: { language: true, level: true, alternatives: true },
            order: { created_at: "DESC" },
        });
    }

    async findByLevel(levelId: string): Promise<QuestionEntity[]> {
        await this.ensureLevelExists(levelId);
        return this.questionRepository.find({
            where: { level_id: levelId },
            relations: { language: true, level: true, alternatives: true },
            order: { created_at: "DESC" },
        });
    }

    async create(data: CreateQuestionDTO): Promise<QuestionEntity> {
        this.validateAlternatives(data.alternatives);
        await this.ensureLanguageExists(data.language_id);
        if (data.level_id) await this.ensureLevelExists(data.level_id);

        const question = this.questionRepository.create({
            enunciado: data.enunciado,
            language_id: data.language_id,
            level_id: data.level_id ?? null,
            alternatives: data.alternatives.map((alt) =>
                this.alternativeRepository.create({
                    descricao: alt.descricao,
                    correta: alt.correta,
                }),
            ),
        });

        const saved = await this.questionRepository.save(question);
        this.logger.log(`Questão criada: ${saved.id}`);
        return this.findById(saved.id);
    }

    async update(id: string, data: UpdateQuestionDTO): Promise<QuestionEntity> {
        const question = await this.findById(id);

        if (data.language_id) {
            await this.ensureLanguageExists(data.language_id);
            question.language_id = data.language_id;
        }
        if (data.level_id !== undefined) {
            if (data.level_id) await this.ensureLevelExists(data.level_id);
            question.level_id = data.level_id || null;
        }
        if (data.enunciado !== undefined) question.enunciado = data.enunciado;

        await this.questionRepository.save(question);
        this.logger.log(`Questão ${id} atualizada`);
        return this.findById(id);
    }

    async remove(id: string): Promise<void> {
        const question = await this.findById(id);
        await this.questionRepository.remove(question);
        this.logger.log(`Questão ${id} removida`);
    }

    async checkAnswer(questionId: string, alternativeId: string, userId?: string) {
        const question = await this.findById(questionId);

        const chosen = question.alternatives.find((alt) => alt.id === alternativeId);
        if (!chosen) {
            throw new BadRequestException(
                `Alternativa ${alternativeId} não pertence à questão ${questionId}`,
            );
        }

        const correctAlternative = question.alternatives.find((alt) => alt.correta);
        const questionXp = question.level?.xp ?? 0;
        const xpEarned = chosen.correta ? questionXp : 0;

        let userUpdate: unknown = null;
        if (userId && xpEarned > 0) {
            userUpdate = await this.userService.updateUserExperience(userId, xpEarned);
        }

        return {
            question_id: questionId,
            chosen_alternative_id: alternativeId,
            correct: chosen.correta,
            correct_alternative_id: correctAlternative?.id ?? null,
            question_xp: questionXp,
            xp_earned: xpEarned,
            user_update: userUpdate,
        };
    }

    // ----- CRUD de Alternativas -----

    async findAlternatives(questionId: string): Promise<AlternativeEntity[]> {
        await this.findById(questionId);
        return this.alternativeRepository.find({
            where: { question_id: questionId },
            order: { created_at: "ASC" },
        });
    }

    async addAlternative(
        questionId: string,
        data: CreateAlternativeInputDTO,
    ): Promise<AlternativeEntity> {
        const question = await this.findById(questionId);

        if (question.alternatives.length >= ALTERNATIVES_PER_QUESTION) {
            throw new BadRequestException(
                `Uma questão deve possuir exatamente ${ALTERNATIVES_PER_QUESTION} alternativas`,
            );
        }
        if (data.correta && question.alternatives.some((alt) => alt.correta)) {
            throw new BadRequestException("A questão já possui uma alternativa correta");
        }

        const alternative = this.alternativeRepository.create({
            question_id: questionId,
            descricao: data.descricao,
            correta: data.correta,
        });
        const saved = await this.alternativeRepository.save(alternative);
        this.logger.log(`Alternativa ${saved.id} adicionada à questão ${questionId}`);
        return saved;
    }

    async updateAlternative(
        alternativeId: string,
        data: UpdateAlternativeDTO,
    ): Promise<AlternativeEntity> {
        const alternative = await this.alternativeRepository.findOne({
            where: { id: alternativeId },
        });
        if (!alternative) {
            throw new NotFoundException(`Alternativa ${alternativeId} não encontrada`);
        }

        if (data.descricao !== undefined) alternative.descricao = data.descricao;

        if (data.correta !== undefined) {
            if (data.correta) {
                await this.alternativeRepository.update(
                    { question_id: alternative.question_id },
                    { correta: false },
                );
            }
            alternative.correta = data.correta;
        }

        const saved = await this.alternativeRepository.save(alternative);
        this.logger.log(`Alternativa ${alternativeId} atualizada`);
        return saved;
    }

    async removeAlternative(alternativeId: string): Promise<void> {
        const alternative = await this.alternativeRepository.findOne({
            where: { id: alternativeId },
        });
        if (!alternative) {
            throw new NotFoundException(`Alternativa ${alternativeId} não encontrada`);
        }

        const count = await this.alternativeRepository.count({
            where: { question_id: alternative.question_id },
        });

        // Correção: impede remoção somente se a questão ficaria com menos de 5 alternativas
        if (count <= ALTERNATIVES_PER_QUESTION) {
            throw new BadRequestException(
                `Não é possível remover: adicione uma alternativa substituta antes de remover esta`,
            );
        }

        await this.alternativeRepository.remove(alternative);
        this.logger.log(`Alternativa ${alternativeId} removida`);
    }

    // ----- Validações internas -----

    private validateAlternatives(alternatives: CreateAlternativeInputDTO[]): void {
        if (alternatives.length !== ALTERNATIVES_PER_QUESTION) {
            throw new BadRequestException(
                `Cada questão deve possuir exatamente ${ALTERNATIVES_PER_QUESTION} alternativas`,
            );
        }
        const correctCount = alternatives.filter((alt) => alt.correta).length;
        if (correctCount !== 1) {
            throw new BadRequestException(
                "Cada questão deve possuir exatamente 1 alternativa correta",
            );
        }
    }

    private async ensureLanguageExists(languageId: string): Promise<void> {
        const exists = await this.languageRepository.exists({ where: { id: languageId } });
        if (!exists) throw new NotFoundException(`Linguagem ${languageId} não encontrada`);
    }

    private async ensureLevelExists(levelId: string): Promise<void> {
        const exists = await this.levelRepository.exists({ where: { id: levelId } });
        if (!exists) throw new NotFoundException(`Nível ${levelId} não encontrado`);
    }
}
