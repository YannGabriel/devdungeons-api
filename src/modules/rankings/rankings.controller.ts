import { Controller, Get, Query, Request } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { RankingsService } from "./rankings.service";
import { Public } from "../../auth/decorators/public.decorator";

@ApiTags("Rankings")
@Controller("rankings")
export class RankingsController {
    constructor(private readonly rankingsService: RankingsService) {}

    @Public()
    @Get()
    @ApiOperation({ summary: "Lista o ranking global de usuários por XP (público)" })
    @ApiQuery({ name: "page", required: false, type: Number, example: 1 })
    @ApiQuery({ name: "limit", required: false, type: Number, example: 10, description: "Máximo 100" })
    @ApiResponse({
        status: 200,
        description: "Ranking paginado com posição, nome, nível e XP de cada usuário",
    })
    async getRankings(
        @Query("page") page?: string,
        @Query("limit") limit?: string,
    ) {
        return this.rankingsService.getRankings(
            page ? parseInt(page, 10) : 1,
            limit ? parseInt(limit, 10) : 10,
        );
    }

    @Get("me")
    @ApiBearerAuth()
    @ApiOperation({ summary: "Retorna a posição do usuário autenticado no ranking" })
    async getMyPosition(@Request() req: { user: { id: string } }) {
        return this.rankingsService.getUserPosition(req.user.id);
    }
}
