import { Injectable, Logger, NotFoundException, ConflictException } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { KnowledgeLevelEntity } from "./entity/knowledge-level.entity";
import { CreateKnowledgeLevelDTO } from "./dtos/create-knowledge-level.dto";
import { UpdateKnowledgeLevelDTO } from "./dtos/update-knowledge-level.dto";

@Injectable()
export class KnowledgeLevelService {
    private readonly logger = new Logger(KnowledgeLevelService.name);

    constructor(
        @InjectRepository(KnowledgeLevelEntity)
        private readonly levelRepository: Repository<KnowledgeLevelEntity>,
    ) {}

    async findAll(): Promise<KnowledgeLevelEntity[]> {
        return this.levelRepository.find({ order: { name: "ASC" } });
    }

    async findById(id: string): Promise<KnowledgeLevelEntity> {
        const level = await this.levelRepository.findOne({ where: { id } });
        if (!level) throw new NotFoundException(`Nível ${id} não encontrado`);
        return level;
    }

    async create(data: CreateKnowledgeLevelDTO): Promise<KnowledgeLevelEntity> {
        await this.ensureNameIsUnique(data.name);

        const level = this.levelRepository.create({
            name: data.name,
            xp: data.xp ?? 0,
        });
        const saved = await this.levelRepository.save(level);

        this.logger.log(`Nível criado: ${saved.id}`);
        return saved;
    }

    async update(id: string, data: UpdateKnowledgeLevelDTO): Promise<KnowledgeLevelEntity> {
        const level = await this.findById(id);
        if (data.name !== undefined) {
            await this.ensureNameIsUnique(data.name, id);
            level.name = data.name;
        }
        if (data.xp !== undefined) level.xp = data.xp;

        const updated = await this.levelRepository.save(level);

        this.logger.log(`Nível ${id} atualizado`);
        return updated;
    }

    async remove(id: string): Promise<void> {
        const level = await this.findById(id);
        await this.levelRepository.remove(level);
        this.logger.log(`Nível ${id} removido`);
    }

    private async ensureNameIsUnique(name: string, ignoreId?: string): Promise<void> {
        const existing = await this.levelRepository.findOne({ where: { name } });
        if (existing && existing.id !== ignoreId) {
            throw new ConflictException(`Nível "${name}" já cadastrado`);
        }
    }
}
