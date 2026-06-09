import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";

export class UpdateUserDto {
    @ApiPropertyOptional({ example: "João Silva" })
    @IsOptional()
    @IsString()
    username?: string;

    @ApiPropertyOptional({ example: "joao@email.com" })
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiPropertyOptional({ example: "novasenha", minLength: 6 })
    @IsOptional()
    @IsString()
    @MinLength(6)
    password?: string;
}
