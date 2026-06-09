import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ProgrammingLanguageService } from "./programming-language.service";
import { CreateProgrammingLanguageDTO } from "./dtos/create-programming-language.dto";
import { UpdateProgrammingLanguageDTO } from "./dtos/update-programming-language.dto";
import { Public } from "../../auth/decorators/public.decorator";
import { ProgrammingLanguageEntity } from "./entity/programming-language.entity";

@ApiTags("Programming Languages")
@ApiBearerAuth()
@Controller("/programming-languages")
export class ProgrammingLanguageController {
    constructor(private readonly languageService: ProgrammingLanguageService) {}

    @Public()
    @Get()
    @ApiOperation({ summary: "Listar todas as linguagens" })
    @ApiResponse({ status: 200, type: [ProgrammingLanguageEntity] })
    async findAll(): Promise<ProgrammingLanguageEntity[]> {
        return this.languageService.findAll();
    }

    @Public()
    @Get(":id")
    @ApiOperation({ summary: "Buscar linguagem por ID" })
    @ApiResponse({ status: 200, type: ProgrammingLanguageEntity })
    @ApiResponse({ status: 404, description: "Linguagem não encontrada" })
    async findById(@Param("id") id: string): Promise<ProgrammingLanguageEntity> {
        return this.languageService.findById(id);
    }

    @Post()
    @ApiOperation({ summary: "Criar linguagem de programação" })
    @ApiResponse({ status: 201, type: ProgrammingLanguageEntity })
    @ApiResponse({ status: 409, description: "Nome já cadastrado" })
    async create(@Body() data: CreateProgrammingLanguageDTO): Promise<ProgrammingLanguageEntity> {
        return this.languageService.create(data);
    }

    @Patch(":id")
    @ApiOperation({ summary: "Atualizar linguagem" })
    @ApiResponse({ status: 200, type: ProgrammingLanguageEntity })
    @ApiResponse({ status: 404, description: "Linguagem não encontrada" })
    @ApiResponse({ status: 409, description: "Nome já cadastrado" })
    async update(
        @Param("id") id: string,
        @Body() data: UpdateProgrammingLanguageDTO,
    ): Promise<ProgrammingLanguageEntity> {
        return this.languageService.update(id, data);
    }

    @Delete(":id")
    @ApiOperation({ summary: "Remover linguagem (cascade nas questões)" })
    @ApiResponse({ status: 200, description: "Linguagem removida" })
    @ApiResponse({ status: 404, description: "Linguagem não encontrada" })
    async remove(@Param("id") id: string) {
        await this.languageService.remove(id);
        return { message: `Linguagem ${id} removida com sucesso` };
    }
}
