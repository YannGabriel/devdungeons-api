import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "../user/entity/user.entity";

export interface RankingEntry {
    position: number;
    id: string;
    username: string;
    user_level: number;
    user_experience: number;
    total_xp: number;
}

export interface RankingResponse {
    data: RankingEntry[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

@Injectable()
export class RankingsService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) {}

    async getRankings(page = 1, limit = 10): Promise<RankingResponse> {
        const safePage = Math.max(1, page);
        const safeLimit = Math.min(Math.max(1, limit), 100);
        const offset = (safePage - 1) * safeLimit;

        const [users, total] = await this.userRepository
            .createQueryBuilder("u")
            .select(["u.id", "u.username", "u.user_level", "u.user_experience"])
            .orderBy("u.user_level", "DESC")
            .addOrderBy("u.user_experience", "DESC")
            .skip(offset)
            .take(safeLimit)
            .getManyAndCount();

        const globalOffset = (safePage - 1) * safeLimit;

        const data: RankingEntry[] = users.map((u, idx) => ({
            position: globalOffset + idx + 1,
            id: u.id,
            username: u.username,
            user_level: u.user_level,
            user_experience: u.user_experience,
            total_xp: u.user_level * 1000 + u.user_experience,
        }));

        return {
            data,
            total,
            page: safePage,
            limit: safeLimit,
            totalPages: Math.ceil(total / safeLimit),
        };
    }

    async getUserPosition(userId: string): Promise<{ position: number; total: number } | null> {
        const allUsers = await this.userRepository
            .createQueryBuilder("u")
            .select(["u.id", "u.user_level", "u.user_experience"])
            .orderBy("u.user_level", "DESC")
            .addOrderBy("u.user_experience", "DESC")
            .getMany();

        const idx = allUsers.findIndex((u) => u.id === userId);
        if (idx === -1) return null;

        return { position: idx + 1, total: allUsers.length };
    }
}
