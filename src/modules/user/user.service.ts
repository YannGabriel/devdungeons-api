import { Injectable, Logger, NotFoundException, ConflictException } from "@nestjs/common";
import { Repository } from "typeorm";
import { UserEntity } from "./entity/user.entity";
import { CreateUserDTO } from "./dtos/create-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { UpdateUserDto } from "./dtos/update-user.dto";
import * as bcrypt from "bcrypt";

const BCRYPT_ROUNDS = 10;

@Injectable()
export class UserService {
    private readonly logger = new Logger(UserService.name);

    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) {}

    async findUserById(id: string): Promise<UserEntity> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) throw new NotFoundException(`Usuário ${id} não encontrado`);
        return user;
    }

    async findByEmail(email: string): Promise<UserEntity | null> {
        return this.userRepository.findOne({ where: { email } });
    }

    async createUser(userData: CreateUserDTO): Promise<UserEntity> {
        const existing = await this.findByEmail(userData.email);
        if (existing) throw new ConflictException("E-mail já cadastrado");

        const hashedPassword = await bcrypt.hash(userData.password, BCRYPT_ROUNDS);

        const user = this.userRepository.create({
            username: userData.username,
            email: userData.email,
            password: hashedPassword,
            user_level: 0,
            user_experience: 0,
        });

        const saved = await this.userRepository.save(user);
        this.logger.log(`Usuário criado: ${saved.id}`);
        return saved;
    }

    async updateUser(id: string, updateUserData: UpdateUserDto): Promise<UserEntity> {
        const user = await this.findUserById(id);

        if (updateUserData.email && updateUserData.email !== user.email) {
            const existing = await this.findByEmail(updateUserData.email);
            if (existing) throw new ConflictException("E-mail já cadastrado");
        }

        if (updateUserData.password) {
            updateUserData.password = await bcrypt.hash(updateUserData.password, BCRYPT_ROUNDS);
        }

        const updated = await this.userRepository.preload({ id, ...updateUserData });
        const savedUser = await this.userRepository.save(updated!);
        this.logger.log(`Usuário ${id} atualizado`);
        return savedUser;
    }

    async updateUserExperience(id: string, xpToAdd: number): Promise<{ message: string }> {
        const user = await this.findUserById(id);
        const newExperience = user.user_experience + xpToAdd;

        if (newExperience >= 1000) {
            const newLevel = user.user_level + 1;
            const remainingXp = newExperience - 1000;
            await this.userRepository.update({ id }, { user_experience: remainingXp, user_level: newLevel });
            this.logger.log(`Usuário ${id} subiu para o nível ${newLevel} com ${remainingXp} XP`);
            return { message: `Parabéns! Você subiu para o nível ${newLevel}` };
        }

        await this.userRepository.update({ id }, { user_experience: newExperience });
        this.logger.log(`Usuário ${id} XP atualizado: ${user.user_experience} -> ${newExperience}`);
        return { message: `XP atualizado para ${newExperience}` };
    }
}
