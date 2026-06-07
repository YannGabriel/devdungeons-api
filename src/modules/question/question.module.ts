import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { QuestionEntity } from "./entity/question.entity";
import { AlternativeEntity } from "./entity/alternative.entity";
import { ProgrammingLanguageEntity } from "../programming-language/entity/programming-language.entity";
import { KnowledgeLevelEntity } from "../knowledge-level/entity/knowledge-level.entity";
import { UserModule } from "../user/user.module";
import { QuestionService } from "./question.service";
import { QuestionController } from "./question.controller";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            QuestionEntity,
            AlternativeEntity,
            ProgrammingLanguageEntity,
            KnowledgeLevelEntity,
        ]),
        UserModule,
    ],
    controllers: [QuestionController],
    providers: [QuestionService],
    exports: [QuestionService],
})
export class QuestionModule {}
