import { Body, Controller, Param, Patch, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDTO } from "./dtos/create-user.dto";
import { UpdateUserExperienceDto } from "./dtos/update-user-experience.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";


@Controller("/user")
export class UserController {

    constructor(
        private readonly userService: UserService
    ) {

    }
    @Post()
    async CreateUser(@Body() userData: CreateUserDTO) {
        await this.userService.createUser(userData)
        console.log("Usário Criado com sucesso!")
    }

    @Patch("update-experience")
    async UpdateUserExperience(@Body() updateExperieceData: UpdateUserExperienceDto) {
        await this.userService.updateUserExperience(updateExperieceData.id, updateExperieceData.user_experiece)
    }
    
    @Patch(":id")
    async UpdateUser(@Param("id") id: string, @Body() updateUserData: UpdateUserDto) {
        await this.userService.updateUser(id, updateUserData)
    }


}