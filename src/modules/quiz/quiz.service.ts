import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    Logger,
    NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Repository } from "typeorm";
import { QuizSessionEntity } from "./entity/quiz-session.entity";
import { QuizSessionQuestionEntity } from "./entity/quiz-session-question.entity";
import { QuizSessionStatus } from "./enums/quiz-session-status.enum";
import { QuestionEntity } from "../question/entity/question.entity";
import { ProgrammingLanguageEntity } from "../programming-language/entity/programming-language.entity";
import { KnowledgeLevelEntity } from "../knowledge-level/entity/knowledge-level.entity";
import { UserService } from "../user/user.service";
import { StartQuizDto } from "./dtos/start-quiz.dto";
import { AnswerQuizDto } from "./dtos/answer-quiz.dto";

export const QUESTIONS_PER_SESSION = 10;
const MIN_QUESTIONS_REQUIRED = 3;

@Injectable()
export class QuizService {
    private readonly logger = new Logger(QuizService.name);

    constructor(
        @InjectRepository(QuizSessionEntity)
        private readonly sessionRepo: Repository<QuizSessionEntity>,
        @InjectRepository(QuizSessionQuestionEntity)
        private readonly sessionQuestionRepo: Repository<QuizSessionQuestionEntity>,
        @InjectRepository(QuestionEntity)
        private readonly questionRepo: Repository<QuestionEntity>,
        @InjectRepository(ProgrammingLanguageEntity)
        private readonly languageRepo: Repository<ProgrammingLanguageEntity>,
        @InjectRepository(KnowledgeLevelEntity)
        private readonly levelRepo: Repository<KnowledgeLevelEntity>,
        private readonly userService: UserService,
    ) {}

    // ── Iniciar sessão ────────────────────────────────────────────────────────

    async startQuiz(userId: string, dto: StartQuizDto) {
        await this.ensureLanguageExists(dto.language_id);
        if (dto.level_id) await this.ensureLevelExists(dto.level_id);

        // Retoma sessão ativa se já existir para o mesmo par linguagem/nível
        const existingSession = await this.sessionRepo.findOne({
            where: {
                user_id: userId,
                language_id: dto.language_id,
                level_id: dto.level_id ?? IsNull(),
                status: QuizSessionStatus.IN_PROGRESS,
            },
            relations: {
                language: true,
                level: true,
                sessionQuestions: { question: { alternatives: true, level: true } },
            },
        });

        if (existingSession) {
            this.logger.log(`Retomando sessão ${existingSession.id} para usuário ${userId}`);
            return this.formatSessionResponse(existingSession);
        }

        // Seleciona questões aleatórias
        const qb = this.questionRepo
            .createQueryBuilder("q")
            .leftJoinAndSelect("q.alternatives", "alt")
            .leftJoinAndSelect("q.level", "level")
            .where("q.language_id = :languageId", { languageId: dto.language_id });

        if (dto.level_id) {
            qb.andWhere("q.level_id = :levelId", { levelId: dto.level_id });
        }

        const questions = await qb
            .orderBy("RANDOM()")
            .take(QUESTIONS_PER_SESSION)
            .getMany();

        if (questions.length < MIN_QUESTIONS_REQUIRED) {
            throw new BadRequestException(
                `Não há questões suficientes para iniciar o quiz (mínimo: ${MIN_QUESTIONS_REQUIRED}, disponíveis: ${questions.length})`,
            );
        }

        // Cria a sessão
        const session = await this.sessionRepo.save(
            this.sessionRepo.create({
                user_id: userId,
                language_id: dto.language_id,
                level_id: dto.level_id ?? null,
                status: QuizSessionStatus.IN_PROGRESS,
                score: 0,
                total_questions: questions.length,
                total_xp_earned: 0,
                completed_at: null,
            }),
        );

        // Cria os registros de questões da sessão
        const sessionQuestions = questions.map((q, i) =>
            this.sessionQuestionRepo.create({
                session_id: session.id,
                question_id: q.id,
                order: i + 1,
                chosen_alternative_id: null,
                correct: null,
                xp_earned: 0,
                answered_at: null,
            }),
        );
        await this.sessionQuestionRepo.save(sessionQuestions);

        // Recarrega para montar a resposta
        const fullSession = await this.loadSession(session.id, userId);
        this.logger.log(`Sessão ${session.id} iniciada para usuário ${userId}`);
        return this.formatSessionResponse(fullSession);
    }

