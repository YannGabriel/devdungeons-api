import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataBaseConfig } from './config/database.config.service';
import { UserModule } from './modules/user/user.module';
import { ProgrammingLanguageModule } from './modules/programming-language/programming-language.module';
import { KnowledgeLevelModule } from './modules/knowledge-level/knowledge-level.module';
import { QuestionModule } from './modules/question/question.module';
import { UserLanguageLevelModule } from './modules/user-language-level/user-language-level.module';
import { SeederModule } from './database/seed/seeder.module';

@Module({
  imports: [
    UserModule,
    ProgrammingLanguageModule,
    KnowledgeLevelModule,
    QuestionModule,
    UserLanguageLevelModule,
    SeederModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: DataBaseConfig,
      inject: [DataBaseConfig],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
