import { Injectable, Logger, NotFoundException, ConflictException } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ProgrammingLanguageEntity } from "./entity/programming-language.entity";
import { CreateProgrammingLanguageDTO } from "./dtos/create-programming-language.dto";
import { UpdateProgrammingLanguageDTO } from "./dtos/update-programming-language.dto";

@Injectable()
export class ProgrammingLanguageService {
    private readonly logger = new Logger(ProgrammingLanguageService.name);

    constructor(
        @InjectRepository(ProgrammingLanguageEntity)
        private readonly languageRepository: Repository<ProgrammingLanguageEntity>,
    ) {}

    async findAll(): Promise<ProgrammingLanguageEntity[]> {
        return this.languageRepository.find({ order: { name: "ASC" } });
    }

    async findById(id: string): Promise<ProgrammingLanguageEntity> {
        const language = await this.languageRepository.findOne({ where: { id } });
        if (!language) throw new NotFoundException(`Linguagem ${id} não encontrada`);
        return language;
    }

    async create(data: CreateProgrammingLanguageDTO): Promise<ProgrammingLanguageEntity> {
        await this.ensureNameIsUnique(data.name);

        const language = this.languageRepository.create({ name: data.name });
        const saved = await this.languageRepository.save(language);

        this.logger.log(`Linguagem criada: ${saved.id}`);
        return saved;
    }

    async update(id: string, data: UpdateProgrammingLanguageDTO): Promise<ProgrammingLanguageEntity> {
        const language = await this.findById(id);
        await this.ensureNameIsUnique(data.name, id);

        language.name = data.name;
        const updated = await this.languageRepository.save(language);

        this.logger.log(`Linguagem ${id} atualizada`);
        return updated;
    }

    async remove(id: string): Promise<void> {
        const language = await this.findById(id);
        await this.languageRepository.remove(language);
        this.logger.log(`Linguagem ${id} removida`);
    }

    private async ensureNameIsUnique(name: string, ignoreId?: string): Promise<void> {
        const existing = await this.languageRepository.findOne({ where: { name } });
        if (existing && existing.id !== ignoreId) {
            throw new ConflictException(`Linguagem "${name}" já cadastrada`);
        }
    }
}
