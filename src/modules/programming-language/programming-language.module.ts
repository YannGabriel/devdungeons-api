import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProgrammingLanguageEntity } from "./entity/programming-language.entity";
import { ProgrammingLanguageService } from "./programming-language.service";
import { ProgrammingLanguageController } from "./programming-language.controller";

@Module({
    imports: [TypeOrmModule.forFeature([ProgrammingLanguageEntity])],
    controllers: [ProgrammingLanguageController],
    providers: [ProgrammingLanguageService],
    exports: [ProgrammingLanguageService],
})
export class ProgrammingLanguageModule {}
