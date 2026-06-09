import { Body, Controller, Get, HttpCode, HttpStatus, Post } from "@nestjs/common";
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from "@nestjs/swagger";
import { Throttle } from "@nestjs/throttler";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dtos/login.dto";
import { RegisterDto } from "./dtos/register.dto";
import { Public } from "./decorators/public.decorator";
import { CurrentUser } from "./decorators/current-user.decorator";
import type { JwtPayload } from "./interfaces/jwt-payload.interface";

@ApiTags("Auth")
@Controller("/auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Public()
    @Post("register")
    @HttpCode(HttpStatus.CREATED)
    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @ApiOperation({ summary: "Cadastrar novo usuário" })
    @ApiResponse({ status: 201, description: "Usuário criado e token gerado" })
    @ApiResponse({ status: 409, description: "E-mail já cadastrado" })
    @ApiResponse({ status: 400, description: "Dados inválidos" })
    async register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }

    @Public()
    @Post("login")
    @HttpCode(HttpStatus.OK)
    @Throttle({ default: { limit: 10, ttl: 60000 } })
    @ApiOperation({ summary: "Login — retorna access token e dados do usuário" })
    @ApiResponse({
        status: 200,
        description: "Login realizado com sucesso",
        schema: {
            example: {
                accessToken: "eyJhbGci...",
                refreshToken: "eyJhbGci...",
                expiresIn: 86400,
                user: {
                    id: "uuid",
                    username: "João Silva",
                    email: "joao@email.com",
                    role: "USER",
                    user_level: 0,
                    user_experience: 0,
                    languages: [],
                },
            },
        },
    })
    @ApiResponse({ status: 401, description: "Credenciais inválidas" })
    async login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }

    @Get("me")
    @ApiBearerAuth()
    @ApiOperation({ summary: "Retorna perfil completo do usuário autenticado" })
    @ApiResponse({
        status: 200,
        description: "Perfil do usuário",
        schema: {
            example: {
                id: "uuid",
                username: "João Silva",
                email: "joao@email.com",
                role: "USER",
                user_level: 2,
                user_experience: 350,
                languages: [
                    {
                        id: "uuid",
                        language: { id: "uuid", name: "JavaScript" },
                        level: { id: "uuid", name: "Básico", xp: 50 },
                    },
                ],
            },
        },
    })
    @ApiResponse({ status: 401, description: "Não autenticado" })
    async getMe(@CurrentUser() user: JwtPayload) {
        return this.authService.getMe(user.userId);
    }

    @Public()
    @Post("refresh")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Renovar access token usando refresh token" })
    @ApiResponse({ status: 200, description: "Novo par de tokens gerado" })
    @ApiResponse({ status: 401, description: "Refresh token inválido ou expirado" })
    async refresh(@Body("refreshToken") refreshToken: string) {
        return this.authService.refreshTokens(refreshToken);
    }
}
