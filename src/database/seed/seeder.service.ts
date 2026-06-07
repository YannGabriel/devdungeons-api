import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProgrammingLanguageEntity } from "../../modules/programming-language/entity/programming-language.entity";
import { KnowledgeLevelEntity } from "../../modules/knowledge-level/entity/knowledge-level.entity";
import { QuestionEntity } from "../../modules/question/entity/question.entity";
import { AlternativeEntity } from "../../modules/question/entity/alternative.entity";
import { LEVELS, LevelName, SeedQuestion } from "./seed.types";
import { LANGUAGE_SEEDS } from "./data";

/**
 * Popula o banco automaticamente na inicialização da aplicação.
 *
 * É idempotente: cada parte (linguagem x nível) só é semeada se ainda não
 * possuir questões, então pode rodar a cada boot com `synchronize: true`
 * sem duplicar dados.
 */
@Injectable()
export class SeederService implements OnApplicationBootstrap {
    private readonly logger = new Logger(SeederService.name);

    constructor(
        @InjectRepository(ProgrammingLanguageEntity)
        private readonly languageRepository: Repository<ProgrammingLanguageEntity>,
        @InjectRepository(KnowledgeLevelEntity)
        private readonly levelRepository: Repository<KnowledgeLevelEntity>,
        @InjectRepository(QuestionEntity)
        private readonly questionRepository: Repository<QuestionEntity>,
        @InjectRepository(AlternativeEntity)
        private readonly alternativeRepository: Repository<AlternativeEntity>,
    ) {}

    async onApplicationBootstrap(): Promise<void> {
        this.logger.log("Iniciando seed do módulo de Quiz...");

        const levels = await this.seedLevels();
        let createdQuestions = 0;

        for (const languageSeed of LANGUAGE_SEEDS) {
            const language = await this.ensureLanguage(languageSeed.language);

            for (const level of levels) {
                const questions = languageSeed.niveis[level.name as LevelName] ?? [];
                if (questions.length === 0) continue;

                const existing = await this.questionRepository.count({
                    where: { language_id: language.id, level_id: level.id },
                });
                if (existing > 0) continue; // parte já semeada

                await this.seedQuestions(language.id, level.id, questions);
                createdQuestions += questions.length;
                this.logger.log(
                    `Semeadas ${questions.length} questões de ${languageSeed.language} (${level.name})`,
                );
            }
        }

        if (createdQuestions === 0) {
            this.logger.log("Seed concluído: nenhuma questão nova necessária.");
        } else {
            this.logger.log(`Seed concluído: ${createdQuestions} questões criadas.`);
        }
    }

    /** Garante a existência dos níveis com seus respectivos valores de XP. */
    private async seedLevels(): Promise<KnowledgeLevelEntity[]> {
        const result: KnowledgeLevelEntity[] = [];

        for (const seed of LEVELS) {
            let level = await this.levelRepository.findOne({
                where: { name: seed.name },
            });

            if (!level) {
                level = await this.levelRepository.save(
                    this.levelRepository.create({ name: seed.name, xp: seed.xp }),
                );
            } else if (level.xp !== seed.xp) {
                level.xp = seed.xp;
                level = await this.levelRepository.save(level);
            }

            result.push(level);
        }

        return result;
    }

    /** Garante a existência de uma linguagem pelo nome. */
    private async ensureLanguage(name: string): Promise<ProgrammingLanguageEntity> {
        const existing = await this.languageRepository.findOne({ where: { name } });
        if (existing) return existing;

        return this.languageRepository.save(this.languageRepository.create({ name }));
    }

    /** Cria as questões de uma parte (linguagem x nível) com 5 alternativas cada. */
    private async seedQuestions(
        languageId: string,
        levelId: string,
        questions: SeedQuestion[],
    ): Promise<void> {
        const entities = questions.map((q, index) => {
            const options = this.buildAlternatives(q, index);
            return this.questionRepository.create({
                enunciado: q.enunciado,
                language_id: languageId,
                level_id: levelId,
                alternatives: options.map((opt) =>
                    this.alternativeRepository.create({
                        descricao: opt.descricao,
                        correta: opt.correta,
                    }),
                ),
            });
        });

        await this.questionRepository.save(entities);
    }

    /**
     * Monta as 5 alternativas (1 correta + 4 incorretas), posicionando a correta
     * em índices variados de forma determinística — sem sempre ser a primeira.
     */
    private buildAlternatives(question: SeedQuestion, index: number) {
        const options = question.incorretas.map((descricao) => ({
            descricao,
            correta: false,
        }));
        const position = index % (question.incorretas.length + 1);
        options.splice(position, 0, { descricao: question.correta, correta: true });
        return options;
    }
}
