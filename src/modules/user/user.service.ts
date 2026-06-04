import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { UserEntity } from "./entity/user.entity";
import { CreateUserDTO } from "./dtos/create-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { UpdateUserDto } from "./dtos/update-user.dto";


@Injectable()
export class UserService {
    private readonly logger = new Logger(UserService.name);

    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
    ) { }

    async findUserById(id: string): Promise<UserEntity> {
        const user = await this.userRepository.findOne({ where: { id } })
        if (!user) throw new NotFoundException(`Usuário ${id} não encontrado`);
        return user
    }

    async createUser(userData: CreateUserDTO) {
        const user = {
            username: userData.username,
            password: userData.password,
            email: userData.email,
            user_level: 0,
            user_experience: 0
        }

        const userStatement = await this.userRepository.create(user)
        const savedUser = await this.userRepository.save(userStatement)

        this.logger.log(`Usuário criado: ${savedUser.id}`)
        return savedUser
    }

    async updateUser(id: string, updateUserData: UpdateUserDto) {
        const user = await this.userRepository.preload({ id, ...updateUserData })
        if (!user) throw new NotFoundException(`Usuário ${id} não encontrado`);

        const updatedUser = await this.userRepository.save(user);
        this.logger.log(`Usuário ${id} atualizado: ${JSON.stringify(updateUserData)}`)
        return updatedUser
    }

    async updateUserExperience(id: string, new_user_experience_upgrade: number) {
        const user = await this.findUserById(id)
        const newExperience = user.user_experience + new_user_experience_upgrade

        if (newExperience >= 1000) {
            const newLevel = user.user_level + 1
            const newUserExperience = newExperience - 1000

            await this.userRepository.update({ id }, { user_experience: newUserExperience, user_level: newLevel })

            this.logger.log(`Usuário ${id} subiu para o nível ${newLevel} com ${newUserExperience} XP`)
            return { message: `Usuário ${id} subiu para o nível ${newLevel}` }
        }

        await this.userRepository.update({ id }, { user_experience: newExperience })
        this.logger.log(`Usuário ${id} XP atualizado: ${user.user_experience} -> ${newExperience}`)
        return { message: `XP atualizado para ${newExperience}` }
    }
}