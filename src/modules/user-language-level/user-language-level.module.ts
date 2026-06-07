import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserLanguageLevelEntity } from "./entity/user-language-level.entity";
import { UserEntity } from "../user/entity/user.entity";
import { ProgrammingLanguageEntity } from "../programming-language/entity/programming-language.entity";
import { KnowledgeLevelEntity } from "../knowledge-level/entity/knowledge-level.entity";
import { UserLanguageLevelService } from "./user-language-level.service";
import { UserLanguageLevelController } from "./user-language-level.controller";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            UserLanguageLevelEntity,
            UserEntity,
            ProgrammingLanguageEntity,
            KnowledgeLevelEntity,
        ]),
    ],
    controllers: [UserLanguageLevelController],
    providers: [UserLanguageLevelService],
    exports: [UserLanguageLevelService],
})
export class UserLanguageLevelModule {}
