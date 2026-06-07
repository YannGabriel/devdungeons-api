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
import { ProgrammingLanguageEntity } from "../../programming-language/entity/programming-language.entity";
import { KnowledgeLevelEntity } from "../../knowledge-level/entity/knowledge-level.entity";
import { AlternativeEntity } from "./alternative.entity";

@Entity({ name: "questions" })
export class QuestionEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({
        name: "enunciado",
        type: "text",
        nullable: false,
    })
    enunciado: string;

    @Column({ name: "language_id", type: "uuid" })
    language_id: string;

    @ManyToOne(() => ProgrammingLanguageEntity, (language) => language.questions, {
        nullable: false,
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "language_id" })
    language: ProgrammingLanguageEntity;

    @Column({ name: "level_id", type: "uuid", nullable: true })
    level_id: string | null;

    @ManyToOne(() => KnowledgeLevelEntity, {
        nullable: true,
        onDelete: "SET NULL",
    })
    @JoinColumn({ name: "level_id" })
    level: KnowledgeLevelEntity | null;

    @OneToMany(() => AlternativeEntity, (alternative) => alternative.question, {
        cascade: true,
    })
    alternatives: AlternativeEntity[];

    @CreateDateColumn({ name: "created_at" })
    created_at: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updated_at: Date;
}
