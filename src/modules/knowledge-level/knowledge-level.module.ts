import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { KnowledgeLevelEntity } from "./entity/knowledge-level.entity";
import { KnowledgeLevelService } from "./knowledge-level.service";
import { KnowledgeLevelController } from "./knowledge-level.controller";

@Module({
    imports: [TypeOrmModule.forFeature([KnowledgeLevelEntity])],
    controllers: [KnowledgeLevelController],
    providers: [KnowledgeLevelService],
    exports: [KnowledgeLevelService],
})
export class KnowledgeLevelModule {}
