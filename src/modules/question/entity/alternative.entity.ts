import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from "typeorm";
import { QuestionEntity } from "./question.entity";

@Entity({ name: "alternatives" })
export class AlternativeEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ name: "question_id", type: "uuid" })
    question_id: string;

    @ManyToOne(() => QuestionEntity, (question) => question.alternatives, {
        nullable: false,
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "question_id" })
    question: QuestionEntity;

    @Column({
        name: "descricao",
        type: "text",
        nullable: false,
    })
    descricao: string;

    @Column({
        name: "correta",
        type: "boolean",
        default: false,
    })
    correta: boolean;

    @CreateDateColumn({ name: "created_at" })
    created_at: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updated_at: Date;
}
