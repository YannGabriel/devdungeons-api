import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
} from "@nestjs/common";
import { UserLanguageLevelService } from "./user-language-level.service";
import { CreateUserLanguageLevelDTO } from "./dtos/create-user-language-level.dto";
import { UpdateUserLanguageLevelDTO } from "./dtos/update-user-language-level.dto";

@Controller("/user-language-levels")
export class UserLanguageLevelController {
    constructor(
        private readonly userLanguageLevelService: UserLanguageLevelService,
    ) {}

    @Get()
    async findAll() {
        return this.userLanguageLevelService.findAll();
    }

    @Get("by-user/:userId")
    async findByUser(@Param("userId") userId: string) {
        return this.userLanguageLevelService.findByUser(userId);
    }

    @Get(":id")
    async findById(@Param("id") id: string) {
        return this.userLanguageLevelService.findById(id);
    }

    @Post()
    async create(@Body() data: CreateUserLanguageLevelDTO) {
        return this.userLanguageLevelService.create(data);
    }

    @Patch(":id")
    async update(
        @Param("id") id: string,
        @Body() data: UpdateUserLanguageLevelDTO,
    ) {
        return this.userLanguageLevelService.update(id, data);
    }

    @Delete(":id")
    async remove(@Param("id") id: string) {
        await this.userLanguageLevelService.remove(id);
        return { message: `Associação ${id} removida com sucesso` };
    }
}
