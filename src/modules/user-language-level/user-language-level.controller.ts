import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UserLanguageLevelService } from "./user-language-level.service";
import { CreateUserLanguageLevelDTO } from "./dtos/create-user-language-level.dto";
import { UpdateUserLanguageLevelDTO } from "./dtos/update-user-language-level.dto";

@ApiTags("User Language Levels")
@ApiBearerAuth()
@Controller("/user-language-levels")
export class UserLanguageLevelController {
    constructor(
        private readonly userLanguageLevelService: UserLanguageLevelService,
    ) {}

    @Get()
    @ApiOperation({ summary: "Listar todas as associações usuário-linguagem-nível" })
    @ApiResponse({ status: 200, description: "Lista de associações com relações carregadas" })
    async findAll() {
        return this.userLanguageLevelService.findAll();
    }

    @Get("by-user/:userId")
    @ApiOperation({ summary: "Buscar linguagens e níveis de um usuário específico" })
    @ApiResponse({ status: 200, description: "Linguagens/níveis do usuário" })
    @ApiResponse({ status: 404, description: "Usuário não encontrado" })
    async findByUser(@Param("userId") userId: string) {
        return this.userLanguageLevelService.findByUser(userId);
    }

    @Get(":id")
    @ApiOperation({ summary: "Buscar associação por ID" })
    @ApiResponse({ status: 200, description: "Associação encontrada" })
    @ApiResponse({ status: 404, description: "Associação não encontrada" })
    async findById(@Param("id") id: string) {
        return this.userLanguageLevelService.findById(id);
    }

    @Post()
    @ApiOperation({ summary: "Associar usuário a uma linguagem com nível inicial" })
    @ApiResponse({ status: 201, description: "Associação criada" })
    @ApiResponse({ status: 404, description: "Usuário, linguagem ou nível não encontrado" })
    @ApiResponse({ status: 409, description: "Usuário já possui nível para esta linguagem" })
    async create(@Body() data: CreateUserLanguageLevelDTO) {
        return this.userLanguageLevelService.create(data);
    }

    @Patch(":id")
    @ApiOperation({ summary: "Atualizar nível do usuário em uma linguagem" })
    @ApiResponse({ status: 200, description: "Nível atualizado" })
    @ApiResponse({ status: 404, description: "Associação ou nível não encontrado" })
    async update(
        @Param("id") id: string,
        @Body() data: UpdateUserLanguageLevelDTO,
    ) {
        return this.userLanguageLevelService.update(id, data);
    }

    @Delete(":id")
    @ApiOperation({ summary: "Remover associação usuário-linguagem" })
    @ApiResponse({ status: 200, description: "Associação removida" })
    @ApiResponse({ status: 404, description: "Associação não encontrada" })
    async remove(@Param("id") id: string) {
        await this.userLanguageLevelService.remove(id);
        return { message: `Associação ${id} removida com sucesso` };
    }
}
