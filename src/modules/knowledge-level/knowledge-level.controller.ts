import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { KnowledgeLevelService } from "./knowledge-level.service";
import { CreateKnowledgeLevelDTO } from "./dtos/create-knowledge-level.dto";
import { UpdateKnowledgeLevelDTO } from "./dtos/update-knowledge-level.dto";

@Controller("/knowledge-levels")
export class KnowledgeLevelController {
    constructor(private readonly levelService: KnowledgeLevelService) {}

    @Get()
    async findAll() {
        return this.levelService.findAll();
    }

    @Get(":id")
    async findById(@Param("id") id: string) {
        return this.levelService.findById(id);
    }

    @Post()
    async create(@Body() data: CreateKnowledgeLevelDTO) {
        return this.levelService.create(data);
    }

    @Patch(":id")
    async update(@Param("id") id: string, @Body() data: UpdateKnowledgeLevelDTO) {
        return this.levelService.update(id, data);
    }

    @Delete(":id")
    async remove(@Param("id") id: string) {
        await this.levelService.remove(id);
        return { message: `Nível ${id} removido com sucesso` };
    }
}
