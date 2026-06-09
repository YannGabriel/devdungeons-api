import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { JwtPayload } from "../interfaces/jwt-payload.interface";

/**
 * Extrai o payload do JWT do request.
 * Uso: @CurrentUser() user: JwtPayload
 *      @CurrentUser('userId') id: string
 */
export const CurrentUser = createParamDecorator(
    (data: keyof JwtPayload | undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const user = request.user as JwtPayload;
        return data ? user?.[data] : user;
    },
);