    // ── Responder questão ─────────────────────────────────────────────────────

    async answerQuestion(userId: string, sessionId: string, dto: AnswerQuizDto) {
        const session = await this.loadSession(sessionId, userId);

        if (session.status === QuizSessionStatus.COMPLETED) {
            throw new BadRequestException("Esta sessão já foi finalizada");
        }

        // Localiza a questão na sessão
        const sq = session.sessionQuestions.find(
            (sq) => sq.question_id === dto.question_id,
        );
        if (!sq) {
            throw new BadRequestException("Esta questão não pertence à sessão informada");
        }
        if (sq.chosen_alternative_id !== null) {
            throw new BadRequestException("Esta questão já foi respondida nesta sessão");
        }

        // Valida e processa a resposta
        const question = sq.question;
        const chosen = question.alternatives.find((a) => a.id === dto.alternative_id);
        if (!chosen) {
            throw new BadRequestException("A alternativa informada não pertence a esta questão");
        }

        const correctAlt = question.alternatives.find((a) => a.correta);
        const isCorrect = chosen.correta;
        const xpEarned = isCorrect ? (question.level?.xp ?? 0) : 0;

        // Atualiza a questão da sessão
        sq.chosen_alternative_id = dto.alternative_id;
        sq.correct = isCorrect;
        sq.xp_earned = xpEarned;
        sq.answered_at = new Date();
        await this.sessionQuestionRepo.save(sq);

        // Atualiza pontuação da sessão
        if (isCorrect) session.score += 1;
        session.total_xp_earned += xpEarned;

        // Verifica se todas as questões foram respondidas
        const answeredCount = session.sessionQuestions.filter(
            (s) => s.id === sq.id || s.chosen_alternative_id !== null,
        ).length;
        const isSessionComplete = answeredCount === session.total_questions;

        if (isSessionComplete) {
            session.status = QuizSessionStatus.COMPLETED;
            session.completed_at = new Date();
            await this.sessionRepo.save(session);

            // Credita XP ao usuário de uma só vez ao final
            if (session.total_xp_earned > 0) {
                await this.userService.updateUserExperience(userId, session.total_xp_earned);
            }

            this.logger.log(
                `Sessão ${sessionId} finalizada. Score: ${session.score}/${session.total_questions}. XP: ${session.total_xp_earned}`,
            );

            return this.buildAnswerResponse(sq.order, isCorrect, correctAlt?.id ?? null, xpEarned, session, null, true);
        }

        await this.sessionRepo.save(session);

        // Próxima questão não respondida
        const nextSq = session.sessionQuestions
            .filter((s) => s.id !== sq.id && s.chosen_alternative_id === null)
            .sort((a, b) => a.order - b.order)[0];

        return this.buildAnswerResponse(sq.order, isCorrect, correctAlt?.id ?? null, xpEarned, session, nextSq?.order ?? null, false);
    }

    // ── Consultas ─────────────────────────────────────────────────────────────

    async getSession(userId: string, sessionId: string) {
        const session = await this.loadSession(sessionId, userId);
        return this.formatSessionResponse(session);
    }

    async getUserHistory(userId: string) {
        const sessions = await this.sessionRepo.find({
            where: { user_id: userId },
            relations: { language: true, level: true },
            order: { created_at: "DESC" },
        });

        return sessions.map((s) => ({
            id: s.id,
            status: s.status,
            language: { id: s.language.id, name: s.language.name },
            level: s.level ? { id: s.level.id, name: s.level.name, xp: s.level.xp } : null,
            score: s.score,
            total_questions: s.total_questions,
            accuracy_percentage: s.total_questions > 0
                ? Math.round((s.score / s.total_questions) * 100)
                : 0,
            total_xp_earned: s.total_xp_earned,
            started_at: s.created_at,
            completed_at: s.completed_at,
        }));
    }

    // ── Helpers privados ──────────────────────────────────────────────────────

