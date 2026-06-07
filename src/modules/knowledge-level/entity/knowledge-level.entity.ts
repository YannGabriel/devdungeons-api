import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from "typeorm";
import { UserLanguageLevelEntity } from "../../user-language-level/entity/user-language-level.entity";

@Entity({ name: "knowledge_levels" })
export class KnowledgeLevelEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({
        name: "name",
        length: 100,
        nullable: false,
        unique: true,
    })
    name: string;

    @Column({
        name: "xp",
        type: "int",
        default: 0,
    })
    xp: number;

    @OneToMany(
        () => UserLanguageLevelEntity,
        (userLanguageLevel) => userLanguageLevel.level,
    )
    userLanguageLevels: UserLanguageLevelEntity[];

    @CreateDateColumn({ name: "created_at" })
    created_at: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updated_at: Date;
}
