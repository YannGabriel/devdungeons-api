import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    Unique,
} from "typeorm";
import { UserEntity } from "../../user/entity/user.entity";
import { ProgrammingLanguageEntity } from "../../programming-language/entity/programming-language.entity";
import { KnowledgeLevelEntity } from "../../knowledge-level/entity/knowledge-level.entity";

@Entity({ name: "user_language_levels" })
@Unique("uq_user_language", ["user_id", "language_id"])
export class UserLanguageLevelEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ name: "user_id", type: "uuid" })
    user_id: string;

    @ManyToOne(() => UserEntity, { nullable: false, onDelete: "CASCADE" })
    @JoinColumn({ name: "user_id" })
    user: UserEntity;

    @Column({ name: "language_id", type: "uuid" })
    language_id: string;

    @ManyToOne(
        () => ProgrammingLanguageEntity,
        (language) => language.userLanguageLevels,
        { nullable: false, onDelete: "CASCADE" },
    )
    @JoinColumn({ name: "language_id" })
    language: ProgrammingLanguageEntity;

    @Column({ name: "level_id", type: "uuid" })
    level_id: string;

    @ManyToOne(
        () => KnowledgeLevelEntity,
        (level) => level.userLanguageLevels,
        { nullable: false, onDelete: "CASCADE" },
    )
    @JoinColumn({ name: "level_id" })
    level: KnowledgeLevelEntity;

    @CreateDateColumn({ name: "created_at" })
    created_at: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updated_at: Date;
}