    private async loadSession(sessionId: string, userId: string): Promise<QuizSessionEntity> {
        const session = await this.sessionRepo.findOne({
            where: { id: sessionId },
            relations: {
                language: true,
                level: true,
                sessionQuestions: { question: { alternatives: true, level: true } },
            },
        });

        if (!session) throw new NotFoundException(`Sessão ${sessionId} não encontrada`);
        if (session.user_id !== userId) throw new ForbiddenException("Acesso negado");

        // Garante que sessionQuestions esteja ordenado
        session.sessionQuestions.sort((a, b) => a.order - b.order);
        return session;
    }

    private formatSessionResponse(session: QuizSessionEntity) {
        const answeredCount = session.sessionQuestions.filter(
            (sq) => sq.chosen_alternative_id !== null,
        ).length;

        const nextUnanswered = session.sessionQuestions.find(
            (sq) => sq.chosen_alternative_id === null,
        );

        return {
            session_id: session.id,
            status: session.status,
            language: { id: session.language.id, name: session.language.name },
            level: session.level
                ? { id: session.level.id, name: session.level.name, xp: session.level.xp }
                : null,
            progress: {
                questions_answered: answeredCount,
                questions_total: session.total_questions,
                current_score: session.score,
                total_xp_earned: session.total_xp_earned,
                accuracy_percentage: answeredCount > 0
                    ? Math.round((session.score / answeredCount) * 100)
                    : 0,
                current_question_order: nextUnanswered?.order ?? null,
                is_complete: session.status === QuizSessionStatus.COMPLETED,
                completed_at: session.completed_at,
            },
            questions: session.sessionQuestions.map((sq) => ({
                order: sq.order,
                question_id: sq.question.id,
                enunciado: sq.question.enunciado,
                // Alternativas SEM revelar qual é a correta (ocultado durante o quiz)
                alternatives: sq.question.alternatives.map((alt) => ({
                    id: alt.id,
                    descricao: alt.descricao,
                    // Revela apenas se já foi respondida
                    ...(sq.chosen_alternative_id !== null && { correta: alt.correta }),
                })),
                answered: sq.chosen_alternative_id !== null,
                your_answer: sq.chosen_alternative_id,
                correct: sq.correct,
                correct_alternative_id: sq.chosen_alternative_id !== null
                    ? sq.question.alternatives.find((a) => a.correta)?.id ?? null
                    : null,
                xp_earned: sq.xp_earned,
                answered_at: sq.answered_at,
            })),
        };
    }

    private buildAnswerResponse(
        questionOrder: number,
        isCorrect: boolean,
        correctAlternativeId: string | null,
        xpEarned: number,
        session: QuizSessionEntity,
        nextQuestionOrder: number | null,
        isComplete: boolean,
    ) {
        const result = {
            question_order: questionOrder,
            correct: isCorrect,
            correct_alternative_id: correctAlternativeId,
            xp_earned: xpEarned,
            session: {
                id: session.id,
                questions_answered: session.sessionQuestions.filter(
                    (sq) => sq.chosen_alternative_id !== null,
                ).length,
                questions_total: session.total_questions,
                current_score: session.score,
                total_xp_earned: session.total_xp_earned,
                is_complete: isComplete,
                next_question_order: nextQuestionOrder,
                completed_at: session.completed_at ?? null,
            },
            final_results: null as unknown,
        };

        if (isComplete) {
            result.final_results = {
                correct_answers: session.score,
                wrong_answers: session.total_questions - session.score,
                accuracy_percentage: Math.round((session.score / session.total_questions) * 100),
                total_xp_earned: session.total_xp_earned,
                questions_summary: session.sessionQuestions
                    .sort((a, b) => a.order - b.order)
                    .map((sq) => ({
                        order: sq.order,
                        enunciado: sq.question.enunciado,
                        your_answer_id: sq.chosen_alternative_id,
                        correct_answer_id: sq.question.alternatives.find((a) => a.correta)?.id ?? null,
                        correct: sq.correct,
                        xp_earned: sq.xp_earned,
                    })),
            };
        }

        return result;
    }

    private async ensureLanguageExists(languageId: string): Promise<void> {
        const exists = await this.languageRepo.exists({ where: { id: languageId } });
        if (!exists) throw new NotFoundException(`Linguagem ${languageId} não encontrada`);
    }

    private async ensureLevelExists(levelId: string): Promise<void> {
        const exists = await this.levelRepo.exists({ where: { id: levelId } });
        if (!exists) throw new NotFoundException(`Nível ${levelId} não encontrado`);
    }
}
