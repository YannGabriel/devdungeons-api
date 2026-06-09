import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
    JoinColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { UserEntity } from "../../user/entity/user.entity";
import { ProgrammingLanguageEntity } from "../../programming-language/entity/programming-language.entity";
import { KnowledgeLevelEntity } from "../../knowledge-level/entity/knowledge-level.entity";
import { QuizSessionStatus } from "../enums/quiz-session-status.enum";
import { QuizSessionQuestionEntity } from "./quiz-session-question.entity";

@Entity({ name: "quiz_sessions" })
export class QuizSessionEntity {
    @ApiProperty()
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ name: "user_id", type: "uuid" })
    user_id: string;

    @ManyToOne(() => UserEntity, { nullable: false, onDelete: "CASCADE" })
    @JoinColumn({ name: "user_id" })
    user: UserEntity;

    @Column({ name: "language_id", type: "uuid" })
    language_id: string;

    @ManyToOne(() => ProgrammingLanguageEntity, { nullable: false, onDelete: "CASCADE" })
    @JoinColumn({ name: "language_id" })
    language: ProgrammingLanguageEntity;

    @Column({ name: "level_id", type: "uuid", nullable: true })
    level_id: string | null;

    @ManyToOne(() => KnowledgeLevelEntity, { nullable: true, onDelete: "SET NULL" })
    @JoinColumn({ name: "level_id" })
    level: KnowledgeLevelEntity | null;

    @ApiProperty({ enum: QuizSessionStatus })
    @Column({ name: "status", type: "enum", enum: QuizSessionStatus, default: QuizSessionStatus.IN_PROGRESS })
    status: QuizSessionStatus;

    @ApiProperty({ description: "Número de respostas corretas" })
    @Column({ name: "score", type: "int", default: 0 })
    score: number;

    @ApiProperty({ description: "Total de questões na sessão" })
    @Column({ name: "total_questions", type: "int", default: 0 })
    total_questions: number;

    @ApiProperty({ description: "XP total ganho na sessão (creditado ao completar)" })
    @Column({ name: "total_xp_earned", type: "int", default: 0 })
    total_xp_earned: number;

    @ApiProperty({ nullable: true })
    @Column({ name: "completed_at", type: "timestamp", nullable: true })
    completed_at: Date | null;

    @OneToMany(() => QuizSessionQuestionEntity, (sq) => sq.session, { cascade: true })
    sessionQuestions: QuizSessionQuestionEntity[];

    @CreateDateColumn({ name: "created_at" })
    created_at: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updated_at: Date;
}
