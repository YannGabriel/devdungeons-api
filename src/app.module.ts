import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DataBaseConfig } from "./config/database.config.service";
import { AuthModule } from "./auth/auth.module";
import { JwtAuthGuard } from "./auth/guards/jwt-auth.guard";
import { UserModule } from "./modules/user/user.module";
import { ProgrammingLanguageModule } from "./modules/programming-language/programming-language.module";
import { KnowledgeLevelModule } from "./modules/knowledge-level/knowledge-level.module";
import { QuestionModule } from "./modules/question/question.module";
import { UserLanguageLevelModule } from "./modules/user-language-level/user-language-level.module";
import { QuizModule } from "./modules/quiz/quiz.module";
import { SeederModule } from "./database/seed/seeder.module";

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRootAsync({ useClass: DataBaseConfig, inject: [DataBaseConfig] }),
        ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
        AuthModule,
        UserModule,
        ProgrammingLanguageModule,
        KnowledgeLevelModule,
        QuestionModule,
        UserLanguageLevelModule,
        QuizModule,
        SeederModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
    ],
})
export class AppModule {}
