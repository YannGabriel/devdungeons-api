import {
    ConflictException,
    Injectable,
    Logger,
    UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";
import { UserService } from "../modules/user/user.service";
import { UserLanguageLevelService } from "../modules/user-language-level/user-language-level.service";
import { LoginDto } from "./dtos/login.dto";
import { RegisterDto } from "./dtos/register.dto";
import { JwtPayload } from "./interfaces/jwt-payload.interface";

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}

export interface AuthResponse extends AuthTokens {
    user: UserProfile;
}

export interface UserProfile {
    id: string;
    username: string;
    email: string;
    role: string;
    user_level: number;
    user_experience: number;
    languages: LanguageAssociation[];
}

interface LanguageAssociation {
    id: string;
    language: { id: string; name: string };
    level: { id: string; name: string; xp: number };
}

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        private readonly userService: UserService,
        private readonly userLanguageLevelService: UserLanguageLevelService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    async register(dto: RegisterDto): Promise<AuthResponse> {
        const existing = await this.userService.findByEmail(dto.email);
        if (existing) throw new ConflictException("E-mail já cadastrado");

        const user = await this.userService.createUser({
            username: dto.username,
            email: dto.email,
            password: dto.password,
        });

        if (dto.languageIds?.length && dto.levelId) {
            for (const languageId of dto.languageIds) {
                try {
                    await this.userLanguageLevelService.create({
                        user_id: user.id,
                        language_id: languageId,
                        level_id: dto.levelId,
                    });
                } catch {
                    this.logger.warn(
                        `Não foi possível associar linguagem ${languageId} ao usuário ${user.id}`,
                    );
                }
            }
        }

        this.logger.log(`Novo registro: ${user.id}`);
        return this.buildAuthResponse(user.id, user.username, user.email, user.role);
    }

    async login(dto: LoginDto): Promise<AuthResponse> {
        const user = await this.userService.findByEmail(dto.email);

        if (!user || !(await bcrypt.compare(dto.password, user.password))) {
            throw new UnauthorizedException("Credenciais inválidas");
        }

        this.logger.log(`Login: ${user.id}`);
        return this.buildAuthResponse(user.id, user.username, user.email, user.role);
    }

    async getMe(userId: string): Promise<UserProfile> {
        const user = await this.userService.findUserById(userId);
        const associations = await this.userLanguageLevelService.findByUser(userId);

        return {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            user_level: user.user_level,
            user_experience: user.user_experience,
            languages: associations.map((a) => ({
                id: a.id,
                language: { id: a.language.id, name: a.language.name },
                level: { id: a.level.id, name: a.level.name, xp: a.level.xp },
            })),
        };
    }

    async refreshTokens(refreshToken: string): Promise<AuthTokens> {
        try {
            const payload = this.jwtService.verify<JwtPayload>(refreshToken, {
                secret: this.configService.getOrThrow("JWT_REFRESH_SECRET"),
            });

            const { accessToken, expiresIn } = await this.generateAccessToken(
                payload.userId,
                payload.username,
                payload.email,
                payload.role,
            );

            const newRefreshToken = await this.generateRefreshToken(
                payload.userId,
                payload.username,
                payload.email,
                payload.role,
            );

            return { accessToken, refreshToken: newRefreshToken, expiresIn };
        } catch {
            throw new UnauthorizedException("Refresh token inválido ou expirado");
        }
    }

    private async buildAuthResponse(
        userId: string,
        username: string,
        email: string,
        role: string,
    ): Promise<AuthResponse> {
        const [tokens, userProfile] = await Promise.all([
            this.generateTokenPair(userId, username, email, role),
            this.getMe(userId),
        ]);

        return { ...tokens, user: userProfile };
    }

    private async generateTokenPair(
        userId: string,
        username: string,
        email: string,
        role: string,
    ): Promise<AuthTokens> {
        const [accessToken, refreshToken, expiresIn] = await Promise.all([
            this.generateAccessToken(userId, username, email, role).then((t) => t.accessToken),
            this.generateRefreshToken(userId, username, email, role),
            Promise.resolve(Number(this.configService.get("JWT_EXPIRES_IN") ?? 86400)),
        ]);
        return { accessToken, refreshToken, expiresIn };
    }

    private async generateAccessToken(
        userId: string,
        username: string,
        email: string,
        role: string,
    ): Promise<{ accessToken: string; expiresIn: number }> {
        const expiresIn = Number(this.configService.get("JWT_EXPIRES_IN") ?? 86400);
        const payload: JwtPayload = { sub: userId, userId, username, email, role };
        const accessToken = await this.jwtService.signAsync(payload, {
            secret: this.configService.getOrThrow("JWT_SECRET"),
            expiresIn,
        });
        return { accessToken, expiresIn };
    }

    private async generateRefreshToken(
        userId: string,
        username: string,
        email: string,
        role: string,
    ): Promise<string> {
        const payload: JwtPayload = { sub: userId, userId, username, email, role };
        return this.jwtService.signAsync(payload, {
            secret: this.configService.getOrThrow("JWT_REFRESH_SECRET"),
            expiresIn: this.configService.get("JWT_REFRESH_EXPIRES_IN") ?? "7d",
        });
    }
}
