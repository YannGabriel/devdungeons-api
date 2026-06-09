import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { KnowledgeLevelService } from "./knowledge-level.service";
import { CreateKnowledgeLevelDTO } from "./dtos/create-knowledge-level.dto";
import { UpdateKnowledgeLevelDTO } from "./dtos/update-knowledge-level.dto";
import { Public } from "../../auth/decorators/public.decorator";
import { KnowledgeLevelEntity } from "./entity/knowledge-level.entity";

@ApiTags("Knowledge Levels")
@ApiBearerAuth()
@Controller("/knowledge-levels")
export class KnowledgeLevelController {
    constructor(private readonly levelService: KnowledgeLevelService) {}

    @Public()
    @Get()
    @ApiOperation({ summary: "Listar todos os níveis de conhecimento" })
    @ApiResponse({ status: 200, type: [KnowledgeLevelEntity] })
    async findAll(): Promise<KnowledgeLevelEntity[]> {
        return this.levelService.findAll();
    }

    @Public()
    @Get(":id")
    @ApiOperation({ summary: "Buscar nível por ID" })
    @ApiResponse({ status: 200, type: KnowledgeLevelEntity })
    @ApiResponse({ status: 404, description: "Nível não encontrado" })
    async findById(@Param("id") id: string): Promise<KnowledgeLevelEntity> {
        return this.levelService.findById(id);
    }

    @Post()
    @ApiOperation({ summary: "Criar nível de conhecimento" })
    @ApiResponse({ status: 201, type: KnowledgeLevelEntity })
    @ApiResponse({ status: 409, description: "Nome já cadastrado" })
    async create(@Body() data: CreateKnowledgeLevelDTO): Promise<KnowledgeLevelEntity> {
        return this.levelService.create(data);
    }

    @Patch(":id")
    @ApiOperation({ summary: "Atualizar nível (nome e/ou XP)" })
    @ApiResponse({ status: 200, type: KnowledgeLevelEntity })
    @ApiResponse({ status: 404, description: "Nível não encontrado" })
    @ApiResponse({ status: 409, description: "Nome já cadastrado" })
    async update(
        @Param("id") id: string,
        @Body() data: UpdateKnowledgeLevelDTO,
    ): Promise<KnowledgeLevelEntity> {
        return this.levelService.update(id, data);
    }

    @Delete(":id")
    @ApiOperation({ summary: "Remover nível" })
    @ApiResponse({ status: 200, description: "Nível removido" })
    @ApiResponse({ status: 404, description: "Nível não encontrado" })
    async remove(@Param("id") id: string) {
        await this.levelService.remove(id);
        return { message: `Nível ${id} removido com sucesso` };
    }
}
