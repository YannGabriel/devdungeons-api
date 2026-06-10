import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../user/entity/user.entity";
import { RankingsController } from "./rankings.controller";
import { RankingsService } from "./rankings.service";

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity])],
    controllers: [RankingsController],
    providers: [RankingsService],
    exports: [RankingsService],
})
export class RankingsModule {}
