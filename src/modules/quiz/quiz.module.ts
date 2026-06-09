import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { QuizSessionEntity } from "./entity/quiz-session.entity";
import { QuizSessionQuestionEntity } from "./entity/quiz-session-question.entity";
import { QuestionEntity } from "../question/entity/question.entity";
import { ProgrammingLanguageEntity } from "../programming-language/entity/programming-language.entity";
import { KnowledgeLevelEntity } from "../knowledge-level/entity/knowledge-level.entity";
import { UserModule } from "../user/user.module";
import { QuizService } from "./quiz.service";
import { QuizController } from "./quiz.controller";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            QuizSessionEntity,
            QuizSessionQuestionEntity,
            QuestionEntity,
            ProgrammingLanguageEntity,
            KnowledgeLevelEntity,
        ]),
        UserModule,
    ],
    controllers: [QuizController],
    providers: [QuizService],
    exports: [QuizService],
})
export class QuizModule {}
