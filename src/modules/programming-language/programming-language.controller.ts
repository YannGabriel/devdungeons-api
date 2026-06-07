import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ProgrammingLanguageService } from "./programming-language.service";
import { CreateProgrammingLanguageDTO } from "./dtos/create-programming-language.dto";
import { UpdateProgrammingLanguageDTO } from "./dtos/update-programming-language.dto";

@Controller("/programming-languages")
export class ProgrammingLanguageController {
    constructor(private readonly languageService: ProgrammingLanguageService) {}

    @Get()
    async findAll() {
        return this.languageService.findAll();
    }

    @Get(":id")
    async findById(@Param("id") id: string) {
        return this.languageService.findById(id);
    }

    @Post()
    async create(@Body() data: CreateProgrammingLanguageDTO) {
        return this.languageService.create(data);
    }

    @Patch(":id")
    async update(@Param("id") id: string, @Body() data: UpdateProgrammingLanguageDTO) {
        return this.languageService.update(id, data);
    }

    @Delete(":id")
    async remove(@Param("id") id: string) {
        await this.languageService.remove(id);
        return { message: `Linguagem ${id} removida com sucesso` };
    }
}
