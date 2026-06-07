import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from "typeorm";
import { QuestionEntity } from "../../question/entity/question.entity";
import { UserLanguageLevelEntity } from "../../user-language-level/entity/user-language-level.entity";

@Entity({ name: "programming_languages" })
export class ProgrammingLanguageEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({
        name: "name",
        length: 100,
        nullable: false,
        unique: true,
    })
    name: string;

    @OneToMany(() => QuestionEntity, (question) => question.language)
    questions: QuestionEntity[];

    @OneToMany(
        () => UserLanguageLevelEntity,
        (userLanguageLevel) => userLanguageLevel.language,
    )
    userLanguageLevels: UserLanguageLevelEntity[];

    @CreateDateColumn({ name: "created_at" })
    created_at: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updated_at: Date;
}
