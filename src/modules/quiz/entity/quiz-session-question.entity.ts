import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { QuizSessionEntity } from "./quiz-session.entity";
import { QuestionEntity } from "../../question/entity/question.entity";

@Entity({ name: "quiz_session_questions" })
export class QuizSessionQuestionEntity {
    @ApiProperty()
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ name: "session_id", type: "uuid" })
    session_id: string;

    @ManyToOne(() => QuizSessionEntity, (s) => s.sessionQuestions, {
        nullable: false,
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "session_id" })
    session: QuizSessionEntity;

    @Column({ name: "question_id", type: "uuid" })
    question_id: string;

    @ManyToOne(() => QuestionEntity, { nullable: false, onDelete: "CASCADE" })
    @JoinColumn({ name: "question_id" })
    question: QuestionEntity;

    @ApiProperty({ description: "Posição da questão na fila (1 a N)" })
    @Column({ name: "order", type: "int" })
    order: number;

    @ApiProperty({ nullable: true, description: "ID da alternativa escolhida pelo usuário" })
    @Column({ name: "chosen_alternative_id", type: "uuid", nullable: true })
    chosen_alternative_id: string | null;

    @ApiProperty({ nullable: true })
    @Column({ name: "correct", type: "boolean", nullable: true })
    correct: boolean | null;

    @ApiProperty({ description: "XP ganho nesta questão (0 se errou ou questão sem nível)" })
    @Column({ name: "xp_earned", type: "int", default: 0 })
    xp_earned: number;

    @ApiProperty({ nullable: true })
    @Column({ name: "answered_at", type: "timestamp", nullable: true })
    answered_at: Date | null;

    @CreateDateColumn({ name: "created_at" })
    created_at: Date;
}
