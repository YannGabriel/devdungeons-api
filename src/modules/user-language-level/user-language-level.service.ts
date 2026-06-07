import {
    Injectable,
    Logger,
    NotFoundException,
    ConflictException,
} from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { UserLanguageLevelEntity } from "./entity/user-language-level.entity";
import { UserEntity } from "../user/entity/user.entity";
import { ProgrammingLanguageEntity } from "../programming-language/entity/programming-language.entity";
import { KnowledgeLevelEntity } from "../knowledge-level/entity/knowledge-level.entity";
import { CreateUserLanguageLevelDTO } from "./dtos/create-user-language-level.dto";
import { UpdateUserLanguageLevelDTO } from "./dtos/update-user-language-level.dto";

@Injectable()
export class UserLanguageLevelService {
    private readonly logger = new Logger(UserLanguageLevelService.name);

    constructor(
        @InjectRepository(UserLanguageLevelEntity)
        private readonly userLanguageLevelRepository: Repository<UserLanguageLevelEntity>,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(ProgrammingLanguageEntity)
        private readonly languageRepository: Repository<ProgrammingLanguageEntity>,
        @InjectRepository(KnowledgeLevelEntity)
        private readonly levelRepository: Repository<KnowledgeLevelEntity>,
    ) {}

    async findAll(): Promise<UserLanguageLevelEntity[]> {
        return this.userLanguageLevelRepository.find({
            relations: { user: true, language: true, level: true },
        });
    }

    async findById(id: string): Promise<UserLanguageLevelEntity> {
        const record = await this.userLanguageLevelRepository.findOne({
            where: { id },
            relations: { user: true, language: true, level: true },
        });
        if (!record) {
            throw new NotFoundException(`Associação ${id} não encontrada`);
        }
        return record;
    }

    async findByUser(userId: string): Promise<UserLanguageLevelEntity[]> {
        await this.ensureUserExists(userId);
        return this.userLanguageLevelRepository.find({
            where: { user_id: userId },
            relations: { language: true, level: true },
        });
    }

    async create(data: CreateUserLanguageLevelDTO): Promise<UserLanguageLevelEntity> {
        await this.ensureUserExists(data.user_id);
        await this.ensureLanguageExists(data.language_id);
        await this.ensureLevelExists(data.level_id);

        const duplicate = await this.userLanguageLevelRepository.findOne({
            where: { user_id: data.user_id, language_id: data.language_id },
        });
        if (duplicate) {
            throw new ConflictException(
                "Usuário já possui um nível cadastrado para esta linguagem",
            );
        }

        const record = this.userLanguageLevelRepository.create({
            user_id: data.user_id,
            language_id: data.language_id,
            level_id: data.level_id,
        });
        const saved = await this.userLanguageLevelRepository.save(record);

        this.logger.log(`Associação usuário-linguagem-nível criada: ${saved.id}`);
        return this.findById(saved.id);
    }

    async update(
        id: string,
        data: UpdateUserLanguageLevelDTO,
    ): Promise<UserLanguageLevelEntity> {
        const record = await this.findById(id);
        await this.ensureLevelExists(data.level_id);

        record.level_id = data.level_id;
        await this.userLanguageLevelRepository.save(record);

        this.logger.log(`Associação ${id} atualizada para o nível ${data.level_id}`);
        return this.findById(id);
    }

    async remove(id: string): Promise<void> {
        const record = await this.findById(id);
        await this.userLanguageLevelRepository.remove(record);
        this.logger.log(`Associação ${id} removida`);
    }

    private async ensureUserExists(userId: string): Promise<void> {
        const exists = await this.userRepository.exists({ where: { id: userId } });
        if (!exists) throw new NotFoundException(`Usuário ${userId} não encontrado`);
    }

    private async ensureLanguageExists(languageId: string): Promise<void> {
        const exists = await this.languageRepository.exists({
            where: { id: languageId },
        });
        if (!exists) {
            throw new NotFoundException(`Linguagem ${languageId} não encontrada`);
        }
    }

    private async ensureLevelExists(levelId: string): Promise<void> {
        const exists = await this.levelRepository.exists({ where: { id: levelId } });
        if (!exists) throw new NotFoundException(`Nível ${levelId} não encontrado`);
    }
}
