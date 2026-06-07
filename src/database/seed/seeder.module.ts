import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProgrammingLanguageEntity } from "../../modules/programming-language/entity/programming-language.entity";
import { KnowledgeLevelEntity } from "../../modules/knowledge-level/entity/knowledge-level.entity";
import { QuestionEntity } from "../../modules/question/entity/question.entity";
import { AlternativeEntity } from "../../modules/question/entity/alternative.entity";
import { SeederService } from "./seeder.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ProgrammingLanguageEntity,
            KnowledgeLevelEntity,
            QuestionEntity,
            AlternativeEntity,
        ]),
    ],
    providers: [SeederService],
})
export class SeederModule {}
