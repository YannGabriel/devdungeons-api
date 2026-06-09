import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UserService } from "./user.service";
import { CreateUserDTO } from "./dtos/create-user.dto";
import { UpdateUserExperienceDto } from "./dtos/update-user-experience.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { UserEntity } from "./entity/user.entity";
import { Public } from "../../auth/decorators/public.decorator";

@ApiTags("Users")
@ApiBearerAuth()
@Controller("/user")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Public()
    @Post()
    @ApiOperation({ summary: "Cadastrar novo usuário" })
    @ApiResponse({ status: 201, description: "Usuário criado", type: UserEntity })
    @ApiResponse({ status: 409, description: "E-mail já cadastrado" })
    async createUser(@Body() userData: CreateUserDTO): Promise<UserEntity> {
        return this.userService.createUser(userData);
    }

    @Get(":id")
    @ApiOperation({ summary: "Buscar usuário por ID" })
    @ApiResponse({ status: 200, type: UserEntity })
    @ApiResponse({ status: 404, description: "Usuário não encontrado" })
    async findById(@Param("id") id: string): Promise<UserEntity> {
        return this.userService.findUserById(id);
    }

    @Patch("update-experience")
    @ApiOperation({ summary: "Atualizar XP do usuário manualmente" })
    @ApiResponse({ status: 200, description: "XP atualizado" })
    async updateUserExperience(@Body() dto: UpdateUserExperienceDto) {
        return this.userService.updateUserExperience(dto.id, dto.user_experience);
    }

    @Patch(":id")
    @ApiOperation({ summary: "Atualizar dados do usuário" })
    @ApiResponse({ status: 200, type: UserEntity })
    @ApiResponse({ status: 404, description: "Usuário não encontrado" })
    @ApiResponse({ status: 409, description: "E-mail já cadastrado" })
    async updateUser(
        @Param("id") id: string,
        @Body() updateUserData: UpdateUserDto,
    ): Promise<UserEntity> {
        return this.userService.updateUser(id, updateUserData);
    }
}
